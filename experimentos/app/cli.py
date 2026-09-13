from __future__ import annotations

import argparse
import json
from pathlib import Path

from experimentos.agent.llm_client import LlmClient, LlmConfig
from experimentos.agent.orchestrator import ExperimentOrchestrator
from experimentos.models import ExperimentRequest


def main() -> None:
    parser = argparse.ArgumentParser(description="Run ExperimentOS v1 on a local JSON payload.")
    parser.add_argument("input", nargs="?", help="Path to JSON payload.")
    parser.add_argument("--format", choices=["markdown", "json"], default="markdown")
    parser.add_argument("--init-demo-db", action="store_true", help="Create local DuckDB demo database.")
    parser.add_argument(
        "--llm",
        choices=["off", "env", "mock"],
        default="off",
        help="LLM narrative mode: off (rule-based), env (from env vars), mock (canned responses).",
    )
    parser.add_argument("--llm-model", default="", help="Override LLM model (only with --llm env).")
    parser.add_argument("--llm-base-url", default="", help="Override LLM base URL (only with --llm env).")
    parser.add_argument("--llm-api-key", default="", help="Override LLM API key (only with --llm env).")
    args = parser.parse_args()

    if args.init_demo_db:
        from examples.build_demo_duckdb import main as build_demo_db

        build_demo_db()
        return

    if not args.input:
        parser.error("请提供 input JSON，或使用 --init-demo-db 初始化 demo 数据库。")

    payload = json.loads(Path(args.input).read_text(encoding="utf-8"))
    request = ExperimentRequest.from_dict(payload)

    llm_client = _build_llm_client(args)
    orchestrator = ExperimentOrchestrator(llm_client=llm_client)
    report = orchestrator.run(request)

    if args.format == "json":
        print(json.dumps(report.to_dict(), ensure_ascii=False, indent=2))
        return

    print(orchestrator.render_markdown(report))


def _build_llm_client(args) -> LlmClient | None:
    if args.llm == "off":
        return None

    if args.llm == "mock":
        return LlmClient(config=LlmConfig(provider="mock"))

    config = LlmConfig.from_env()
    if args.llm_model:
        config.model = args.llm_model
    if args.llm_base_url:
        config.base_url = args.llm_base_url
    if args.llm_api_key:
        config.api_key = args.llm_api_key
    return LlmClient(config=config)


if __name__ == "__main__":
    main()
