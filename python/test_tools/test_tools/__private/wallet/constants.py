from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import TYPE_CHECKING, Final, Literal, TypedDict

from hiveio_api.operations import (
    LegacyChainProperties,
    Price,
    Transaction,
    TransactionLegacy,
    hf26_operation,
    legacy_operation,
)

from schemas import Asset
from schemas.fields.hive_datetime import HiveDateTime
from schemas.fields.public import AccountName, PublicKey, WitnessUrl

if TYPE_CHECKING:
    from hiveio_api.operations import OperationBase

    from test_tools.__private.node import Node
    from test_tools.__private.remote_node import RemoteNode

    AnyNode = Node | RemoteNode

DEFAULT_PASSWORD: Final[str] = "password"
HIVE_MAX_TIME_UNTIL_EXPIRATION: Final[int] = 60 * 60
HIVE_MAX_TIME_UNTIL_SIGNATURE_EXPIRATION: Final[int] = 86400
ACCOUNT_PER_TRANSACTION: Final[int] = 500
MULTIPLE_IMPORT_KEYS_BATCH_SIZE: Final[int] = 10000

AccountNameApiType = AccountName | str
HiveDateTimeApiType = HiveDateTime | datetime | str
PublicKeyApiType = PublicKey | str
WitnessUrlApiType = WitnessUrl | str
HbdExchangeRateApiType = Price | dict[str, Asset]

AuthorityType = Literal["active", "owner", "posting"]
TransactionSerializationTypes = Literal["hf26", "legacy"]


@dataclass
class AuthorityRequirementsHolder:
    active: set[str] = field(default_factory=set)
    owner: set[str] = field(default_factory=set)
    posting: set[str] = field(default_factory=set)

    def all_(self) -> set[str]:
        return {*self.active, *self.owner, *self.posting}


@dataclass
class AuthorityHolder:
    active: dict[PublicKey, str] = field(default_factory=dict)
    owner: dict[PublicKey, str] = field(default_factory=dict)
    posting: dict[PublicKey, str] = field(default_factory=dict)

    def all_(self) -> dict[PublicKey, str]:
        result = self.active.copy()
        result.update(self.owner)
        result.update(self.posting)
        return result


class ChainProperties(TypedDict, total=False):
    """Properties proposed by a witness given as a dict (e.g. `{"account_creation_fee": tt.Asset.Test(3)}`)."""

    account_creation_fee: Asset
    maximum_block_size: int
    hbd_interest_rate: int


def as_chain_properties(props: LegacyChainProperties | ChainProperties) -> LegacyChainProperties:
    """Properties proposed by a witness, also given as a dict, as a public model."""
    if isinstance(props, LegacyChainProperties):
        return props
    if unknown := props.keys() - ChainProperties.__optional_keys__:
        raise TypeError(f"Unknown properties of a witness: {sorted(unknown)}")
    defaults = LegacyChainProperties()
    return LegacyChainProperties(
        account_creation_fee=props.get("account_creation_fee", defaults.account_creation_fee),
        maximum_block_size=props.get("maximum_block_size", defaults.maximum_block_size),
        hbd_interest_rate=props.get("hbd_interest_rate", defaults.hbd_interest_rate),
    )


@dataclass(kw_only=True)
class SimpleTransaction(Transaction):
    def add_operation(self, operation: OperationBase) -> None:
        representation = hf26_operation(operation)
        self.operations.append(representation)


@dataclass(kw_only=True)
class SimpleTransactionLegacy(TransactionLegacy):
    """Transaction in legacy form (e.g. to be signed by cli_wallet with the legacy serialization)."""

    def add_operation(self, operation: OperationBase) -> None:
        """Add the operation - a value of either form (e.g. `TransferOperation`) is added in the legacy form."""
        representation = legacy_operation(operation)
        self.operations.append(representation)


@dataclass(kw_only=True)
class WalletResponseBase(SimpleTransaction):
    transaction_id: str


@dataclass(kw_only=True)
class WalletResponse(WalletResponseBase):
    block_num: int
    transaction_num: int
    rc_cost: None | int = None
