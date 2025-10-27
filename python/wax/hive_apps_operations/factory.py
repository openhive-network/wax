from __future__ import annotations

import json
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING, Generic, Iterable, Self, TypeVar

from wax._private.operation_base import ConvertedToProtoOperation, OperationBase
from wax.exceptions import MissingAuthorityError
from wax.proto.operations import custom_json

if TYPE_CHECKING:
    from wax import IWaxBaseInterface
    from wax.proto.operations import operation


HiveAppsOperationDataT = TypeVar("HiveAppsOperationDataT", bound="HiveAppsOperationBaseData")
"""Type var represents data of the hive app operation."""


@dataclass
class HiveAppsOperationBaseData(ABC):
    """Base class for Hive Apps operation data structures."""

    @abstractmethod
    def to_dict(self) -> dict[str, int | str]:
        """Converts the operation data to a dictionary representation."""


class HiveAppsOperation(OperationBase, ABC, Generic[HiveAppsOperationDataT]):
    """
    Base class for all Hive Apps operations.

    Attributes:
        ops: List of proto operations representing the operations to be performed.
    """

    def __init__(self) -> None:
        self._body: list[HiveAppsOperationDataT] = []
        self.ops: list[operation] = []

    @property
    @abstractmethod
    def id(self) -> str: ...

    def authorize(
        self,
        required_posting_auths: list[str] | str,
        required_auths: list[str] | None = None,
    ) -> Self:
        """
        Authorizes the operation with the given posting and active authorities.

        Args:
            required_posting_auths: A single posting authority or a list of posting authorities.
            required_auths: A list of active authorities.

        Raises:
            WaxError: When required_posting_auths and required_auths not passed.
        """
        posting_auths = [required_posting_auths] if isinstance(required_posting_auths, str) else required_posting_auths
        auths = required_auths if required_auths is not None else []

        if not auths and not posting_auths:
            raise MissingAuthorityError

        for operation_in_body in self._body:
            op_as_dict = operation_in_body.to_dict()

            operation_name = next(iter(op_as_dict.keys()))
            operation_data = op_as_dict.get(operation_name)

            valid_json_field_format = [operation_name, operation_data]

            json_str = json.dumps(
                valid_json_field_format,
                default=lambda v: str(v) if isinstance(v, int) and abs(v) > (1 << 53) else v,
            )
            self.ops.append(
                custom_json(id=self.id, json=json_str, required_auths=auths, required_posting_auths=posting_auths)
            )

        self._body.clear()
        return self

    def get_operations(self) -> list[HiveAppsOperationDataT]:
        """
        Returns the list of all operations added.

        Notes:
            Please notice that after calling authorize method this list is cleared.

        Returns:
            List of operations.
        """
        return self._body

    def finalize(self, _api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        return self.ops
