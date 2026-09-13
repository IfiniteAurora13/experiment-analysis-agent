from __future__ import annotations

from experimentos.models import ExperimentRequest


class IntentRouter:
    """Rule-based fallback router for v1."""

    def resolve(self, request: ExperimentRequest) -> str:
        if request.task_type:
            return request.task_type

        question = request.question.lower()
        if any(token in question for token in ["分群", "人群", "segment", "cohort"]):
            return "segment_diagnosis"
        if any(token in question for token in ["质量", "srm", "实验是否可信", "埋点", "样本比"]):
            return "quality_check"
        if any(token in question for token in ["发布", "上线", "rollout", "canary"]):
            return "release_recommendation"
        if any(token in question for token in ["归因", "为什么", "拆解", "驱动"]):
            return "driver_analysis"
        return "experiment_recap"


class LLMIntentRouter(IntentRouter):
    """LLM-powered intent router with keyword fallback.

    Uses the classify.md prompt to let the LLM determine the task type.
    Falls back to keyword matching when the LLM is unavailable or returns
    an unrecognized result.
    """

    VALID_TYPES = frozenset({
        "experiment_recap",
        "quality_check",
        "segment_diagnosis",
        "release_recommendation",
        "driver_analysis",
    })

    def __init__(self, llm_client, prompt_path: str | None = None) -> None:
        super().__init__()
        self._llm = llm_client
        self._prompt_path = prompt_path
        self._classify_prompt: str | None = None

    def resolve(self, request: ExperimentRequest) -> str:
        if request.task_type:
            return request.task_type

        try:
            result = self._llm_classify(request.question)
            if result in self.VALID_TYPES:
                return result
        except Exception:
            pass

        return super().resolve(request)

    def _llm_classify(self, question: str) -> str:
        system_prompt = self._load_classify_prompt()
        user_prompt = f"请把当前问题分类为以下一种：\n\n{question}"
        raw = self._llm.complete(system_prompt, user_prompt).strip()
        for token in self.VALID_TYPES:
            if token in raw:
                return token
        return raw

    def _load_classify_prompt(self) -> str:
        if self._classify_prompt is not None:
            return self._classify_prompt
        path = self._prompt_path
        if path is None:
            from pathlib import Path
            path = str(Path(__file__).resolve().parent.parent / "prompts" / "classify.md")
        self._classify_prompt = open(path, encoding="utf-8").read()
        return self._classify_prompt
