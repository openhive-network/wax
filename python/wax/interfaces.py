from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, Any, Generic, TypeAlias

from typing_extensions import Self, TypeVar

from wax.api.collection import WaxApiCollection

if TYPE_CHECKING:
    from decimal import Decimal

    from beekeepy import AsyncUnlockedWallet
    from beekeepy.interfaces import HttpUrl
    from wax.models.asset import (
        AssetFactory,
        HbdNaiAssetConvertible,
        HiveNaiAssetConvertible,
        NaiAsset,
        VestsNaiAssetConvertible,
    )
    from wax.models.authority import ITransactionRequiredAuthorities, WaxAccountAuthorityInfo
    from wax.models.basic import AccountName, ChainId, Hex, PublicKey, SigDigest, Signature, TransactionId
    from wax.models.key_data import IBrainKeyData, IPrivateKeyData
    from wax.models.operations import Operation, WaxMetaOperation
    from wax.transaction_type_aliases import JsonTransaction, ProtoTransaction

TTimestamp: TypeAlias = datetime | timedelta
"""TTimestamp is a type alias for a timestamp that can be either a datetime object or a timedelta object."""

ChainConfig: TypeAlias = dict[str, str]
"""ChainConfig is a type alias for a dictionary containing chain configuration parameters."""

ApiCollectionT = TypeVar("ApiCollectionT", default=WaxApiCollection)
"""TypeVar for API collection, available by default in the IHiveChainInterface."""
ExtendedApiCollectionT = TypeVar("ExtendedApiCollectionT")
"""TypeVar for API collection that will be added to the IHiveChainInterface by the user."""


class IAuthorityDataProvider(ABC):
    """Interface providing authority data."""

    @abstractmethod
    async def get_hive_authority_data(self, name: AccountName) -> WaxAccountAuthorityInfo:
        """Get hive authority by account name."""


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
    def sig_digest(self) -> SigDigest:
        """
        Returns digest of the transaction for signing (HF26 serialization used).

        Returns:
            SigDigest: Digest of the transaction in hex form.

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
    def required_authorities(self) -> ITransactionRequiredAuthorities:
        """
        Returns required authority accounts from the transaction.

        Returns:
            ITransactionRequiredAuthorities: All possible authority models.
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
    async def sign(self, wallet: AsyncUnlockedWallet, public_key: PublicKey) -> Signature:
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
    def to_string(self) -> str:
        """
        Converts transaction object into the protobuf JSON string.

        Returns:
            str: Protobuf JSON string.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @abstractmethod
    def to_binary_form(self) -> Hex:
        """
        Allows to serialize underlying transaction to HF26 specific binary form, then return it as hexstring.

        Returns:
            Hex: Serialized transaction in hex form.
        """

    @abstractmethod
    def to_api(self) -> str:
        """
        Converts the created transaction into the Hive API-form str.

        Returns:
            str: Transaction in Hive API-form.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """

    @abstractmethod
    def to_dict(self) -> dict[str, Any]:
        """
        Converts the created transaction into the Hive API-form dict.

        Returns:
            dict: Transaction in Hive API-form.

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
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


class ITransaction(ITransactionBase):
    @abstractmethod
    def push_operation(self, operation: WaxMetaOperation) -> Self:
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


class IOnlineTransaction(ITransaction, ABC):
    """Transaction interface with support on-chain verification."""

    @abstractmethod
    async def perform_on_chain_verification(self) -> None:
        """
        Performs on-chain verification of the transaction.

        This method checks if all accounts involved in the transaction exist on the blockchain.
        It also scans the transaction for any potential private key leaks in operation contents.

        Raises:
            AccountNotFoundError: If ANY of impacted accounts do not exist in the blockchain.
            PrivateKeyDetectedInMemoError: If private key detected in the content of the operation.
        """


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
    def is_valid_account_name(account_name: AccountName) -> bool:
        """
        Checks if the given account name is valid.

        Args:
            account_name: Account name to be checked.

        Returns:
            bool: True if the account name is valid, False otherwise.
        """

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
    def suggest_brain_key() -> IBrainKeyData:
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
    def get_private_key_from_password(account: AccountName, role: str, password: str) -> IPrivateKeyData:
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

    @abstractmethod
    def create_transaction_with_tapos(self, tapos_block_id: str, expiration: TTimestamp | None = None) -> ITransaction:
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

    @abstractmethod
    def create_transaction_from_json(self, transaction: JsonTransaction) -> ITransaction:
        """
        Creates transaction object from JSON transaction.

        Args:
            transaction: JSON transaction object.

        Returns:
            Transaction object

        Raises:
            WaxValidationFailedError: When the transaction is incorrect.
        """


class IHiveChainInterface(IWaxBaseInterface, Generic[ApiCollectionT]):
    @property
    @abstractmethod
    def api(self) -> ApiCollectionT:
        """Returns the API collection object."""

    @property
    @abstractmethod
    def endpoint_url(self) -> HttpUrl:
        """Returns the selected endpoint url used to perform API calls."""

    @endpoint_url.setter
    @abstractmethod
    def endpoint_url(self, value: HttpUrl | str) -> None:
        """
        Sets the selected endpoint url used to perform API calls.

        Args:
            value: Endpoint url.

        Raises:
            InvalidEndpointUrlFormatError: When the url is incorrect.
        """

    @abstractmethod
    def extends(
        self, new_api: type[ExtendedApiCollectionT]
    ) -> IHiveChainInterface[ExtendedApiCollectionT | ApiCollectionT]:
        """
        Extends the current API collection with a new one.

        Args:
            new_api: New API collection class to be added.

        Returns:
            IHiveChainInterface: New chain instance with the extended API collection.

        Examples:
            class MyCustomApiCollection:
                def __init__(self):
                   self.my_custom_api = MyCustomApi

            chain = create_hive_chain()
            extended_chain = chain.extends(ExtendedApiCollection)

            response = await extended_chain.api.my_custom_api.custom_endpoint()  # With full intellisense support
        """

    @abstractmethod
    def extend_rest(
        self, new_rest_api: type[ExtendedApiCollectionT]
    ) -> IHiveChainInterface[ExtendedApiCollectionT | ApiCollectionT]:
        """
        Extends the current rest API collection with a new one.

        Args:
            new_rest_api: New rest API collection class to be added.

        Returns:
            IHiveChainInterface: New chain instance with the extended rest API collection.

        Examples:
            class MyCustomApiCollection:
                def __init__(self):
                   self.my_custom_api = MyCustomApi

            chain = create_hive_chain()
            extended_chain = chain.extend_rest(ExtendedApiCollection)

            response = await extended_chain.api.my_custom_api.custom_endpoint()  # With full intellisense support
        """

    @abstractmethod
    def teardown(self) -> None:
        """Call when work with API communication is over."""

    @abstractmethod
    async def create_transaction(self, expiration: TTimestamp | None = None) -> IOnlineTransaction:
        """
        Same as `IWaxBaseInterface.create_transaction_with_tapos` but pulls the reference block data from the remote.

        Args:
            expiration: time (UTC) till transaction is valid. Default to +1 minute.

        Returns:
            Transaction object

        Raises:
            AssertionError: when expiration is not valid type.
        """

    @abstractmethod
    async def broadcast(self, transaction: ITransaction | IOnlineTransaction) -> None:
        """
        Broadcast transaction to the selected during Wax Chain initialization Hive Node.

        Please note that when IOnlineTransaction is passed `perform_on_chain_verification`
        method is called automatically.

        Args:
            transaction: Transaction object to be broadcasted.

        Raises:
            TransactionNotSignedError: When the transaction is not signed.
            WaxValidationFailedError: When the transaction is incorrect.
            AccountNotFoundError: If IOnlineTransaction provided and ANY of impacted accounts not found on the chain.
            PrivateKeyDetectedInMemoError: If IOnlineTransaction provided private key detected in the content
             of the operation.
        """

    @abstractmethod
    async def collect_account_authorities(
        self, *accounts: AccountName
    ) -> WaxAccountAuthorityInfo | list[WaxAccountAuthorityInfo]:
        """
        Collects account authorities.

        Args:
            accounts: Account name(s).

        Returns:
            WaxAccountAuthorityInfo: Account authority info.

        Raises:
            InvalidAccountNameError: When the account(s) name is invalid.
            AccountNotFoundError: When the account(s) is not found in the HIVE api node.
        """
