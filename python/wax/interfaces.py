from __future__ import annotations

from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, TypeAlias

from typing_extensions import Self

from wax.proto.transaction_pb2 import transaction as proto_transaction

if TYPE_CHECKING:
    from datetime import datetime, timedelta

    from beekeepy._interface.abc.asynchronous.wallet import UnlockedWallet as AsyncUnlockedWallet
    from beekeepy._interface.abc.synchronous.wallet import UnlockedWallet
    from schemas.fields.basic import PublicKey
    from schemas.fields.hex import Hex, Signature, TransactionId
    from wax._private.models.asset import (
        Asset,
        AssetFactory,
        AssetHbdHF26Convertible,
        AssetHiveHF26Convertible,
        AssetVestsHF26Convertible,
    )
    from wax._private.models.basic import AccountName, ChainId, HbdExchangeRate, Price
    from wax._private.models.brain_key_data import BrainKeyData
    from wax._private.models.operations import OperationCreatable, OperationHF26
    from wax._private.models.required_authorities import TransactionRequiredAuthorities


ProtoTransaction: TypeAlias = proto_transaction
JsonTransaction: TypeAlias = str


class ITransactionBase(ABC):
    @property
    @abstractmethod
    def transaction(self) -> ProtoTransaction:
        """
        Fills up constructed transaction basing on preconfigured TAPOS. Also applies the transaction expiration time.

        Returns:
            ProtoTransaction: Proto transaction object.
        """

    @property
    @abstractmethod
    def is_signed(self) -> bool:
        """
        Checks if underlying transaction has been already signed at least one time.

        Returns:
            bool: Either true or false based on the signatures amount.
        """

    @property
    @abstractmethod
    def sig_digest(self) -> Signature:
        """
        Returns digest of the transaction for signing (HF26 serialization used).

        Returns:
            Signature: Digest of the transaction in hex form.

        Raises:
            WaxValidationFailedError: When the transaction or chain id is incorrect.
        """

    @property
    @abstractmethod
    def impacted_accounts(self) -> list[AccountName]:
        """
        Returns list of account names (not authorities!) impacted by a whole transaction.

        Returns:
            list[AccountName]: List of account names impacted by the transaction.

        Raises:
            WaxValidationFailedError: When any of the accounts is incorrect.
        """

    @property
    @abstractmethod
    def id(self) -> TransactionId:
        """
        Returns id of the transaction (HF26 serialization used).

        Returns:
            TransactionId: Transaction id in hex form.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @property
    @abstractmethod
    def signature_keys(self) -> list[PublicKey]:
        """
        Returns signature keys from the transaction signatures (HF26 serialization used).

        Returns:
            list[PublicKey]: List of public keys used to sign the transaction.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @property
    @abstractmethod
    def required_authorities(self) -> TransactionRequiredAuthorities:
        """
        Returns required authority accounts from the transaction.

        Returns:
            TransactionRequiredAuthorities: All possible authority types.
        """

    @abstractmethod
    def validate(self) -> None:
        """
        Validates current transaction.

        Returns:
            None

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @abstractmethod
    def sign(self, wallet: UnlockedWallet, public_key: PublicKey | str) -> Signature:
        """
        Signs the transaction using given public key. Applies the transaction expiration time.

        Args:
            wallet: Unlocked wallet to be used for signing.
            public_key: Public key for signing (remember that should be available in the wallet!)

        Returns:
            Signature: Transaction signature signed using given key.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @abstractmethod
    async def async_sign(self, wallet: AsyncUnlockedWallet, public_key: PublicKey | str) -> Signature:
        """
        Signs asynchronously the transaction using given public key. Applies the transaction expiration time.

        Args:
            wallet: Unlocked wallet to be used for signing.
            public_key: Public key for signing (remember that should be available in the wallet!)

        Returns:
            Signature: Transaction signature signed using given key.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @abstractmethod
    def add_signature(self, signature: Signature) -> Signature:
        """
        Adds your signature to the internal signatures list inside underlying transaction.

        Args:
            signature: Signature to be added.

        Returns:
            Signature: Added transaction signature.
        """

    @abstractmethod
    def to_api_json(self) -> JsonTransaction:
        """
        Converts the created transaction into the Hive API-form JSON.

        Returns:
            JsonTransaction: Transaction in Hive API-form.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @abstractmethod
    def to_bytes(self) -> bytes:
        """
        Converts the created transaction into the chain binary form.

        Returns:
            bytes: Serialized transaction in chain form.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """


class ITransaction(ITransactionBase):
    @abstractmethod
    def push_operation(self, operation: OperationCreatable) -> Self:
        """
        Pushes given operation into the transaction (exactly to the list of operations).

        Args:
            operation: Operation to be pushed into the transaction in dict or proto format.

        Examples:
            * Proto format:
            transaction.push_operation(vote_pb2.vote(voter="alice", author="bob", permlink="/", weight=11))

        Returns:
            Self: current transaction instance.
        """


class WaxBaseInterface(ABC):
    @property
    @abstractmethod
    def chain_id(self) -> ChainId:
        """Returns the chain id."""

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
            InvalidOperationFormatError, WaxValidationFailedError: When operation is incorrect.
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

    @abstractmethod
    def create_transaction_with_tapos(
        self, tapos_block_id: str, expiration: datetime | timedelta | None = None
    ) -> ITransaction:
        """
        Creates transaction object using basic information from chain.

        Args:
            tapos_block_id: Block id (mostly head) that transaction should refer to
            expiration: time (UTC) till transaction is valid. Default to +1 minute.

        Returns:
            Transaction object
        """

    @abstractmethod
    def create_transaction_from_proto(self, transaction: ProtoTransaction) -> ITransaction:
        """
        Creates transaction object from proto transaction.

        Args:
            transaction: Proto transaction object.

        Returns:
            Transaction object
        """
