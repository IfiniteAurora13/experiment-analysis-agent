from pathlib import Path

from streamlit.testing.v1 import AppTest


APP = str(Path(__file__).resolve().parents[1] / "experimentos/app/streamlit_app.py")


def test_product_flow_requires_confirmation_and_clears_stale_results():
    app = AppTest.from_file(APP).run(timeout=30)
    assert not app.exception
    assert any(item.value == "请先确认口径与水位" for item in app.subheader)
    app.checkbox[0].set_value(True)
    next(button for button in app.button if button.label == "确认当前版本并生成评审卡").click().run(timeout=30)
    assert not app.exception
    assert any(item.value == "可进入人工发布评审" for item in app.subheader)
    app.selectbox[0].set_value("immature").run(timeout=30)
    assert not app.exception
    assert any(item.value == "数据包需要修复" for item in app.subheader)
    assert not any(item.value == "可进入人工发布评审" for item in app.subheader)
    assert next(button for button in app.button if button.label == "确认当前版本并生成评审卡").disabled
    app.selectbox[0].set_value("clean").run(timeout=30)
    assert any(item.value == "请先确认口径与水位" for item in app.subheader)


def test_workbench_does_not_let_confirmation_override_srm():
    app = AppTest.from_file(APP).run(timeout=30)
    app.selectbox[0].set_value("srm").run(timeout=30)
    app.checkbox[0].set_value(True)
    next(button for button in app.button if button.label == "确认当前版本并生成评审卡").click().run(timeout=30)
    assert not app.exception
    assert any(item.value == "证据未通过复核" for item in app.subheader)
    assert next(button for button in app.button if button.label == "记录人工复核完成").disabled
