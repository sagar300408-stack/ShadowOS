from abc import ABC, abstractmethod

from backend.models.operational_intelligence import IntelligenceSignal, WorkflowRecord


class BaseOperationalAnalyzer(ABC):
    category: str

    @abstractmethod
    def analyze(self, records: list[WorkflowRecord]) -> list[IntelligenceSignal]:
        raise NotImplementedError

