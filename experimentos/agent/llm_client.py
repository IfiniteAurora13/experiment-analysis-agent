"""LLM client abstraction for ExperimentOS narrative layer.

Provides a pluggable backend so the same code can run against:
- OpenAI-compatible APIs (including internal proxies)
- Mock backend for testing / offline use
- Future: gdpa-cli agent bridge
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from typing import Any, Protocol


@dataclass
class LlmConfig:
    """Configuration for LLM backend."""

    provider: str = "openai"  # openai | mock
    model: str = "gpt-4o"
    base_url: str | None = None
    api_key: str | None = None
    temperature: float = 0.3
    max_tokens: int = 2048
    extra: dict[str, Any] = field(default_factory=dict)

    @classmethod
    def from_env(cls) -> "LlmConfig":
        return cls(
            provider=os.environ.get("EXPERIMENTOS_LLM_PROVIDER", "openai"),
            model=os.environ.get("EXPERIMENTOS_LLM_MODEL", "gpt-4o"),
            base_url=os.environ.get("EXPERIMENTOS_LLM_BASE_URL"),
            api_key=os.environ.get("EXPERIMENTOS_LLM_API_KEY"),
            temperature=float(os.environ.get("EXPERIMENTOS_LLM_TEMPERATURE", "0.3")),
            max_tokens=int(os.environ.get("EXPERIMENTOS_LLM_MAX_TOKENS", "2048")),
        )


class LlmBackend(Protocol):
    """Protocol that any LLM backend must satisfy."""

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        ...


class MockLlmBackend:
    """No-op backend for testing — returns canned responses."""

    def __init__(self, canned: str = "") -> None:
        self._canned = canned
        self.calls: list[dict[str, str]] = []

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        self.calls.append({"system": system_prompt, "user": user_prompt})
        if self._canned:
            return self._canned
        return "（mock LLM 响应）"


class OpenAICompatibleBackend:
    """Backend that speaks the OpenAI chat completions protocol."""

    def __init__(self, config: LlmConfig) -> None:
        self._config = config
        self._client: Any = None

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        client = self._get_client()
        messages: list[dict[str, str]] = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": user_prompt})

        response = client.chat.completions.create(
            model=self._config.model,
            messages=messages,
            temperature=self._config.temperature,
            max_tokens=self._config.max_tokens,
        )
        return response.choices[0].message.content or ""

    def _get_client(self) -> Any:
        if self._client is not None:
            return self._client
        try:
            from openai import OpenAI
        except ModuleNotFoundError as exc:
            raise RuntimeError(
                "openai 包未安装。请执行 pip install openai 或设置 EXPERIMENTOS_LLM_PROVIDER=mock。"
            ) from exc

        kwargs: dict[str, Any] = {}
        if self._config.base_url:
            kwargs["base_url"] = self._config.base_url
        if self._config.api_key:
            kwargs["api_key"] = self._config.api_key
        self._client = OpenAI(**kwargs)
        return self._client


class LlmClient:
    """High-level LLM client with prompt loading and config management.

    Usage:
        # From env vars
        client = LlmClient.from_env()

        # Explicit config
        client = LlmClient(LlmConfig(provider="openai", model="gpt-4o"))

        # For testing
        client = LlmClient(LlmConfig(provider="mock"), canned="分类结果：experiment_recap")
    """

    def __init__(self, config: LlmConfig | None = None, canned: str = "") -> None:
        self.config = config or LlmConfig()
        self._canned = canned
        self._backend: LlmBackend | None = None

    @classmethod
    def from_env(cls, canned: str = "") -> "LlmClient":
        return cls(config=LlmConfig.from_env(), canned=canned)

    def complete(self, system_prompt: str, user_prompt: str) -> str:
        return self._resolve_backend().complete(system_prompt, user_prompt)

    def _resolve_backend(self) -> LlmBackend:
        if self._backend is not None:
            return self._backend
        if self.config.provider == "mock":
            self._backend = MockLlmBackend(canned=self._canned)
        elif self.config.provider == "openai":
            self._backend = OpenAICompatibleBackend(self.config)
        else:
            raise ValueError(f"不支持的 LLM provider: {self.config.provider}")
        return self._backend
