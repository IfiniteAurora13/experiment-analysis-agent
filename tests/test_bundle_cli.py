import json
import subprocess
import sys

from experimentos.demo_data import make_bundle


def test_cli_inspect_confirm_persist_and_reject_stale_confirmation(tmp_path):
    folder = tmp_path / "bundle"
    folder.mkdir()
    files = make_bundle()
    for name, data in files.items():
        (folder / name).write_bytes(data)
    command = [sys.executable, "-m", "experimentos.app.bundle_cli", str(folder), "--store", str(tmp_path / "ledger.json"), "--format", "json"]
    inspected = subprocess.run(command, capture_output=True, text=True, check=True)
    pending = json.loads(inspected.stdout)
    assert pending["status"] == "NEEDS_CONFIRMATION"
    confirmed = subprocess.run(command + ["--confirm-by", "演示负责人", "--snapshot", pending["snapshot_id"]], capture_output=True, text=True, check=True)
    assert json.loads(confirmed.stdout)["status"] == "REVIEW_READY"
    manifest = json.loads(files["manifest.json"])
    manifest["snapshot_at"] = "2026-09-16T13:00:00+08:00"
    (folder / "manifest.json").write_text(json.dumps(manifest), encoding="utf-8")
    stale = subprocess.run(command + ["--confirm-by", "演示负责人", "--snapshot", pending["snapshot_id"]], capture_output=True, text=True)
    assert stale.returncode == 2
    assert "旧确认不可复用" in stale.stderr
    assert "Traceback" not in stale.stderr
