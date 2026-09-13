from __future__ import annotations

import argparse
import json
from pathlib import Path

from experimentos.agent.llm_client import LlmClient, LlmConfig
from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.models import ExperimentRequest


DEFAULT_MOCK_PLAN = {
    "goal": "判断商品详情页改版是否支持上线",
    "required_inputs": [],
    "skills": [
        "experiment_recap",
        "release_recommendation",
    ],
    "tools": [
        "analyze_metric",
        "make_recommendation",
    ],
    "reasoning_constraints": [
        "先检查实验质量",
        "不得将分群结果直接解释为因果",
    ],
}


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Run ExperimentOS v1 on a local JSON payload."
    )
    parser.add_argument("input", nargs="?", help="Path to JSON payload.")
    parser.add_argument(
        "--format",
        choices=["markdown", "json"],
        default="markdown",
    )
    parser.add_argument(
        "--trace",
        action="store_true",
        help="Show agent execution trace.",
    )
    parser.add_argument(
        "--init-demo-db",
        action="store_true",
        help="Create local DuckDB demo database.",
    )
    parser.add_argument(
        "--llm",
        choices=["off", "env", "mock"],
        default="off",
        help=(
            "LLM mode: off (rule-based), "
            "env (OpenAI-compatible API from env vars), "
            "mock (offline deterministic mock)."
        ),
    )
    parser.add_argument(
        "--mock-plan",
        default="",
        help="Path to a JSON file containing a mock structured planner response.",
    )
    parser.add_argument(
        "--llm-model",
        default="",
        help="Override LLM model (only with --llm env).",
    )
    parser.add_argument(
        "--llm-base-url",
        default="",
        help="Override LLM base URL (only with --llm env).",
    )
    parser.add_argument(
        "--llm-api-key",
        default="",
        help="Override LLM API key (only with --llm env).",
    )
    args = parser.parse_args()

    if args.init_demo_db:
        from examples.build_demo_duckdb import main as build_demo_db

        build_demo_db()
        return

    if not args.input:
        parser.error(
            "请提供 input JSON，或使用 --init-demo-db 初始化 demo 数据库。"
        )

    payload = json.loads(
        Path(args.input).read_text(encoding="utf-8")
    )
    request = ExperimentRequest.from_dict(payload)

    llm_client = _build_llm_client(args)
    orchestrator = ExperimentOrchestrator(llm_client=llm_client)
    report = orchestrator.run(request)

    if args.format == "json":
        if args.trace:
            print(_render_trace(report))

        print(
            json.dumps(
                report.to_dict(),
                ensure_ascii=False,
                indent=2,
            )
        )
        return

    if args.trace:
        print(_render_trace(report))

    print(orchestrator.render_markdown(report))


def _build_llm_client(args) -> LlmClient | None:
    if args.llm == "off":
        return None

    if args.llm == "mock":
        canned = json.dumps(
            DEFAULT_MOCK_PLAN,
            ensure_ascii=False,
        )

        if args.mock_plan:
            mock_path = Path(args.mock_plan)
            canned = mock_path.read_text(encoding="utf-8").strip()

            # Validate early so a bad mock file fails with a clear error.
            json.loads(canned)

        return LlmClient(
            config=LlmConfig(provider="mock"),
            canned=canned,
        )

    config = LlmConfig.from_env()

    if args.llm_model:
        config.model = args.llm_model
    if args.llm_base_url:
        config.base_url = args.llm_base_url
    if args.llm_api_key:
        config.api_key = args.llm_api_key

    return LlmClient(config=config)


def _render_trace(report) -> str:
    lines = [
        "",
        "========== Agent Execution Trace ==========",
        "",
        "Workflow:",
    ]

    for index, item in enumerate(
        report.workflow_trace,
        start=1,
    ):
        detail = item.detail or {}
        extras: list[str] = []

        if item.stage == "planner":
            skills = detail.get("skills", [])
            tools = detail.get("tools", [])

            if skills:
                extras.append(
                    f"skills={', '.join(skills)}"
                )
            if tools:
                extras.append(
                    f"tools={', '.join(tools)}"
                )

        if item.stage == "input_validation":
            missing_inputs = detail.get("missing_inputs", [])

            if missing_inputs:
                extras.append(
                    "missing_inputs="
                    + ", ".join(missing_inputs)
                )

        if item.stage == "result_validation":
            warning_count = detail.get(
                "warning_count",
                0,
            )
            extras.append(
                f"warnings={warning_count}"
            )

        suffix = (
            f" | {' | '.join(extras)}"
            if extras
            else ""
        )

        lines.append(
            f"[{index}] "
            f"{item.stage:<28} "
            f"{item.status.upper()}"
            f"{suffix}"
        )

    lines.extend(["", "Tool Calls:"])

    if not report.agent_trace:
        lines.append("[none]")

    for index, item in enumerate(
        report.agent_trace,
        start=1,
    ):
        tool_name = getattr(
            item,
            "tool_name",
            "unknown_tool",
        )
        status = getattr(
            item,
            "status",
            "unknown",
        )
        latency = getattr(
            item,
            "latency_ms",
            None,
        )

        suffix = (
            f" | latency={latency:.1f}ms"
            if latency is not None
            else ""
        )

        lines.append(
            f"[{index}] "
            f"{tool_name:<28} "
            f"{str(status).upper()}"
            f"{suffix}"
        )

    lines.extend(
        [
            "",
            "============================================",
            "",
        ]
    )

    return "\n".join(lines)


if __name__ == "__main__":
    main()