from __future__ import annotations

from datetime import datetime, timezone
from typing import TYPE_CHECKING, cast

from pydantic import ValidationError

from schemas.fields.basic import PublicKey
from wax._private.core.constants import PUBLIC_KEY_ADDRESS_PREFIX
from wax._private.core.python_price_converter import convert_to_python_price
from wax._private.exceptions import WaxValidationFailedError
from wax._private.models.asset import (
    Asset,
    AssetFactory,
    AssetHbdHF26Convertible,
    AssetHiveHF26Convertible,
    AssetVestsHF26Convertible,
)
from wax._private.models.basic import (
    AccountName,
    ChainId,
    HbdExchangeRate,
    HbdExchangeRateHF26,
    Price,
    PriceHF26,
)
from wax._private.models.brain_key_data import BrainKeyData
from wax._private.models.manabar_data import ManabarData
from wax._private.models.operations import (
    OperationHF26,
    prepare_operation_to_get_impacted_accounts,
    prepare_operation_to_validate,
)
from wax._private.result_tools import decode_impacted_account_names, expose_result, validate_wax_result
from wax.cpp_python_bridge import (  # type: ignore[attr-defined]
    calculate_account_hp,
    calculate_current_manabar_value,
    calculate_hbd_to_hive,
    calculate_hive_to_hbd,
    calculate_manabar_full_regeneration_time,
    calculate_vests_to_hp,
    calculate_witness_votes_hp,
    estimate_hive_collateral,
    get_public_key_from_signature,
    operation_get_impacted_accounts,
    suggest_brain_key,
    validate_operation,
)
from wax.interfaces import IWaxBaseInterface

if TYPE_CHECKING:
    from schemas.fields.hex import Hex, Signature


class WaxBaseApi(IWaxBaseInterface):
    def __init__(self, chain_id: ChainId, *, _private: bool = False) -> None:
        assert _private, "WaxBaseApi should not be instantiated directly. Use create_wax_foundation() instead."
        self._chain_id = chain_id

    @property
    def chain_id(self) -> ChainId:
        return self._chain_id

    @staticmethod
    def get_address_prefix() -> str:
        return PUBLIC_KEY_ADDRESS_PREFIX

    @staticmethod
    def get_operation_impacted_accounts(operation: OperationHF26) -> list[AccountName]:
        validation_result = validate_operation(prepare_operation_to_validate(operation))
        validate_wax_result(validation_result)

        prepared_operation = prepare_operation_to_get_impacted_accounts(operation)

        impacted_accounts = operation_get_impacted_accounts(prepared_operation)

        return decode_impacted_account_names(impacted_accounts)

    @staticmethod
    def estimate_hive_collateral(
        current_median_history: HbdExchangeRate,
        current_min_history: HbdExchangeRate,
        hbd_amount_to_get: AssetHbdHF26Convertible,
    ) -> Asset.HiveHF26:
        try:
            current_median_history = HbdExchangeRateHF26.create(current_median_history)
            current_min_history = HbdExchangeRateHF26.create(current_min_history)
            hbd_amount_to_get = Asset.resolve_from_convertible_type(Asset.HbdHF26, hbd_amount_to_get)
        except ValidationError as error:
            raise WaxValidationFailedError(f"Error while parsing object: {error.model}.") from error

        result = estimate_hive_collateral(
            current_median_history=convert_to_python_price(current_median_history),
            current_min_history=convert_to_python_price(current_min_history),
            hbd_amount_to_get=Asset.to_python_json_asset(hbd_amount_to_get),
        )

        return cast(Asset.HiveHF26, Asset.from_python_json_asset(result))

    @property
    def hive(self) -> AssetFactory[Asset.HiveHF26]:
        return Asset.create_asset_factory(Asset.HiveHF26)

    @property
    def hbd(self) -> AssetFactory[Asset.HbdHF26]:
        return Asset.create_asset_factory(Asset.HbdHF26)

    @property
    def vests(self) -> AssetFactory[Asset.VestsHF26]:
        return Asset.create_asset_factory(Asset.VestsHF26)

    @classmethod
    def vests_to_hp(
        cls,
        vests: AssetVestsHF26Convertible,
        total_vesting_fund_hive: AssetHiveHF26Convertible,
        total_vesting_shares: AssetVestsHF26Convertible,
    ) -> Asset.HiveHF26:
        vests = Asset.resolve_from_convertible_type(Asset.VestsHF26, vests)
        total_vesting_fund_hive = Asset.resolve_from_convertible_type(Asset.HiveHF26, total_vesting_fund_hive)
        total_vesting_shares = Asset.resolve_from_convertible_type(Asset.VestsHF26, total_vesting_shares)

        result = calculate_vests_to_hp(
            Asset.to_python_json_asset(vests),
            Asset.to_python_json_asset(total_vesting_fund_hive),
            Asset.to_python_json_asset(total_vesting_shares),
        )

        return cast(Asset.HiveHF26, Asset.from_python_json_asset(result))

    @staticmethod
    def hbd_to_hive(hbd: AssetHbdHF26Convertible, price_feed: Price) -> Asset.HiveHF26:
        price_feed = PriceHF26.create(price_feed)
        hbd = Asset.resolve_from_convertible_type(Asset.HbdHF26, hbd)
        converted_price_feed = convert_to_python_price(price_feed)

        result = calculate_hbd_to_hive(
            Asset.to_python_json_asset(hbd),
            converted_price_feed.base,
            converted_price_feed.quote,
        )

        return cast(Asset.HiveHF26, Asset.from_python_json_asset(result))

    @staticmethod
    def hive_to_hbd(hive: AssetHiveHF26Convertible, price_feed: Price) -> Asset.HbdHF26:
        price_feed = PriceHF26.create(price_feed)
        hive = Asset.resolve_from_convertible_type(Asset.HiveHF26, hive)
        converted_price_feed = convert_to_python_price(price_feed)

        result = calculate_hive_to_hbd(
            Asset.to_python_json_asset(hive),
            converted_price_feed.base,
            converted_price_feed.quote,
        )

        return cast(Asset.HbdHF26, Asset.from_python_json_asset(result))

    @staticmethod
    def get_public_key_from_signature(sig_digest: Hex, signature: Signature) -> PublicKey:
        public_key = get_public_key_from_signature(sig_digest.encode(), signature.encode())
        validate_wax_result(public_key)

        return PublicKey(expose_result(public_key))

    @staticmethod
    def suggest_brain_key() -> BrainKeyData:
        result = suggest_brain_key()
        return BrainKeyData(result)

    @staticmethod
    def calculate_current_manabar_value(
        head_block_time: datetime, max_mana: int, current_mana: int, last_update_time: int
    ) -> ManabarData:
        manabar_value = calculate_current_manabar_value(
            int(head_block_time.timestamp()), max_mana, current_mana, last_update_time
        )
        validate_wax_result(manabar_value)

        return ManabarData(max_mana, int(expose_result(manabar_value)))

    @staticmethod
    def calculate_manabar_full_regeneration_time(
        head_block_time: datetime, max_mana: int, current_mana: int, last_update_time: int
    ) -> datetime:
        result = calculate_manabar_full_regeneration_time(
            int(head_block_time.timestamp()), max_mana, current_mana, last_update_time
        )
        validate_wax_result(result)

        return datetime.fromtimestamp(int(expose_result(result)), tz=timezone.utc)

    @staticmethod
    def calculate_account_hp(
        vests: AssetVestsHF26Convertible,
        total_vesting_fund_hive: AssetHiveHF26Convertible,
        total_vesting_shares: AssetVestsHF26Convertible,
    ) -> Asset.HiveHF26:
        vests = Asset.resolve_from_convertible_type(Asset.VestsHF26, vests)
        total_vesting_fund_hive = Asset.resolve_from_convertible_type(Asset.HiveHF26, total_vesting_fund_hive)
        total_vesting_shares = Asset.resolve_from_convertible_type(Asset.VestsHF26, total_vesting_shares)

        result = calculate_account_hp(
            Asset.to_python_json_asset(vests),
            Asset.to_python_json_asset(total_vesting_fund_hive),
            Asset.to_python_json_asset(total_vesting_shares),
        )

        return cast(Asset.HiveHF26, Asset.from_python_json_asset(result))

    @staticmethod
    def calculate_witness_votes_hp(
        number: int,
        total_vesting_fund_hive: AssetHiveHF26Convertible,
        total_vesting_shares: AssetVestsHF26Convertible,
    ) -> Asset.HiveHF26:
        total_vesting_fund_hive = Asset.resolve_from_convertible_type(Asset.HiveHF26, total_vesting_fund_hive)
        total_vesting_shares = Asset.resolve_from_convertible_type(Asset.VestsHF26, total_vesting_shares)

        result = calculate_witness_votes_hp(
            number,
            Asset.to_python_json_asset(total_vesting_fund_hive),
            Asset.to_python_json_asset(total_vesting_shares),
        )

        return cast(Asset.HiveHF26, Asset.from_python_json_asset(result))
