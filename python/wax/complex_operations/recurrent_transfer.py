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
    """
    Data needed to define recurrent transfer operation.

    Attributes:
        from_account: Account to transfer asset from.
        to_account: Account to transfer asset to. Cannot set a transfer to yourself.
        amount: The amount of asset to transfer. Allowed assets: **HIVE** and **HBD**.
                 In case of removal - amount is not needed.
        pair_id: Since HF 28, if user has more than one recurrent transfer to the same receiver
                 or creates the recurrent transfer using `pair_id`, they must specify it in order
                 to update or remove the defined recurrent transfer.
        executions: How many times the recurrent payment will be executed.
                 Executions must be at least 2; if set to 1, the transfer will not execute.
        recurrence: How often the payment is triggered, in hours. First transfer is immediate.
                 Minimum value is 24 h.
        memo: Optional memo for the transfer. Must be shorter than 2048 characters.
    """

    from_account: AccountName
    to_account: AccountName
    amount: NaiAsset | None = None
    pair_id: int | None = None
    executions: int = DEFAULT_EXECUTIONS
    recurrence: int = DEFAULT_RECURRENCE
    memo: str = ""


class RecurrentTransferOperationBase(OperationBase):
    """Base class for the recurrent transfer define and removal classes."""

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

    - The `amount` must be strictly greater than zero. A `ValueError` is raised if `amount` is None or 0.
    - If a recurrent transfer between the same `from` and `to` accounts already exists:
        - If the `recurrence` value is unchanged, the next execution will follow the original schedule.
        - If the `recurrence` value is changed, the next execution will be scheduled for: `update date + recurrence`.
          In this case, **no** transfer will be executed on the update date itself.
    - Since HF28, users may define multiple recurrent transfers between the same accounts by using `pair_id`
      in the extensions.
    - A single account can define up to **255** recurrent transfers to other accounts.
    - The final execution date of the recurrent transfer must be **no more than 730 days** in the future.

    Raises:
        ValueError: If the transfer amount is None or less than or equal to 0.
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

    - If multiple recurrent transfers exist between the same `from` and `to` accounts,
      a `pair_id` must be specified in the extensions to identify the exact one to be removed.
    - When this operation is executed, it **does not** generate a `fill_recurrent_transfer_operation` virtual operation.
    """

    def __init__(self, from_account: AccountName, to_account: AccountName, pair_id: int | None = None) -> None:
        super().__init__(RecurrentTransferData(from_account, to_account, pair_id=pair_id))

    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        self.data.amount = api.hive.satoshis(0)

        self.recurrent_transfer = self.get_recurrent_transfer_proto_operation()
        return super().finalize(api)
