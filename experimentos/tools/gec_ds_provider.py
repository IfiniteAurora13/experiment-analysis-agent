from __future__ import annotations

import json
import os
import subprocess
from pathlib import Path

from experimentos.models import MetricSpec, RegistryEntry


class GecDsRegistryProvider:
    """Optional local registry adapter configured outside this repository."""

    SKILL_ROOT_ENV = "EXPERIMENTOS_GEC_DS_SKILL_ROOT"

    def __init__(self, skill_root: str | None = None) -> None:
        self.skill_root = self._resolve_skill_root(skill_root)
        self.script_path = self.skill_root / "scripts" / "query_catalog.py"
        if not self.script_path.exists():
            raise FileNotFoundError(f"GEC-DS query script not found: {self.script_path}")

    def resolve_entries(self, specs: list[MetricSpec]) -> list[RegistryEntry]:
        entries: list[RegistryEntry] = []
        for spec in specs:
            group = self._query_group(spec.source_group_name) if spec.source_group_name else {}
            metric = self._query_metric_sql(spec.source_metric_name, spec.source_group_name) if spec.source_metric_name else {}

            group_item = self._pick_one(group)
            metric_item = self._pick_one(metric)
            warnings: list[str] = []
            if not group_item:
                warnings.append("group 未命中唯一目录项")
            if spec.source_metric_name and not metric_item:
                warnings.append("metric SQL 快照未命中；当前仅完成 group 级注册")

            entries.append(
                RegistryEntry(
                    name=spec.name,
                    provider="gec-ds-catalog",
                    kind=spec.kind,
                    role=spec.role,
                    direction=spec.direction,
                    unit=spec.unit,
                    source_group_name=spec.source_group_name,
                    source_metric_name=spec.source_metric_name,
                    gallery_id=self._to_int(group_item.get("gallery_id")) if group_item else None,
                    libra_group_id=self._to_int(group_item.get("libra_group_id")) if group_item else None,
                    metric_id=self._to_int(metric_item.get("metric_id")) if metric_item else None,
                    owners=list(group_item.get("owners", [])) if group_item else [],
                    develop_owner=str(group_item.get("develop_owner", "")) if group_item else "",
                    source_tables=list(group_item.get("source_tables", [])) if group_item else [],
                    evidence_status=str(metric_item.get("evidence_status") or group_item.get("resolution_status") or ""),
                    notes=spec.notes,
                    warnings=warnings,
                    raw_group=group_item or {},
                    raw_metric=metric_item or {},
                )
            )
        return entries

    def _query_group(self, query: str) -> dict:
        return self._run(["group", query, "--limit", "5"])

    def _query_metric_sql(self, query: str, group: str) -> dict:
        cmd = ["metric-sql", query, "--limit", "5"]
        if group:
            cmd.extend(["--group", group])
        return self._run(cmd)

    def _run(self, args: list[str]) -> dict:
        cmd = ["python3", str(self.script_path), *args]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return json.loads(result.stdout)

    def _pick_one(self, payload: dict) -> dict:
        items = payload.get("items", [])
        return items[0] if items else {}

    def _to_int(self, value):
        if value in (None, ""):
            return None
        return int(value)

    def _resolve_skill_root(self, skill_root: str | None) -> Path:
        candidates: list[Path] = []
        if skill_root:
            candidates.append(Path(skill_root))
        if os.environ.get(self.SKILL_ROOT_ENV):
            candidates.append(Path(os.environ[self.SKILL_ROOT_ENV]))

        for candidate in candidates:
            script = candidate / "scripts" / "query_catalog.py"
            if script.exists():
                return candidate

        raise FileNotFoundError(
            f"未配置可选 registry adapter。请显式设置 {self.SKILL_ROOT_ENV} 或 registry_skill_root。"
        )
