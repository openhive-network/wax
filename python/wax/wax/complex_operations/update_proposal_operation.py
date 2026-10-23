from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Iterable, cast

from schemas.fields.hive_datetime import HiveDateTime

from wax._private.base_api import WaxBaseApi
from wax._private.models.asset import Asset
from wax._private.operation_base import ConvertedToProtoOperation, OperationBase
from wax._private.proto.update_proposal_pb2 import update_proposal_end_date, update_proposal_extension
from wax.exceptions.asset_errors import UnexpectedAssetTypeError
from wax.models.asset import AssetName
from wax.proto.operations import update_proposal

if TYPE_CHECKING:
    from datetime import datetime

    from wax import IWaxBaseInterface
    from wax.models.asset import HbdNaiAssetConvertible
    from wax.models.basic import AccountName


@dataclass
class UpdateProposalOperationData:
    """
    Data class used to store update proposal operation related data.

    Attributes:
        proposal_id: The ID of the proposal to be updated.
        creator: The account name of the proposal creator.
        daily_pay: The daily pay for the proposal (only HBD allowed), in any form of assets (e.g. `Asset` of models of
            hiveio_api).
        subject: The subject of the proposal.
        permlink: The permlink associated with the proposal.
        end_date: Optional end date for the proposal as a timestamp or datetime.
    """

    proposal_id: int | str
    creator: AccountName
    daily_pay: HbdNaiAssetConvertible
    subject: str
    permlink: str
    end_date: str | datetime | None = None


class UpdateProposalOperation(OperationBase):
    def __init__(self, data: UpdateProposalOperationData) -> None:
        super().__init__()
        self.data = data
        self._extensions: list[update_proposal_extension] = []
        self._add_end_date()

    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        """
        Finalize the update of the proposal - its daily pay is converted from any form of assets.

        Args:
            api: Wax api subclass instance.

        Returns:
            Iterable[ConvertedToProtoOperation]: The update_proposal operation.

        Raises:
            CannotCreateAssetError: If the daily pay is not an asset.
            UnexpectedAssetTypeError: If the daily pay is not an asset of HBD.
        """
        daily_pay = Asset.to_proto_asset(self.data.daily_pay)
        if cast(WaxBaseApi, api).check_is_proper_asset(AssetName.Hbd, daily_pay):
            return [
                update_proposal(
                    proposal_id=self.data.proposal_id,  # type: ignore[arg-type, unused-ignore]
                    creator=self.data.creator,
                    daily_pay=daily_pay,
                    subject=self.data.subject,
                    permlink=self.data.permlink,
                    extensions=self._extensions,
                )
            ]
        raise UnexpectedAssetTypeError(daily_pay, AssetName.Hbd)

    def _add_end_date(self) -> None:
        """Adds an end date to the proposal extensions, in the JSON form of Hive dates."""
        if self.data.end_date is None:
            return
        hive_dt = HiveDateTime(self.data.end_date)
        iso_without_ms = hive_dt.serialize()
        self.data.end_date = iso_without_ms
        self._add_end_date_extension()

    def _add_end_date_extension(self) -> None:
        self._extensions = [
            update_proposal_extension(
                update_proposal_end_date=update_proposal_end_date(end_date=str(self.data.end_date))
            )
        ]
