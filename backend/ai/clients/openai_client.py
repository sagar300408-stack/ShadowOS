from backend.config.settings import Settings, get_settings


class OpenAIServiceUnavailable(RuntimeError):
    pass


class OpenAIService:
    def __init__(self, settings: Settings | None = None) -> None:
        self.settings = settings or get_settings()
        self._client = None

    @property
    def is_configured(self) -> bool:
        return bool(self.settings.openai_api_key and self.settings.ai_enabled)

    async def generate_text(self, *, instructions: str, prompt: str) -> str:
        if not self.is_configured:
            raise OpenAIServiceUnavailable("OpenAI is not configured. Set OPENAI_API_KEY and SHADOWOS_AI_ENABLED=true.")

        client = self._get_client()
        response = await client.responses.create(
            model=self.settings.openai_model,
            instructions=instructions,
            input=prompt,
        )
        return self._extract_text(response)

    def _get_client(self):
        if self._client is not None:
            return self._client

        try:
            from openai import AsyncOpenAI
        except ImportError as exc:
            raise OpenAIServiceUnavailable("Install the openai Python package to enable AI orchestration.") from exc

        self._client = AsyncOpenAI(
            api_key=self.settings.openai_api_key,
            timeout=self.settings.openai_timeout_seconds,
        )
        return self._client

    def _extract_text(self, response) -> str:
        output_text = getattr(response, "output_text", None)
        if output_text:
            return output_text.strip()

        output = getattr(response, "output", None) or []
        fragments: list[str] = []
        for item in output:
            content = getattr(item, "content", None) or []
            for block in content:
                text = getattr(block, "text", None)
                if text:
                    fragments.append(text)

        return "\n".join(fragments).strip()

