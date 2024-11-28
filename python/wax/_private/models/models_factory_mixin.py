from __future__ import annotations

from typing_extensions import Self

from schemas._preconfigured_base_model import PreconfiguredBaseModel


class ModelsFactoryMixin(PreconfiguredBaseModel):
    """Mixin that provides a factory method to create a model from a dict or model instance."""

    @classmethod
    def create(cls, model: dict | Self) -> Self:
        if isinstance(model, cls):
            return model
        return cls(**model)  # type: ignore[arg-type]
