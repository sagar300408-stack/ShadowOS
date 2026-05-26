from dataclasses import dataclass, field


@dataclass(frozen=True)
class GraphPosition:
    x: float
    y: float


@dataclass(frozen=True)
class GraphNode:
    id: str
    label: str
    node_type: str
    position: GraphPosition
    category: str | None = None
    severity: str | None = None
    owner: str | None = None
    metadata: dict[str, str | int | float | bool] = field(default_factory=dict)


@dataclass(frozen=True)
class GraphEdge:
    id: str
    source: str
    target: str
    label: str | None = None
    animated: bool = False
    metadata: dict[str, str | int | float | bool] = field(default_factory=dict)


@dataclass(frozen=True)
class WorkflowGraphPair:
    before: dict[str, list[GraphNode] | list[GraphEdge]]
    after: dict[str, list[GraphNode] | list[GraphEdge]]

