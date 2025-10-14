from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Final, Iterable, cast

from wax._private.base_api import WaxBaseApi
from wax._private.operation_base import ConvertedToProtoOperation, OperationBase
from wax._private.proto.recurrent_transfer_extension_pb2 import recurrent_transfer_extension, recurrent_transfer_pair_id
from wax.exceptions.asset_errors import UnexpectedAssetTypeError
from wax.models.asset import AssetName, NaiAsset
from wax.proto.operations import recurrent_transfer

if TYPE_CHECKING:
    from wax import IWaxBaseInterface
    from wax.models.basic import AccountName

DEFAULT_EXECUTIONS: Final[int] = 2
DEFAULT_RECURRENCE: Final[int] = 24


@dataclass
class RecurrentTransferData:
    from_account: AccountName
    to_account: AccountName
    amount: NaiAsset | None = None  # In case of removal - amount is not needed.
    pair_id: int | None = None
    executions: int = DEFAULT_EXECUTIONS
    recurrence: int = DEFAULT_RECURRENCE
    memo: str = ""


class RecurrentTransferOperationBase(OperationBase):
    def __init__(self, data: RecurrentTransferData) -> None:
        super().__init__()
        self.data = data
        self.recurrent_transfer = self.get_recurrent_transfer_proto_operation() if data.amount is not None else None

    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        if not cast(WaxBaseApi, api).check_is_proper_asset(
            [AssetName.Hive, AssetName.Hbd], self.recurrent_transfer.amount
        ):
            raise UnexpectedAssetTypeError(self.recurrent_transfer.amount, [AssetName.Hive, AssetName.Hbd])

        return [self.recurrent_transfer]

    def get_recurrent_transfer_proto_operation(self) -> recurrent_transfer:
        """
        Creates recurrent_transfer operation.

        Returns:
            A recurrent transfer operation.
        """
        return recurrent_transfer(
            from_account=self.data.from_account,
            to_account=self.data.to_account,
            amount=self.data.amount,
            extensions=[self._get_default_extensions(self.data.pair_id)] if self.data.pair_id is not None else [],
            executions=self.data.executions,
            recurrence=self.data.recurrence,
            memo=self.data.memo,
        )

    def _get_default_extensions(self, pair_id: int) -> recurrent_transfer_extension:
        """
        Creates a recurrent transfer extension with the specified pair ID.

        Args:
            pair_id: The unique identifier for the recurrent transfer pair.

        Raises:
            ValueError: If the provided pair_id is less than or equal to zero.

        Returns:
            recurrent_transfer_extension: The protobuf extension with the pair ID set.
        """
        if pair_id <= 0:
            raise ValueError("Pair id must be greater than 0")

        return recurrent_transfer_extension(recurrent_transfer_pair_id=recurrent_transfer_pair_id(pair_id=pair_id))


class DefineRecurrentTransferOperation(RecurrentTransferOperationBase):
    """
    Operation class for defining a recurrent transfer.

    This class validates that the amount is greater than zero and
    provides a name identifier for the operation.

    Raises:
        ValueError: If the transfer amount is less than or equal to zero or is None.
    """

    def __init__(self, data: RecurrentTransferData) -> None:
        amount = data.amount

        if amount is None:
            raise ValueError("Amount of the recurrent transfer must be provided.")

        if int(amount.amount) <= 0:
            raise ValueError("Amount of the recurrent transfer must be greater than 0.")
        super().__init__(data)


class RecurrentTransferRemovalOperation(RecurrentTransferOperationBase):
    """
    Operation class for removing a recurrent transfer.

    Ensures that amount is set to zero if not provided or invalid.
    """

    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        if self.data.amount is None:
            self.data.amount = api.hive.satoshis(0)

        self.recurrent_transfer = self.get_recurrent_transfer_proto_operation()
        return super().finalize(api)
