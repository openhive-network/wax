from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import TYPE_CHECKING, Final, Literal, Protocol, TypedDict, get_args

from hiveio_api.operations import (
    Authority,
    Hf26Operation,
    Hf26OperationValue,
    Hf26Transaction,
    LegacyChainProperties,
    LegacyOperation,
    LegacyTransaction,
    Price,
)

from schemas.fields.assets import AssetBase
from schemas.fields.base_type_mappings import NaiAsset
from schemas.fields.basic import AccountName, EmptyString, PrivateKey, PublicKey, WitnessUrl
from schemas.fields.hive_datetime import HiveDateTime

if TYPE_CHECKING:
    from collections.abc import Sequence

    from test_tools.__private.node import Node
    from test_tools.__private.remote_node import RemoteNode

    AnyNode = Node | RemoteNode

DEFAULT_PASSWORD: Final[str] = "password"
HIVE_MAX_TIME_UNTIL_EXPIRATION: Final[int] = 60 * 60
HIVE_MAX_TIME_UNTIL_SIGNATURE_EXPIRATION: Final[int] = 86400
ACCOUNT_PER_TRANSACTION: Final[int] = 500
MULTIPLE_IMPORT_KEYS_BATCH_SIZE: Final[int] = 10000

AccountNameApiType = AccountName | str
EmptyStringApiType = EmptyString | str
HiveDateTimeApiType = HiveDateTime | datetime | str
PublicKeyApiType = PublicKey | str
WitnessUrlApiType = WitnessUrl | str
HbdExchangeRateApiType = Price | dict[str, AssetBase]

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
    active: dict[PublicKey, PrivateKey] = field(default_factory=dict)
    owner: dict[PublicKey, PrivateKey] = field(default_factory=dict)
    posting: dict[PublicKey, PrivateKey] = field(default_factory=dict)

    def all_(self) -> dict[PublicKey, PrivateKey]:
        result = self.active.copy()
        result.update(self.owner)
        result.update(self.posting)
        return result


def as_nai_asset(asset: AssetBase) -> NaiAsset:
    """Asset (e.g. `tt.Asset.Test(1)`) in the form of fields of public models."""
    return NaiAsset(amount=str(asset.amount), precision=int(asset.precision()), nai=asset.nai())


def as_time(value: HiveDateTimeApiType) -> str:
    """Time (e.g. `datetime`) in the form of fields of public models (`2026-01-01T00:00:00`)."""
    return (value if isinstance(value, HiveDateTime) else HiveDateTime(value)).serialize()


class ApiAuthority(Protocol):
    """Authority of an account given by an API (e.g. `owner` of `wallet_bridge_api.get_account`)."""

    @property
    def weight_threshold(self) -> int: ...

    @property
    def account_auths(self) -> Sequence[Sequence[str | int]]: ...

    @property
    def key_auths(self) -> Sequence[Sequence[str | int]]: ...


def as_authority(authority: ApiAuthority) -> Authority:
    """Authority of an account given by an API (`weight_threshold`, `account_auths`, `key_auths`) as a public model."""
    return Authority(
        weight_threshold=authority.weight_threshold,
        account_auths=[(str(account), int(weight)) for account, weight in authority.account_auths],
        key_auths=[(str(key), int(weight)) for key, weight in authority.key_auths],
    )


class ChainProperties(TypedDict, total=False):
    """Properties proposed by a witness given as a dict - the fee also as an asset of test_tools (`tt.Asset.Test`)."""

    account_creation_fee: NaiAsset | AssetBase
    maximum_block_size: int
    hbd_interest_rate: int


def as_chain_properties(props: LegacyChainProperties | ChainProperties) -> LegacyChainProperties:
    """Properties proposed by a witness, also given as a dict with assets of test_tools, as a public model."""
    if isinstance(props, LegacyChainProperties):
        return props
    if unknown := props.keys() - ChainProperties.__optional_keys__:
        raise TypeError(f"Unknown properties of a witness: {sorted(unknown)}")
    defaults = LegacyChainProperties()
    fee = props.get("account_creation_fee", defaults.account_creation_fee)
    return LegacyChainProperties(
        account_creation_fee=as_nai_asset(fee) if isinstance(fee, AssetBase) else fee,
        maximum_block_size=props.get("maximum_block_size", defaults.maximum_block_size),
        hbd_interest_rate=props.get("hbd_interest_rate", defaults.hbd_interest_rate),
    )


HF26_FORMS: Final[dict[str, type[Hf26Operation]]] = {hf26_form.type: hf26_form for hf26_form in get_args(Hf26Operation)}
"""HF26 forms of operations by their names (`transfer_operation`)."""


def as_hf26_operation(operation: Hf26OperationValue) -> Hf26Operation:
    """Operation (e.g. `TransferOperation`) in its HF26 form (`{"type": "transfer_operation", "value": ...}`)."""
    return HF26_FORMS[operation.get_name_with_suffix()](value=operation)  # type: ignore[arg-type]


@dataclass(frozen=True, kw_only=True)
class SimpleTransaction(Hf26Transaction):
    def add_operation(self, operation: Hf26OperationValue) -> None:
        self.operations.append(as_hf26_operation(operation))


@dataclass(frozen=True, kw_only=True)
class SimpleTransactionLegacy(LegacyTransaction):
    """Transaction in legacy form with its location in the block log (e.g. to be signed by cli_wallet)."""

    block_num: int
    transaction_id: str
    transaction_num: int

    def add_operation(self, operation: LegacyOperation) -> None:
        self.operations.append(operation)


@dataclass(frozen=True, kw_only=True)
class WalletResponseBase(SimpleTransaction):
    transaction_id: str


@dataclass(frozen=True, kw_only=True)
class WalletResponse(WalletResponseBase):
    block_num: int
    transaction_num: int
    rc_cost: None | int = None
