from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING, Iterable, cast

from wax._private.base_api import WaxBaseApi
from wax._private.converters.python_price_converter import convert_to_python_price
from wax._private.models.asset import Asset
from wax._private.operation_base import ConvertedToProtoOperation, OperationBase
from wax._private.result_tools import to_cpp_string
from wax.models.asset import AssetName, HbdNaiAssetConvertible, HiveNaiAssetConvertible
from wax.proto.operations import witness_set_properties
from wax.wax_result import python_witness_set_properties_data

if TYPE_CHECKING:
    from wax import IWaxBaseInterface
    from wax.models.basic import AccountName, PublicKey


@dataclass
class WitnessSetPropertiesData:
    owner: AccountName
    witness_signing_key: PublicKey
    new_signing_key: PublicKey | None = None
    account_creation_fee: HiveNaiAssetConvertible | None = None
    url: str | None = None
    hbd_exchange_rate: HbdExchangeRate | None = None
    maximum_block_size: int | None = None
    hbd_interest_rate: int | None = None
    account_subsidy_budget: int | None = None
    account_subsidy_decay: int | None = None


@dataclass
class HbdExchangeRate:
    base: HbdNaiAssetConvertible
    quote: HiveNaiAssetConvertible


class WitnessSetProperties(OperationBase):
    """
    Operation to update the properties of a witness.

    Wrapper around the `witness_set_properties` operation to simplify its usage by properly serializing witness props.
    """

    def __init__(self, data: WitnessSetPropertiesData) -> None:
        super().__init__()
        self.owner = data.owner
        self.account_creation_fee = data.account_creation_fee
        self.hbd_exchange_rate = data.hbd_exchange_rate
        self.props = python_witness_set_properties_data(
            to_cpp_string(data.witness_signing_key),
            to_cpp_string(data.new_signing_key) if data.new_signing_key else None,
            None,  # account_creation_fee -> set in finalize
            to_cpp_string(data.url) if data.url else None,
            None,  # hbd_exchange_rate -> set in finalize
            data.maximum_block_size,
            data.hbd_interest_rate,
            data.account_subsidy_budget,
            data.account_subsidy_decay,
        )

    def finalize(self, api: IWaxBaseInterface) -> Iterable[ConvertedToProtoOperation]:
        if self.hbd_exchange_rate is not None:
            exchange_rate = convert_to_python_price(self.hbd_exchange_rate.base, self.hbd_exchange_rate.quote)
            self.props.hbd_exchange_rate = exchange_rate

        if self.account_creation_fee is not None:
            asset_handler = Asset()
            self.props.account_creation_fee = asset_handler.to_python_json_asset(
                asset_handler.resolve_from_convertible_type(AssetName.Hive, self.account_creation_fee)
            )

        return [
            witness_set_properties(
                owner=self.owner, props=cast(WaxBaseApi, api).serialize_witness_props(self.props), extensions=[]
            )
        ]
