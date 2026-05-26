from pathlib import Path
from string import Template
from typing import Any


class PromptTemplateLoader:
    def __init__(self, prompt_dir: Path | None = None) -> None:
        self.prompt_dir = prompt_dir or Path(__file__).resolve().parent

    def render(self, template_name: str, **context: Any) -> str:
        template_path = self.prompt_dir / template_name
        template = Template(template_path.read_text(encoding="utf-8"))
        safe_context = {key: self._stringify(value) for key, value in context.items()}
        return template.safe_substitute(safe_context)

    def _stringify(self, value: Any) -> str:
        if isinstance(value, str):
            return value
        return repr(value)

