from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import TYPE_CHECKING, Any

from wax._private.converters.decimal_converter import DecimalConverter
from wax._private.converters.operation_converters.from_proto_to_cpp_string import from_proto_to_cpp_string
from wax._private.converters.operation_converters.from_protocol_to_cpp_string import from_protocol_to_cpp_string
from wax._private.converters.python_price_converter import convert_to_python_price
from wax._private.core.constants import (
    DEFAULT_TRANSACTION_EXPIRATION_TIME,
    HIVE_PERCENT_PRECISION_DOT_PLACES,
    PUBLIC_KEY_ADDRESS_PREFIX,
)
from wax._private.core.format_recognizers.operation import is_hive_protocol_format
from wax._private.models.asset import Asset
from wax._private.models.brain_key_data import BrainKeyData
from wax._private.models.manabar_data import ManabarData
from wax._private.models.private_key_data import PrivateKeyData
from wax._private.result_tools import (
    decode_impacted_account_names,
    expose_result_as_python_string,
    to_cpp_string,
    to_python_string,
    validate_wax_result,
)
from wax._private.transaction import Transaction
from wax.cpp_python_bridge import (  # type: ignore[attr-defined]
    calculate_account_hp,
    calculate_current_manabar_value,
    calculate_hbd_to_hive,
    calculate_hive_to_hbd,
    calculate_hp_apr,
    calculate_manabar_full_regeneration_time,
    calculate_vests_to_hp,
    calculate_witness_votes_hp,
    check_memo_for_private_keys,
    deserialize_witness_set_properties,
    estimate_hive_collateral,
    generate_password_based_private_key,
    get_hive_protocol_config,
    get_public_key_from_signature,
    is_valid_account_name,
    operation_get_impacted_accounts,
    proto_operation_get_impacted_accounts,
    python_witness_set_properties_data,
    serialize_witness_set_properties,
    suggest_brain_key,
    validate_operation,
    validate_proto_operation,
)
from wax.exceptions.chain_errors import PrivateKeyDetectedInMemoError
from wax.interfaces import ChainConfig, IWaxBaseInterface, TTimestamp
from wax.models.asset import (
    AssetFactory,
    AssetName,
    HbdNaiAssetConvertible,
    HiveNaiAssetConvertible,
    NaiAsset,
    VestsNaiAssetConvertible,
)

if TYPE_CHECKING:
    from decimal import Decimal

    from wax import python_authorities
    from wax.interfaces import ITransaction
    from wax.models.basic import AccountName, ChainId, PublicKey, SigDigest, Signature
    from wax.models.operations import Operation
    from wax.transaction_type_aliases import JsonTransaction, ProtoTransaction


class WaxBaseApi(IWaxBaseInterface):
    def __init__(self, chain_id: ChainId, *, _private: bool = False) -> None:
        assert _private, "WaxBaseApi should not be instantiated directly. Use create_wax_foundation() instead."
        self._chain_id = chain_id
        self._asset_handler = Asset()
        self._cached_config: ChainConfig | None = None

    @property
    def chain_id(self) -> ChainId:
        return self._chain_id

    @property
    def config(self) -> ChainConfig:
        if self._cached_config is None:
            self._cached_config = {
                to_python_string(key): to_python_string(value)
                for key, value in get_hive_protocol_config(to_cpp_string(self.chain_id)).items()
            }
        return self._cached_config

    @property
    def address_prefix(self) -> str:
        return self.config.get("HIVE_ADDRESS_PREFIX", PUBLIC_KEY_ADDRESS_PREFIX)

    @staticmethod
    def is_valid_account_name(account_name: AccountName) -> bool:
        return is_valid_account_name(to_cpp_string(account_name))

    @staticmethod
    def get_operation_impacted_accounts(operation: Operation) -> list[AccountName]:
        if is_hive_protocol_format(operation):
            converted = from_protocol_to_cpp_string(operation)
            validate_wax_result(validate_operation(converted))
            impacted_accounts = operation_get_impacted_accounts(converted)
        else:
            converted = from_proto_to_cpp_string(operation)
            validate_wax_result(validate_proto_operation(converted))
            impacted_accounts = proto_operation_get_impacted_accounts(converted)

        return decode_impacted_account_names(impacted_accounts)

    def estimate_hive_collateral(
        self,
        current_median_history_base: HbdNaiAssetConvertible,
        current_median_history_quote: HiveNaiAssetConvertible,
        current_min_history_base: HbdNaiAssetConvertible,
        current_min_history_quote: HiveNaiAssetConvertible,
        hbd_amount_to_get: HbdNaiAssetConvertible,
    ) -> NaiAsset:
        hbd_amount_to_get = self._asset_handler.resolve_from_convertible_type(AssetName.Hbd, hbd_amount_to_get)

        result = estimate_hive_collateral(
            current_median_history=convert_to_python_price(current_median_history_base, current_median_history_quote),
            current_min_history=convert_to_python_price(current_min_history_base, current_min_history_quote),
            hbd_amount_to_get=self._asset_handler.to_python_json_asset(hbd_amount_to_get),
        )

        return self._asset_handler.from_python_json_asset(result)

    @property
    def hive(self) -> AssetFactory:
        return self._asset_handler.create_asset_factory(AssetName.Hive)

    @property
    def hbd(self) -> AssetFactory:
        return self._asset_handler.create_asset_factory(AssetName.Hbd)

    @property
    def vests(self) -> AssetFactory:
        return self._asset_handler.create_asset_factory(AssetName.Vests)

    def vests_to_hp(
        self,
        vests: VestsNaiAssetConvertible,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
        total_vesting_shares: VestsNaiAssetConvertible,
    ) -> NaiAsset:
        vests = self._asset_handler.resolve_from_convertible_type(AssetName.Vests, vests)
        total_vesting_fund_hive = self._asset_handler.resolve_from_convertible_type(
            AssetName.Hive, total_vesting_fund_hive
        )
        total_vesting_shares = self._asset_handler.resolve_from_convertible_type(AssetName.Vests, total_vesting_shares)

        result = calculate_vests_to_hp(
            self._asset_handler.to_python_json_asset(vests),
            self._asset_handler.to_python_json_asset(total_vesting_fund_hive),
            self._asset_handler.to_python_json_asset(total_vesting_shares),
        )

        return self._asset_handler.from_python_json_asset(result)

    def hbd_to_hive(
        self, hbd: HbdNaiAssetConvertible, base: HbdNaiAssetConvertible, quote: HiveNaiAssetConvertible
    ) -> NaiAsset:
        hbd = self._asset_handler.resolve_from_convertible_type(AssetName.Hbd, hbd)
        converted_price_feed = convert_to_python_price(base, quote)

        result = calculate_hbd_to_hive(
            self._asset_handler.to_python_json_asset(hbd),
            converted_price_feed.base,
            converted_price_feed.quote,
        )

        return self._asset_handler.from_python_json_asset(result)

    def hive_to_hbd(
        self, hive: HiveNaiAssetConvertible, base: HbdNaiAssetConvertible, quote: HiveNaiAssetConvertible
    ) -> NaiAsset:
        hive = self._asset_handler.resolve_from_convertible_type(AssetName.Hive, hive)
        converted_price_feed = convert_to_python_price(base, quote)

        result = calculate_hive_to_hbd(
            self._asset_handler.to_python_json_asset(hive),
            converted_price_feed.base,
            converted_price_feed.quote,
        )

        return self._asset_handler.from_python_json_asset(result)

    @staticmethod
    def get_public_key_from_signature(sig_digest: SigDigest, signature: Signature) -> PublicKey:
        public_key = get_public_key_from_signature(to_cpp_string(sig_digest), to_cpp_string(signature))
        validate_wax_result(public_key)

        return expose_result_as_python_string(public_key)

    @staticmethod
    def suggest_brain_key() -> BrainKeyData:
        result = suggest_brain_key()
        return BrainKeyData(result)

    @staticmethod
    def get_private_key_from_password(account: AccountName, role: str, password: str) -> PrivateKeyData:
        data = generate_password_based_private_key(account, role, password)
        return PrivateKeyData(data)

    @staticmethod
    def calculate_current_manabar_value(
        head_block_time: datetime, max_mana: int, current_mana: int, last_update_time: int
    ) -> ManabarData:
        manabar_value = calculate_current_manabar_value(
            int(head_block_time.timestamp()), max_mana, current_mana, last_update_time
        )
        validate_wax_result(manabar_value)

        return ManabarData(max_mana, int(expose_result_as_python_string(manabar_value)))

    @staticmethod
    def calculate_manabar_full_regeneration_time(
        head_block_time: datetime, max_mana: int, current_mana: int, last_update_time: int
    ) -> datetime:
        result = calculate_manabar_full_regeneration_time(
            int(head_block_time.timestamp()), max_mana, current_mana, last_update_time
        )
        validate_wax_result(result)

        return datetime.fromtimestamp(int(expose_result_as_python_string(result)), tz=timezone.utc)

    def calculate_account_hp(
        self,
        vests: VestsNaiAssetConvertible,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
        total_vesting_shares: VestsNaiAssetConvertible,
    ) -> NaiAsset:
        vests = self._asset_handler.resolve_from_convertible_type(AssetName.Vests, vests)
        total_vesting_fund_hive = self._asset_handler.resolve_from_convertible_type(
            AssetName.Hive, total_vesting_fund_hive
        )
        total_vesting_shares = self._asset_handler.resolve_from_convertible_type(AssetName.Vests, total_vesting_shares)

        result = calculate_account_hp(
            self._asset_handler.to_python_json_asset(vests),
            self._asset_handler.to_python_json_asset(total_vesting_fund_hive),
            self._asset_handler.to_python_json_asset(total_vesting_shares),
        )

        return self._asset_handler.from_python_json_asset(result)

    def calculate_witness_votes_hp(
        self,
        number: int,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
        total_vesting_shares: VestsNaiAssetConvertible,
    ) -> NaiAsset:
        total_vesting_fund_hive = self._asset_handler.resolve_from_convertible_type(
            AssetName.Hive, total_vesting_fund_hive
        )
        total_vesting_shares = self._asset_handler.resolve_from_convertible_type(AssetName.Vests, total_vesting_shares)

        result = calculate_witness_votes_hp(
            number,
            self._asset_handler.to_python_json_asset(total_vesting_fund_hive),
            self._asset_handler.to_python_json_asset(total_vesting_shares),
        )

        return self._asset_handler.from_python_json_asset(result)

    def calculate_hp_apr(
        self,
        head_block_num: int,
        vesting_reward_percent: int,
        virtual_supply: HiveNaiAssetConvertible,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
    ) -> Decimal:
        virtual_supply = self._asset_handler.resolve_from_convertible_type(AssetName.Hive, virtual_supply)
        total_vesting_fund_hive = self._asset_handler.resolve_from_convertible_type(
            AssetName.Hive, total_vesting_fund_hive
        )

        result = calculate_hp_apr(
            head_block_num,
            vesting_reward_percent,
            self._asset_handler.to_python_json_asset(virtual_supply),
            self._asset_handler.to_python_json_asset(total_vesting_fund_hive),
        )

        return DecimalConverter.convert(
            expose_result_as_python_string(result), precision=HIVE_PERCENT_PRECISION_DOT_PLACES
        )

    def create_transaction_with_tapos(self, tapos_block_id: str, expiration: TTimestamp | None = None) -> ITransaction:
        expiration = expiration or DEFAULT_TRANSACTION_EXPIRATION_TIME
        if isinstance(expiration, datetime):
            expiration = expiration.replace(microsecond=0) - datetime.now(timezone.utc).replace(microsecond=0)
        assert isinstance(expiration, timedelta), "Expiration has to be timedelta type"
        return Transaction(api=self, tapos_block_id=tapos_block_id, expiration_time=expiration)

    def create_transaction_from_proto(self, transaction: ProtoTransaction) -> ITransaction:
        return Transaction(api=self, tapos_block_id=transaction)

    def create_transaction_from_json(self, transaction: JsonTransaction | dict[str, Any]) -> ITransaction:
        return Transaction.from_api(api=self, transaction=transaction)

    def serialize_witness_props(self, witness_props: python_witness_set_properties_data) -> dict[str, str]:
        serialized_props = serialize_witness_set_properties(witness_props)
        return {to_python_string(k): to_python_string(v) for k, v in serialized_props.items()}

    def deserialize_witness_props(self, serialized_props: dict[str, str]) -> python_witness_set_properties_data:
        cpp_serialized_props = {to_cpp_string(k): to_cpp_string(v) for k, v in serialized_props.items()}
        return deserialize_witness_set_properties(cpp_serialized_props)

    def scan_text_for_matching_private_keys(
        self,
        content: str,
        account: AccountName,
        account_authorities: python_authorities,
        memo_key: PublicKey,
        other_keys: list[PublicKey] | None = None,
    ) -> None:
        if other_keys is None:
            other_keys = []
        try:
            check_memo_for_private_keys(
                to_cpp_string(content),
                to_cpp_string(account),
                account_authorities,
                to_cpp_string(memo_key),
                [to_cpp_string(key) for key in other_keys],
            )
        except Exception as error:
            raise PrivateKeyDetectedInMemoError from error

    def _resolve_expiration(self, expiration: datetime | timedelta | None) -> timedelta:
        expiration = expiration or DEFAULT_TRANSACTION_EXPIRATION_TIME
        if isinstance(expiration, datetime):
            expiration = expiration - datetime.now(timezone.utc)
        assert isinstance(expiration, timedelta), "Expiration has to be timedelta type"
        return expiration

    def check_is_proper_asset(self, asset_name: AssetName | list[AssetName], asset: NaiAsset) -> bool:
        def contains(expected: AssetName) -> bool:
            if isinstance(asset_name, list):
                return expected in asset_name
            return asset_name == expected

        return (
            asset.nai == self._asset_handler.get_asset_info(AssetName.Hive).nai
            and contains(AssetName.Hive)
            or asset.nai == self._asset_handler.get_asset_info(AssetName.Hbd).nai
            and contains(AssetName.Hbd)
            or asset.nai == self._asset_handler.get_asset_info(AssetName.Vests).nai
            and contains(AssetName.Vests)
        )
