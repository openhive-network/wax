from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING, TypeAlias

if TYPE_CHECKING:
    from datetime import datetime
    from decimal import Decimal

    from wax._private.models.asset import (
        AssetFactory,
        HbdNaiAssetConvertible,
        HiveNaiAssetConvertible,
        NaiAsset,
        VestsNaiAssetConvertible,
    )
    from wax._private.models.basic import AccountName, ChainId, Hex, PublicKey, Signature
    from wax._private.models.brain_key_data import BrainKeyData
    from wax._private.models.operations import Operation
    from wax._private.models.private_key_data import PrivateKeyData


ChainConfig: TypeAlias = dict[str, str]


@dataclass
class IManabarData(ABC):
    """Manabar data contains: max mana, current mana and percent."""

    max_mana: int
    current_mana: int

    @property
    @abstractmethod
    def percent(self) -> Decimal: ...


class IWaxBaseInterface(ABC):
    @property
    @abstractmethod
    def chain_id(self) -> ChainId:
        """Returns the chain id."""

    @property
    @abstractmethod
    def config(self) -> ChainConfig:
        """Returns protocol configuration for the current chain."""

    @property
    @abstractmethod
    def address_prefix(self) -> str:
        """Returns the public key address prefix."""

    @staticmethod
    @abstractmethod
    def get_operation_impacted_accounts(operation: Operation) -> list[AccountName]:
        """
        Retrieves the list of account names (not authorities!) that are impacted by a given operation.

        Args:
            operation: Operation in HF26 format or proto operation.

        Returns:
            list[AccountName]: list of account names impacted in operation.

        Raises:
            InvalidOperationFormatError, WaxValidationFailedError: When operation is incorrect.
        """

    @abstractmethod
    def estimate_hive_collateral(
        self,
        current_median_history_base: HbdNaiAssetConvertible,
        current_median_history_quote: HiveNaiAssetConvertible,
        current_min_history_base: HbdNaiAssetConvertible,
        current_min_history_quote: HiveNaiAssetConvertible,
        hbd_amount_to_get: HbdNaiAssetConvertible,
    ) -> NaiAsset:
        """
        Estimate hive collateral.

        Args:
            current_median_history_base: Base for Current median price retrieved by `get_feed_history`
            current_median_history_quote: Quote for Current median price retrieved by `get_feed_history`
            current_min_history_base: Base for Current minimal price retrieved by `get_feed_history`
            current_min_history_quote:  Quote for Current minimal price retrieved by `get_feed_history`
            hbd_amount_to_get: HBD amount to get.

        Returns:
            NaiAsset: Estimated HIVE collateral.

        Raises:
            CannotCreateAssetError/UnknownAssetTypeError/AssertionError: When passed asset is incorrect.
        """

    @property
    @abstractmethod
    def hive(self) -> AssetFactory:
        """Returns set of methods to create HIVE asset."""

    @property
    @abstractmethod
    def hbd(self) -> AssetFactory:
        """Returns set of methods to create HBD asset."""

    @property
    @abstractmethod
    def vests(self) -> AssetFactory:
        """Returns set of methods to create VESTS asset."""

    @abstractmethod
    def vests_to_hp(
        self,
        vests: VestsNaiAssetConvertible,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
        total_vesting_shares: VestsNaiAssetConvertible,
    ) -> NaiAsset:
        """
        Converts given VESTS into HP, both in nai form.

        Args:
            vests: VESTS asset.
            total_vesting_fund_hive: HIVE asset total vesting fund.
            total_vesting_shares: VESTS asset total vesting shares.

        Returns:
            NaiAsset: converted asset into HP (HIVE).

        Raises:
            CannotCreateAssetError/UnknownAssetTypeError/AssertionError: When passed asset is incorrect.
        """

    @abstractmethod
    def hbd_to_hive(
        self, hbd: HbdNaiAssetConvertible, base: HbdNaiAssetConvertible, quote: HiveNaiAssetConvertible
    ) -> NaiAsset:
        """
        Converts given HBD into HIVE, both in nai form.

        Args:
            hbd: HBD asset to be converted.
            base: HBD asset price base.
            quote: HIVE asset price quote.

        Returns:
            NaiAsset: asset converted asset into HIVE.

        Raises:
            UnknownAssetTypeError/CannotCreateAssetError/AssertionError: When passed asset it is incorrect.
        """

    @abstractmethod
    def hive_to_hbd(
        self, hive: HiveNaiAssetConvertible, base: HbdNaiAssetConvertible, quote: HiveNaiAssetConvertible
    ) -> NaiAsset:
        """
        Converts given HIVE into HBD, both in nai form.

        Args:
            hive: HIVE asset to be converted.
            base: HBD asset price base.
            quote: HIVE asset price quote.

        Returns:
            NaiAsset: converted asset into HBD.

        Raises:
            UnknownAssetTypeError/CannotCreateAssetError/AssertionError: When passed asset is incorrect.
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
    def get_private_key_from_password(account: AccountName, role: str, password: str) -> PrivateKeyData:
        """
        Returns private key data.

        Args:
            account: Account name.
            role: active | owner | posting | memo.
            password: the Master Password to derive key from.

        Returns:
            PrivateKeyData: generated private key along with the associated public key in WIF format.
        """

    @staticmethod
    @abstractmethod
    def calculate_current_manabar_value(
        head_block_time: datetime, max_mana: int, current_mana: int, last_update_time: int
    ) -> IManabarData:
        """
        Calculates of the current manabar.

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
            IManabarData: Calculated manabar value.

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

    @abstractmethod
    def calculate_account_hp(
        self,
        vests: VestsNaiAssetConvertible,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
        total_vesting_shares: VestsNaiAssetConvertible,
    ) -> NaiAsset:
        """
        Calculates account HP based on given vests, total vesting fund HIVE and total vesting shares.

        Args:
            vests: VESTS asset.
            total_vesting_fund_hive: HIVE asset total vesting fund.
            total_vesting_shares: VESTS asset total vesting shares.

        Returns:
            NaiAsset: calculated HP for the given vests, total vesting fund HIVE and total vesting shares.

        Raises:
            UnknownAssetTypeError/CannotCreateAssetError/AssertionError: When passed asset is incorrect.
        """

    @abstractmethod
    def calculate_witness_votes_hp(
        self,
        number: int,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
        total_vesting_shares: VestsNaiAssetConvertible,
    ) -> NaiAsset:
        """
        Calculates witness votes HP based on given votes, total vesting fund HIVE and total vesting shares.

        Args:
            number: witness votes.
            total_vesting_fund_hive: HIVE asset total vesting fund.
            total_vesting_shares: VESTS asset total vesting shares.

        Returns:
            NaiAsset: Calculated votes in nai asset form.

        Raises:
             UnknownAssetTypeError/CannotCreateAssetError/AssertionError: When passed asset is incorrect.
        """

    @abstractmethod
    def calculate_hp_apr(
        self,
        head_block_num: int,
        vesting_reward_percent: int,
        virtual_supply: HiveNaiAssetConvertible,
        total_vesting_fund_hive: HiveNaiAssetConvertible,
    ) -> Decimal:
        """
        Calculates HP APR.

        Args:
            head_block_num: Head block number.
            vesting_reward_percent: Vesting reward percent.
            virtual_supply: Virtual supply.
            total_vesting_fund_hive: Total vesting fund HIVE.

        Returns:
            Decimal: HP APR percent with 2 decimals

        Raises:
            WaxValidationFailedError: When passed parameters are wrong.
        """
