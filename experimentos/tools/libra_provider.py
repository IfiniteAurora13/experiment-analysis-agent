from __future__ import annotations

import json
import subprocess
from pathlib import Path

from experimentos.models import DataSourceConfig, MetricInput, MetricSpec


class LibraAccessError(RuntimeError):
    pass


class LibraProvider:
    def build_metrics(self, config: DataSourceConfig, specs: list[MetricSpec]) -> tuple[list[MetricInput], dict]:
        if not config.flight_id:
            raise ValueError("Libra provider 缺少 flight_id。")
        if not config.metric_group_id:
            raise ValueError("Libra provider 缺少 metric_group_id。")

        report = self._load_report(config)
        report_data = self._unwrap_payload(report)
        rows = report_data.get("table_rows") or report_data.get("rows") or []
        if not rows:
            raise ValueError("Libra report 返回为空，无法构造指标。")

        built: list[MetricInput] = []
        for spec in specs:
            row = self._match_row(rows, spec)
            if not row:
                continue
            built.append(self._row_to_metric(spec, row))
        return built, self._extract_scope(report_data, config)

    def _load_report(self, config: DataSourceConfig) -> dict:
        if config.report_fixture_path:
            return json.loads(Path(config.report_fixture_path).read_text(encoding="utf-8"))
        if not config.allow_live_provider:
            raise RuntimeError(
                "线上 provider 默认关闭。请提供 report_fixture_path，或显式设置 allow_live_provider=true。"
            )

        payload = {
            "action": "get_report",
            "flight_id": config.flight_id,
            "metric_group_id": config.metric_group_id,
        }
        if config.app_id:
            payload["app_id"] = config.app_id
        if config.vregion:
            payload["vregion"] = config.vregion

        result = self._run_libra(config.session_id, payload)
        report = self._unwrap_payload(result)
        if report.get("inline_truncated"):
            file_path = report.get("file_path") or report.get("result_file")
            if not file_path:
                raise RuntimeError("Libra 返回 inline_truncated=true，但未提供 file_path/result_file。")
            report = self._unwrap_payload(json.loads(Path(file_path).read_text(encoding="utf-8")))
        return report

    def _run_libra(self, session_id: str, payload: dict) -> dict:
        cmd = ["gdpa-cli", "run", "libra"]
        if session_id:
            cmd.extend(["--session-id", session_id])
        cmd.extend(["--input", json.dumps(payload, ensure_ascii=False)])
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        except subprocess.CalledProcessError as exc:
            combined = "\n".join(part for part in [exc.stdout, exc.stderr] if part).strip()
            error_code = self._extract_error_code(combined)
            if error_code in {"APP_ACCESS_FORBIDDEN", "IDENTITY_RESOLUTION_FORBIDDEN", "OBJECT_NOT_FOUND"}:
                raise LibraAccessError(
                    "Blocked by Libra access\n"
                    f"- target: report\n"
                    f"- identifiers: flight_id={payload.get('flight_id')}, app_id={payload.get('app_id')}, "
                    f"vregion={payload.get('vregion')}, metric_group_id={payload.get('metric_group_id')}\n"
                    f"- evidence: Libra returned {error_code}\n"
                    "- next step: ask the owner for access or provide another readable target"
                ) from exc
            raise RuntimeError(f"Libra report 调用失败：{combined[:1000]}") from exc

        text = result.stdout.strip()
        try:
            return json.loads(text)
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"无法解析 Libra 输出为 JSON：{text[:500]}") from exc

    def _unwrap_payload(self, payload: dict) -> dict:
        current = payload
        while isinstance(current, dict) and isinstance(current.get("data"), dict):
            current = current["data"]
        return current

    def _match_row(self, rows: list[dict], spec: MetricSpec) -> dict | None:
        target_names = [value for value in [spec.source_metric_name, spec.name] if value]
        for row in rows:
            metric_name = str(row.get("metric_name", "")).strip()
            for target in target_names:
                if metric_name.lower() == target.lower():
                    return row
        if spec.source_metric_id is not None:
            for row in rows:
                value = row.get("metric_id")
                if value is not None and int(value) == spec.source_metric_id:
                    return row
        return None

    def _row_to_metric(self, spec: MetricSpec, row: dict) -> MetricInput:
        sample_size = self._parse_int(row.get("sample_size"))
        base_sample_size = self._parse_int(row.get("base_sample_size"))
        value = self._parse_metric_value(
            row.get("value"),
            row.get("value_display"),
            row.get("metric_value"),
            unit=spec.unit,
        )
        base_value = self._parse_metric_value(
            row.get("base_value"),
            row.get("base_value_display"),
            unit=spec.unit,
        )
        p_value = self._parse_float(row.get("p_value") or row.get("p_value_display"))
        ci_low = self._parse_metric_value(
            row.get("ci_low") or row.get("diff_ci_low") or row.get("confidence_interval_low"),
            unit=spec.unit,
        )
        ci_high = self._parse_metric_value(
            row.get("ci_high") or row.get("diff_ci_high") or row.get("confidence_interval_high"),
            unit=spec.unit,
        )
        significant = self._parse_bool(
            row.get("significant")
            or row.get("is_significant")
            or row.get("isSignificant")
        )

        if base_value is None or value is None:
            raise ValueError(f"Libra 指标 {spec.name} 缺少 base/value。")

        control_successes = self._parse_int(row.get("base_successes") or row.get("control_successes"))
        treatment_successes = self._parse_int(row.get("successes") or row.get("treatment_successes"))
        control_var = self._parse_float(row.get("base_var") or row.get("control_var"))
        treatment_var = self._parse_float(row.get("var") or row.get("treatment_var"))

        statistical_source = "computed"
        if p_value is not None or ci_low is not None or ci_high is not None or significant is not None:
            statistical_source = "libra_platform"

        return MetricInput(
            name=spec.name,
            kind=spec.kind,
            role=spec.role,
            direction=spec.direction,
            unit=spec.unit,
            control_n=base_sample_size or 0,
            treatment_n=sample_size or 0,
            control_value=base_value,
            treatment_value=value,
            control_var=control_var,
            treatment_var=treatment_var,
            control_successes=control_successes,
            treatment_successes=treatment_successes,
            statistical_source=statistical_source,
            platform_p_value=p_value,
            platform_ci_low=ci_low,
            platform_ci_high=ci_high,
            platform_significant=significant,
            platform_summary="Libra report 平台统计",
            metadata={
                "metric_name": row.get("metric_name"),
                "version_name": row.get("version_name"),
                "base_version_name": row.get("base_version_name"),
                "diff_pct_display": row.get("diff_pct_display"),
            },
        )

    def _extract_scope(self, report: dict, config: DataSourceConfig) -> dict:
        query = report.get("query", {})
        defaults = report.get("defaults_applied", {})
        return {
            "flight_id": query.get("flight_id", config.flight_id),
            "app_id": query.get("app_id", config.app_id),
            "vregion": query.get("vregion", config.vregion),
            "metric_group_id": query.get("metric_group_id", config.metric_group_id),
            "metric_group_name": report.get("metric_group_name") or report.get("table_name") or "",
            "start_date": query.get("start_date") or defaults.get("start_date") or "",
            "end_date": query.get("end_date") or defaults.get("end_date") or "",
            "data_region": query.get("data_region") or defaults.get("data_region") or "",
            "data_caliber": query.get("data_caliber") or defaults.get("data_caliber") or "",
            "merge_type": query.get("merge_type") or defaults.get("merge_type") or "",
            "confidence_threshold": (
                query.get("confidence_threshold")
                or query.get("significance_level")
                or defaults.get("confidence_threshold")
                or defaults.get("significance_level")
                or ""
            ),
            "multi_comparison_correction": (
                query.get("mult_cmp_corr")
                or query.get("multi_comparison_correction")
                or defaults.get("mult_cmp_corr")
                or defaults.get("multi_comparison_correction")
                or ""
            ),
        }

    def _extract_error_code(self, text: str) -> str:
        for code in ["APP_ACCESS_FORBIDDEN", "IDENTITY_RESOLUTION_FORBIDDEN", "OBJECT_NOT_FOUND"]:
            if code in text:
                return code
        return ""

    def _parse_metric_value(self, *candidates, unit: str = ""):
        for value in candidates:
            parsed = self._parse_float(value)
            if parsed is None:
                continue
            if self._looks_like_percent(value, unit):
                return parsed / 100.0
            return parsed
        return None

    def _looks_like_percent(self, value, unit: str) -> bool:
        text = "" if value is None else str(value)
        return "%" in text or unit == "%"

    def _parse_bool(self, value):
        if value is None:
            return None
        if isinstance(value, bool):
            return value
        text = str(value).strip().lower()
        if text in {"true", "1", "yes", "y"}:
            return True
        if text in {"false", "0", "no", "n"}:
            return False
        return None

    def _parse_float(self, value):
        if value is None:
            return None
        text = str(value).strip().replace("%", "").replace(",", "")
        if not text:
            return None
        return float(text)

    def _parse_int(self, value):
        if value is None:
            return None
        text = str(value).strip().replace(",", "")
        if not text:
            return None
        return int(float(text))
