from __future__ import annotations

from pathlib import Path

import duckdb


def main() -> None:
    db_path = Path(__file__).with_name("demo.duckdb")
    if db_path.exists():
        db_path.unlink()

    con = duckdb.connect(str(db_path))
    try:
        con.execute(
            """
            CREATE TABLE experiment_daily_metrics (
                ds DATE,
                variant VARCHAR,
                exposures BIGINT,
                clicks BIGINT,
                gmv_sum DOUBLE,
                gmv_sum_sq DOUBLE
            )
            """
        )

        con.execute(
            """
            CREATE TABLE experiment_segment_metrics (
                ds DATE,
                user_type VARCHAR,
                variant VARCHAR,
                exposures BIGINT,
                clicks BIGINT
            )
            """
        )

        daily_rows = [
            ("2026-09-01", "control", 2200, 231, 12.40),
            ("2026-09-01", "treatment", 2230, 261, 12.08),
            ("2026-09-02", "control", 2250, 235, 12.35),
            ("2026-09-02", "treatment", 2240, 259, 12.03),
            ("2026-09-03", "control", 2180, 228, 12.50),
            ("2026-09-03", "treatment", 2260, 263, 12.09),
            ("2026-09-04", "control", 2210, 232, 12.45),
            ("2026-09-04", "treatment", 2245, 261, 12.07),
            ("2026-09-05", "control", 2230, 236, 12.42),
            ("2026-09-05", "treatment", 2240, 259, 12.12),
            ("2026-09-06", "control", 2240, 235, 12.38),
            ("2026-09-06", "treatment", 2235, 257, 12.14),
            ("2026-09-07", "control", 2210, 232, 12.37),
            ("2026-09-07", "treatment", 2240, 258, 12.11),
            ("2026-09-08", "control", 2230, 237, 12.43),
            ("2026-09-08", "treatment", 2240, 261, 12.09),
            ("2026-09-09", "control", 2250, 234, 12.30),
            ("2026-09-09", "treatment", 2220, 259, 12.17),
        ]
        # Store aggregate first and second moments. The SQL demo can then
        # reconstruct a user-level sample variance instead of incorrectly
        # using variance across daily means.
        daily_rows = [
            (day, variant, exposures, clicks, exposures * mean, exposures * (mean**2 + 85.0))
            for day, variant, exposures, clicks, mean in daily_rows
        ]
        con.executemany(
            "INSERT INTO experiment_daily_metrics VALUES (?, ?, ?, ?, ?, ?)",
            daily_rows,
        )

        segment_rows = [
            ("2026-09-09", "new_user", "control", 6000, 540),
            ("2026-09-09", "new_user", "treatment", 6100, 671),
            ("2026-09-09", "returning_user", "control", 14000, 1560),
            ("2026-09-09", "returning_user", "treatment", 14050, 1666),
        ]
        con.executemany(
            "INSERT INTO experiment_segment_metrics VALUES (?, ?, ?, ?, ?)",
            segment_rows,
        )
    finally:
        con.close()

    print(f"created demo database: {db_path}")


if __name__ == "__main__":
    main()
