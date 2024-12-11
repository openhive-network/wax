from __future__ import annotations

from copy import deepcopy
from datetime import timedelta
from typing import TYPE_CHECKING, TypeAlias

from google.protobuf.json_format import MessageToJson
from typing_extensions import Self

from schemas.fields.hex import Signature, TransactionId
from schemas.fields.hive_datetime import HiveDateTime
from wax._private.models.required_authorities import TransactionRequiredAuthorities
from wax._private.result_tools import decode_impacted_account_names, expose_result, validate_wax_result
from wax.cpp_python_bridge import (  # type: ignore[attr-defined]
    calculate_proto_sig_digest,
    calculate_proto_transaction_id,
    get_tapos_data,
    get_transaction_required_authorities,
    proto_to_api,
    python_ref_block_data,
    transaction_get_impacted_accounts,
    validate_proto_transaction,
)
from wax.interfaces import ITransaction, JsonTransaction, ProtoTransaction
from wax.proto.transaction_pb2 import transaction as proto_transaction

if TYPE_CHECKING:
    from beekeepy._interface.abc.synchronous.wallet import UnlockedWallet
    from schemas.fields.basic import PublicKey
    from wax import WaxBaseInterface
    from wax._private.models.basic import AccountName
    from wax._private.models.operations import OperationCreatable


TaposBlockId: TypeAlias = str


class Transaction(ITransaction):
    def __init__(
        self,
        api: WaxBaseInterface,
        tapos_block_id: TaposBlockId | ProtoTransaction,
        expiration_time: timedelta = timedelta(minutes=30),
        head_block_time: HiveDateTime | None = None,
    ) -> None:
        self._api = api
        self._expiration_time = expiration_time
        self._head_block_time = head_block_time

        self.tapos = (
            get_tapos_data(tapos_block_id.encode())
            if isinstance(tapos_block_id, str)
            else self._resolve_tapos_from_transaction(tapos_block_id)
        )

        if isinstance(tapos_block_id, ProtoTransaction):
            self._target = deepcopy(tapos_block_id)
        else:
            self._target = proto_transaction(
                ref_block_num=self.tapos.ref_block_num, ref_block_prefix=self.tapos.ref_block_prefix
            )

    @property
    def transaction(self) -> ProtoTransaction:
        self._flush_transaction()
        return self._target

    @property
    def is_signed(self) -> bool:
        return bool(self._target.signatures)

    @property
    def sig_digest(self) -> Signature:
        sig_digest = calculate_proto_sig_digest(self._encoded, self._api.chain_id.encode())
        validate_wax_result(sig_digest)

        return Signature(expose_result(sig_digest))

    @property
    def impacted_accounts(self) -> list[AccountName]:
        impacted_accounts = transaction_get_impacted_accounts(self._encoded)

        return decode_impacted_account_names(impacted_accounts)

    @property
    def id(self) -> TransactionId:
        transaction_id = calculate_proto_transaction_id(self._encoded)
        validate_wax_result(transaction_id)

        return TransactionId(expose_result(transaction_id))

    @property
    def signature_keys(self) -> list[PublicKey]:
        return self._calculate_signer_public_keys()

    @property
    def required_authorities(self) -> TransactionRequiredAuthorities:
        required_authorities = get_transaction_required_authorities(self.to_api_json().encode())
        return TransactionRequiredAuthorities(required_authorities)

    def validate(self) -> None:
        validation_result = validate_proto_transaction(self._encoded)
        validate_wax_result(validation_result)

    def sign(self, wallet: UnlockedWallet, public_key: PublicKey) -> Signature:
        self.validate()
        sig = wallet.sign_digest(sig_digest=self.sig_digest, key=public_key)
        self._target.signatures.append(sig)

        return sig

    def add_signature(self, signature: Signature) -> Signature:
        self._target.signatures.append(signature)
        return signature

    def to_api_json(self) -> JsonTransaction:
        result = proto_to_api(self._encoded)
        validate_wax_result(result)

        return expose_result(result)

    def push_operation(self, operation: OperationCreatable) -> Self:
        self._target.operations.add(**{operation.__class__.__name__: operation})
        return self

    @property
    def _encoded(self) -> bytes:
        """Current state of the transaction as bytes."""
        return MessageToJson(self._target).encode()

    def _flush_transaction(self) -> None:
        if not bool(self._target.expiration):
            self._apply_expiration()

    def _apply_expiration(self) -> None:
        if self._head_block_time is not None:
            expiration = self._head_block_time + self._expiration_time
        else:
            expiration = HiveDateTime.now() + self._expiration_time

        self._target.expiration = str(expiration.isoformat())

    def _calculate_signer_public_keys(self) -> list[PublicKey]:
        """Calculate public keys of signers."""
        keys: list[PublicKey] = []
        sig_digest = self.sig_digest

        for signature in self._target.signatures:
            public_key = self._api.get_public_key_from_signature(sig_digest, Signature(signature))
            keys.append(public_key)

        return keys

    def _resolve_tapos_from_transaction(self, proto_transaction: ProtoTransaction) -> python_ref_block_data:
        return python_ref_block_data(
            ref_block_num=proto_transaction.ref_block_num,
            ref_block_prefix=proto_transaction.ref_block_prefix,
        )
