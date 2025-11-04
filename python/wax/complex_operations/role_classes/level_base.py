from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Generic, Literal, TypeVar

TRole = TypeVar("TRole", bound=Literal["memo", "active", "owner", "posting"])
"""Type variable for role names."""


class LevelBase(ABC, Generic[TRole]):
    """
    All role levels should inherit from this class.

    Please remember to include role/level name in the TRole type-var
    """

    def __init__(self, level: TRole) -> None:
        self._level = level

    @property
    def level(self) -> TRole:
        """Role level name. Should be unique."""
        return self._level

    @property
    @abstractmethod
    def changed(self) -> bool:
        """Indicates if the level has changed since the last update."""

    @abstractmethod
    def enforce_modifications(self) -> None:
        """Enforces that the modifications are applied during the next operation generation."""

    @property
    @abstractmethod
    def value(self) -> Any:  # noqa: ANN401
        """Returns the value of the level."""

    @abstractmethod
    def reset(self) -> None:
        """Resets the level to the initial state."""
