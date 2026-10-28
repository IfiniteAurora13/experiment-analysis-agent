from pathlib import Path
import pytest
from streamlit.testing.v1 import AppTest

APP = str(Path(__file__).resolve().parents[1] / "experimentos/app/streamlit_app.py")


@pytest.fixture(autouse=True)
def isolate_task_store(tmp_path, monkeypatch):
    monkeypatch.setenv("EXPERIMENTOS_TASK_STORE", str(tmp_path / "task.json"))


def button(app, label):
    return next(item for item in app.button if item.label == label)


def confirm(app):
    app.checkbox[0].set_value(True)
    button(app, "确认口径并分析").click().run(timeout=30)


def test_product_flow_requires_confirmation_and_clears_stale_results():
    app = AppTest.from_file(APP).run(timeout=30)
    assert not app.exception
    assert any(item.value == "请先确认口径与水位" for item in app.subheader)
    confirm(app)
    assert not app.exception
    assert any(item.value == "可进入人工发布评审" for item in app.subheader)
    app.selectbox[0].set_value("immature").run(timeout=30)
    assert not app.exception
    assert any(item.value == "数据包需要修复" for item in app.subheader)
    assert not any(item.value == "可进入人工发布评审" for item in app.subheader)
    assert not any(item.label == "确认口径并分析" for item in app.button)
    app.selectbox[0].set_value("clean").run(timeout=30)
    assert any(item.value == "请先确认口径与水位" for item in app.subheader)


def test_workbench_does_not_let_confirmation_override_srm():
    app = AppTest.from_file(APP).run(timeout=30)
    app.selectbox[0].set_value("srm").run(timeout=30)
    confirm(app)
    assert not app.exception
    assert any(item.value == "证据未通过复核" for item in app.subheader)
    assert not any(item.label == "记录人工复核完成" for item in app.button)


def test_material_conflict_resolves_and_continues_in_same_workbench():
    app = AppTest.from_file(APP).run(timeout=30)
    app.selectbox[0].set_value("material_conflict").run(timeout=30)
    assert not app.exception
    assert any(item.value == "先核对一个关键口径" for item in app.subheader)
    assert not app.metric
    app.checkbox[0].set_value(True)
    button(app, "确认契约，继续评审").click().run(timeout=30)
    assert any(item.value == "请先确认口径与水位" for item in app.subheader)
    confirm(app)
    assert not app.exception
    assert any(item.value == "可进入人工发布评审" for item in app.subheader)


def test_new_session_resumes_local_completed_task():
    first = AppTest.from_file(APP).run(timeout=30)
    confirm(first)
    resumed = AppTest.from_file(APP).run(timeout=30)
    assert not resumed.exception
    assert any(item.value == "可进入人工发布评审" for item in resumed.subheader)
    assert not any(item.label == "确认口径并分析" for item in resumed.button)


CUSTOM_DICTIONARY = "指标字典：支付转化率的分母为曝光用户；观察窗口为7天。"


def dictionary_field(app):
    return next(item for item in app.text_area if item.label == "指标字典 / 补充材料")


def test_custom_material_survives_resolution_confirmation_and_new_session():
    app = AppTest.from_file(APP).run(timeout=30)
    app.selectbox[0].set_value("guardrail_harm").run(timeout=30)
    dictionary_field(app).set_value(CUSTOM_DICTIONARY).run(timeout=30)
    assert any(item.value == "先核对一个关键口径" for item in app.subheader)
    app.checkbox[0].set_value(True)
    button(app, "确认契约，继续评审").click().run(timeout=30)
    confirm(app)
    before = app.session_state["review_agent"].state["version"]
    assert any(item.value == "不支持推进发布" for item in app.subheader)

    resumed = AppTest.from_file(APP).run(timeout=30)
    assert not resumed.exception
    assert dictionary_field(resumed).value == CUSTOM_DICTIONARY
    assert resumed.session_state["review_agent"].state["version"] == before
    assert any(item.value == "不支持推进发布" for item in resumed.subheader)


def test_material_drafts_are_preserved_per_case_without_leaking_to_other_cases():
    app = AppTest.from_file(APP).run(timeout=30)
    app.selectbox[0].set_value("guardrail_harm").run(timeout=30)
    dictionary_field(app).set_value(CUSTOM_DICTIONARY).run(timeout=30)
    app.selectbox[0].set_value("clean").run(timeout=30)
    assert dictionary_field(app).value == ""
    app.selectbox[0].set_value("guardrail_harm").run(timeout=30)
    assert dictionary_field(app).value == CUSTOM_DICTIONARY
    assert any(item.value == "先核对一个关键口径" for item in app.subheader)
