from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = "ShadowOS"
    environment: str = os.getenv("SHADOWOS_ENV", "development")
    openai_api_key: str | None = os.getenv("OPENAI_API_KEY")
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-5-mini")
    openai_timeout_seconds: float = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "30"))
    ai_enabled: bool = os.getenv("SHADOWOS_AI_ENABLED", "true").lower() == "true"


def get_settings() -> Settings:
    return Settings()

