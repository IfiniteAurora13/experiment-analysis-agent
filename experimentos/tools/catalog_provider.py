from __future__ import annotations

from experimentos.models import DataSourceConfig, MetricSpec


class CatalogProvider:
    def describe(self, config: DataSourceConfig, specs: list[MetricSpec]) -> list[dict]:
        return [
            {
                "name": spec.name,
                "provider": spec.provider,
                "entity": spec.entity,
                "owner": spec.owner,
                "source_metric_name": spec.source_metric_name,
                "source_metric_id": spec.source_metric_id,
                "notes": spec.notes,
                "catalog_query": config.catalog_query,
            }
            for spec in specs
        ]
