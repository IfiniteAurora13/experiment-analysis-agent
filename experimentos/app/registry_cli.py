from __future__ import annotations

import argparse
import json
from dataclasses import asdict

from experimentos.tools.gec_ds_provider import GecDsRegistryProvider
from experimentos.tools.metric_registry import MetricRegistry


def main() -> None:
    parser = argparse.ArgumentParser(description="Resolve real metric registry entries from external providers.")
    parser.add_argument("metric_specs_path", help="Path to metric specs yaml.")
    parser.add_argument("--provider", choices=["gec-ds"], required=True)
    parser.add_argument("--skill-root", help="Optional local skill root path. Defaults to installed AgentBox skill source when omitted.")
    args = parser.parse_args()

    registry = MetricRegistry()
    specs = registry.load_metric_specs(args.metric_specs_path)

    if args.provider == "gec-ds":
        provider = GecDsRegistryProvider(args.skill_root)
        entries = provider.resolve_entries(specs)
        print(json.dumps([asdict(item) for item in entries], ensure_ascii=False, indent=2))
        return

    raise ValueError(f"unsupported provider: {args.provider}")
