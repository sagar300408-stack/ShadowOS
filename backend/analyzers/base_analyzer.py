from abc import ABC, abstractmethod
from typing import List

from backend.models.operational_intelligence import IntelligenceSignal
from backend.schemas.upload_schema import CanonicalRecord


class BaseOperationalAnalyzer(ABC):
    category: str

    @abstractmethod
    def analyze(self, records: List[CanonicalRecord]) -> List[IntelligenceSignal]:
        raise NotImplementedError
