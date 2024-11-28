from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime

    from schemas.fields.basic import PublicKey
    from schemas.fields.hex import Hex, Signature
    from wax._private.models.asset import (
        Asset,
        AssetFactory,
        AssetHbdHF26Convertible,
        AssetHiveHF26Convertible,
        AssetVestsHF26Convertible,
    )
    from wax._private.models.basic import AccountName, HbdExchangeRate, Price
    from wax._private.models.brain_key_data import BrainKeyData
    from wax._private.models.operations import OperationHF26


class WaxBaseInterface(ABC):
    @staticmethod
    @abstractmethod
    def get_address_prefix() -> str:
        """Returns the public key address prefix."""

    @staticmethod
    @abstractmethod
    def get_operation_impacted_accounts(operation: OperationHF26) -> list[AccountName]:
        """
        Retrieves the list of account names (not authorities!) that are impacted by a given operation.

        Args:
            operation: Operation in HF26 format or proto operation.

        Returns:
            list[AccountName]: list of account names impacted in operation.

        Raises:
            WaxValidationFailedError: When operation is incorrect.
        """

    @staticmethod
    @abstractmethod
    def estimate_hive_collateral(
        current_median_history: HbdExchangeRate,
        current_min_history: HbdExchangeRate,
        hbd_amount_to_get: AssetHbdHF26Convertible,
    ) -> Asset.HiveHF26:
        """
        Estimate hive collateral.

        Args:
            current_median_history: Current median price retrieved by `get_feed_history`.
            current_min_history: Current minimal price retrieved by `get_feed_history`.
            hbd_amount_to_get: HBD asset used to get HIVE asset.

        Returns:
            Asset.HiveHF26: Estimated HIVE collateral.

        Raises:
            WaxValidationFailedError: When passed parameters are wrong.
            CannotCreateAssetError/UnknownAssetTypeError: When passed asset is incorrect.
        """

    @property
    @abstractmethod
    def hive(self) -> AssetFactory[Asset.HiveHF26]:
        """Returns set of methods to create HIVE asset."""

    @property
    @abstractmethod
    def hbd(self) -> AssetFactory[Asset.HbdHF26]:
        """Returns set of methods to create HBD asset."""

    @property
    @abstractmethod
    def vests(self) -> AssetFactory[Asset.VestsHF26]:
        """Returns set of methods to create VESTS asset."""

    @classmethod
    @abstractmethod
    def vests_to_hp(
        cls,
        vests: AssetVestsHF26Convertible,
        total_vesting_fund_hive: AssetHiveHF26Convertible,
        total_vesting_shares: AssetVestsHF26Convertible,
    ) -> Asset.HiveHF26:
        """
        Converts given VESTS into HP, both in nai form.

        Args:
            vests: VESTS asset.
            total_vesting_fund_hive: HIVE asset total vesting fund.
            total_vesting_shares: VESTS asset total vesting shares.

        Returns:
            Asset.HiveHF26: converted asset into HP (HIVE).

        Raises:
            CannotCreateAssetError: When passed asset is incorrect.
        """

    @staticmethod
    @abstractmethod
    def hbd_to_hive(hbd: AssetHbdHF26Convertible, price_feed: Price) -> Asset.HiveHF26:
        """
        Converts given HBD into HIVE, both in nai form.

        Args:
            hbd: HIVE asset to be converted.
            price_feed: Price feed (base and quote) with HBD as base and HIVE as quote.

        Returns:
            Asset.HiveHF26: asset converted asset into HIVE.

        Raises:
            UnknownAssetTypeError: if passed unknown type of asset.
            CannotCreateAssetError: When passed asset it is incorrect.
        """

    @staticmethod
    @abstractmethod
    def hive_to_hbd(hive: AssetHiveHF26Convertible, price_feed: Price) -> Asset.HbdHF26:
        """
        Converts given HIVE into HBD, both in nai form.

        Args:
            hive: HIVE asset to be converted.
            price_feed: Price feed (base and quote) with HIVE as base and HBD as quote.

        Returns:
            Asset.HbdHF26: converted asset into HBD.

        Raises:
            UnknownAssetTypeError: if passed unknown type of asset.
            CannotCreateAssetError: When passed asset is incorrect.
        """

    @staticmethod
    @abstractmethod
    def get_public_key_from_signature(sig_digest: Hex, signature: Signature) -> PublicKey:
        """
        Retrieves the public key in wif format from the given sig digest and signature in hexadecimal format.

        Args:
            sig_digest: Digest data in hexadecimal format.
            signature: Signature in hexadecimal format.

        Returns:
            PublicKey: Public key used in the signature

        Raises:
            WaxValidationFailedError: When passed parameters are wrong.
        """

    @staticmethod
    @abstractmethod
    def suggest_brain_key() -> BrainKeyData:
        """
        Returns brain key data.

        Returns:
            BrainKeyData:
                * brain key: a string containing space separated list of N words generated as a brain key (atm 16)
                * wif private key: first private key derived from above specified brain key
                * associated public key: base58 string pointing the public key associated to the private key
        """

    @staticmethod
    @abstractmethod
    def calculate_current_manabar_value(
        head_block_time: datetime, max_mana: int, current_mana: int, last_update_time: int
    ) -> int:
        """
        Calculates just VALUE of the current manabar.

        Args:
            head_block_time:
                Head block time. Can be obtained using time property from dgpo (dynamic global properties)
            max_mana:
                Maximum account mana.
                * For upvotes should equal post_voting_power.amount from the find_account.
                * For downvotes remember to multiply this value by downvote_pool_percent from the dgpo.
                * For rc manabar calculations use max_rc value from the rc_accounts API call.
            current_mana:
                Current account mana.
                * For upvotes should equal voting_manabar.current_mana from the find_account API call.
                * For downvotes: downvote_manabar.current_mana.
                * For rc manabar calculations use rc_manabar value from the rc_accounts API call
            last_update_time:
                Last update of the current account mana.
                * For upvotes should equal voting_manabar.last_update_time from the find_account API call.
                * For downvotes should equal downvote_manabar.current_mana.
                * For rc manabar calculations use rc_manabar value from the rc_accounts API call.

        Returns:
            int: Calculated manabar value.

        Raises:
            WaxValidationFailedError: When passed parameters are wrong.
        """

    @staticmethod
    @abstractmethod
    def calculate_manabar_full_regeneration_time(
        head_block_time: datetime, max_mana: int, current_mana: int, last_update_time: int
    ) -> datetime:
        """
        Calculates manabar full regeneration time.

        Args:
            head_block_time:
                Head block time. Can be obtained using time property from dgpo (dynamic global properties)
            max_mana:
                Maximum account mana.
                * For upvotes should equal post_voting_power.amount from the find_account.
                * For downvotes remember to multiply this value by downvote_pool_percent from the dgpo.
                * For rc manabar calculations use max_rc value from the rc_accounts API call.
            current_mana:
                Current account mana.
                * For upvotes should equal voting_manabar.current_mana from the find_account API call.
                * For downvotes: downvote_manabar.current_mana.
                * For rc manabar calculations use rc_manabar value from the rc_accounts API call
            last_update_time:
                Last update of the current account mana.
                * For upvotes should equal voting_manabar.last_update_time from the find_account API call.
                * For downvotes should equal downvote_manabar.current_mana.
                * For rc manabar calculations use rc_manabar value from the rc_accounts API call.

        Returns:
            datetime: Calculated manabar full regeneration time.

        Raises:
            WaxValidationFailedError: when passed parameters are wrong.
        """

    @staticmethod
    @abstractmethod
    def calculate_account_hp(
        vests: AssetVestsHF26Convertible,
        total_vesting_fund_hive: AssetHiveHF26Convertible,
        total_vesting_shares: AssetVestsHF26Convertible,
    ) -> Asset.HiveHF26:
        """
        Calculates account HP based on given vests, total vesting fund HIVE and total vesting shares.

        Args:
            vests: VESTS asset.
            total_vesting_fund_hive: HIVE asset total vesting fund.
            total_vesting_shares: VESTS asset total vesting shares.

        Returns:
            Asset.HiveHF26: calculated HP for the given vests, total vesting fund HIVE and total vesting shares.

        Raises:
            CannotCreateAssetError: When passed asset is incorrect.
        """

    @staticmethod
    @abstractmethod
    def calculate_witness_votes_hp(
        number: int,
        total_vesting_fund_hive: AssetHiveHF26Convertible,
        total_vesting_shares: AssetVestsHF26Convertible,
    ) -> Asset.HiveHF26:
        """
        Calculates witness votes HP based on given votes, total vesting fund HIVE and total vesting shares.

        Args:
            number: witness votes.
            total_vesting_fund_hive: HIVE asset total vesting fund.
            total_vesting_shares: VESTS asset total vesting shares.

        Returns:
            Asset.HiveHF26: Calculated votes in nai asset form.

        Raises:
            CannotCreateAssetError: When passed asset is incorrect.
        """
