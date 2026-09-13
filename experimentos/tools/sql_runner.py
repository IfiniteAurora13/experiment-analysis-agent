from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class QueryResult:
    sql: str
    rows: list[dict[str, Any]]


class SqlRunner:
    """Read-only SQL execution abstraction.

    v1 只定义边界，不直接连真实数据源。
    后续可以在这里接 DuckDB / Hive / Trino / ClickHouse。
    """

    def execute(self, sql: str) -> QueryResult:
        raise NotImplementedError("请在具体环境里实现只读 SQL 执行器。")


class DuckDBReadOnlyRunner(SqlRunner):
    def __init__(self, database_path: str) -> None:
        self.database_path = database_path

    def execute(self, sql: str) -> QueryResult:
        try:
            import duckdb
        except ModuleNotFoundError as exc:
            raise RuntimeError(
                "当前环境未安装 duckdb。请先安装 duckdb，或切换到已提供 DuckDB 的运行环境。"
            ) from exc

        lowered = sql.strip().lower()
        if not (lowered.startswith("select") or lowered.startswith("with")):
            raise ValueError("只允许只读 SELECT / WITH 查询。")
        if ";" in lowered.rstrip(";"):
            raise ValueError("只允许单条查询。")

        con = duckdb.connect(self.database_path, read_only=True)
        try:
            cursor = con.execute(sql)
            columns = [item[0] for item in cursor.description]
            rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
            return QueryResult(sql=sql, rows=rows)
        finally:
            con.close()
