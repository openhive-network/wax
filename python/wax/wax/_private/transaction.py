from __future__ import annotations

import json
from copy import deepcopy
from typing import TYPE_CHECKING, Any, TypeAlias

from google.protobuf.json_format import MessageToJson, ParseDict
from typing_extensions import Self

from wax._private.core.constants import DEFAULT_TRANSACTION_EXPIRATION_TIME
from wax._private.cython_wrappers import get_tapos_data, tx_add_signature, tx_sig_digest, tx_signature_keys
from wax._private.models.hive_date_time import HiveDateTime
from wax._private.models.transaction_required_authorities import TransactionRequiredAuthorities
from wax._private.operation_base import OperationBase
from wax._private.proto_utils import message_to_dict_with_defaults
from wax.cpp_python_bridge import (  # type: ignore[attr-defined]
    create_wax_operation,
    create_wax_transaction,
    python_ref_block_data,
    tx_add_operation,
    tx_api_to_proto,
    tx_id,
    tx_impacted_accounts,
    tx_required_authorities,
    tx_set_expiration,
    tx_to_binary,
    tx_to_json,
    tx_to_legacy_json,
    tx_validate,
)
from wax.interfaces import ITransaction
from wax.transaction_type_aliases import JsonTransaction, ProtoTransaction, proto_transaction

if TYPE_CHECKING:
    from datetime import timedelta

    from beekeepy import AsyncUnlockedWallet
    from wax import IWaxBaseInterface
    from wax.models.basic import AccountName, Hex, PublicKey, SigDigest, Signature, TransactionId
    from wax.models.operations import WaxMetaOperation
    from wax.proto.operations import operation as proto_operation


TaposBlockId: TypeAlias = str


class Transaction(ITransaction):
    def __init__(
        self,
        api: IWaxBaseInterface,
        tapos_block_id: TaposBlockId | ProtoTransaction,
        expiration_time: timedelta = DEFAULT_TRANSACTION_EXPIRATION_TIME,
        head_block_time: HiveDateTime | None = None,
    ) -> None:
        self._api = api
        self._expiration_time = expiration_time
        self._head_block_time = head_block_time

        if isinstance(tapos_block_id, ProtoTransaction):  # type: ignore[misc, unused-ignore] # proto generated
            self._target = deepcopy(tapos_block_id)
            self._handle = create_wax_transaction(self._target, is_protobuf=True)
        else:
            tapos = (
                get_tapos_data(tapos_block_id)
                if isinstance(tapos_block_id, str)
                else self._resolve_tapos_from_transaction(tapos_block_id)  # type: ignore[arg-type, unused-ignore]
            )
            self._target = proto_transaction(ref_block_num=tapos.ref_block_num, ref_block_prefix=tapos.ref_block_prefix)
            # Create dict with all default fields included
            self._handle = create_wax_transaction(self._target, is_protobuf=True)

    @property
    def transaction(self) -> ProtoTransaction:
        self._flush_transaction()
        return self._target

    @property
    def is_signed(self) -> bool:
        return bool(self._target.signatures)

    @property
    def sig_digest(self) -> SigDigest:
        self._flush_transaction()
        return tx_sig_digest(self._handle, chain_id=self._api.chain_id, use_hf26_serialization=True)

    @property
    def impacted_accounts(self) -> list[AccountName]:
        return tx_impacted_accounts(self._handle)

    @property
    def id(self) -> TransactionId:
        self._flush_transaction()
        return tx_id(self._handle, use_hf26_serialization=True)

    @property
    def signature_keys(self) -> list[PublicKey]:
        return tx_signature_keys(self._handle, chain_id=self._api.chain_id, use_hf26_serialization=True)

    @property
    def required_authorities(self) -> TransactionRequiredAuthorities:
        required_authorities = tx_required_authorities(self._handle)
        return TransactionRequiredAuthorities(required_authorities)

    def validate(self) -> None:
        self._flush_transaction()
        tx_validate(self._handle)

    async def sign(self, wallet: AsyncUnlockedWallet, public_key: PublicKey) -> Signature:
        self.validate()
        sig = await wallet.sign_digest(sig_digest=self.sig_digest, key=public_key)
        return self.add_signature(sig)

    def add_signature(self, signature: Signature) -> Signature:
        self._target.signatures.append(signature)
        tx_add_signature(self._handle, signature)
        return signature

    def to_string(self) -> str:
        self._flush_transaction()
        return MessageToJson(self._target)

    def to_binary_form(self) -> Hex:
        self._flush_transaction()
        return tx_to_binary(self._handle, use_hf26_serialization=True, strip_to_unsigned_transaction=False)

    @staticmethod
    def from_api(api: IWaxBaseInterface, transaction: JsonTransaction | dict[str, Any]) -> Transaction:
        transaction = json.loads(transaction) if isinstance(transaction, str) else deepcopy(transaction)
        tx_api_to_proto(transaction)

        proto_tx = ParseDict(transaction, proto_transaction())
        return Transaction(api, proto_tx)

    def to_api(self) -> str:
        self._flush_transaction()
        return tx_to_json(self._handle)

    def to_legacy_api(self) -> str:
        self._flush_transaction()
        return tx_to_legacy_json(self._handle)

    def to_dict(self) -> dict[str, Any]:
        return json.loads(self.to_api())  # type: ignore[no-any-return]

    def to_api_json(self) -> JsonTransaction:
        return self.to_api()

    def _push_operation(self, operation: proto_operation) -> None:
        operation_name = operation.__class__.__name__
        # TODO: Note: We could eliminate this step if python used "from" instead of "from_account"
        # And not ignored default empty array values, e.g. extensions=[].
        dict_default_op = message_to_dict_with_defaults(operation)
        op_handle = create_wax_operation({operation_name + "_operation": dict_default_op}, is_protobuf=True)
        tx_add_operation(self._handle, op_handle)
        self._target.operations.add(**{operation_name + "_operation": operation})

    def push_operation(self, operation: WaxMetaOperation) -> Self:
        if isinstance(operation, OperationBase):
            for op in operation.finalize(self._api):
                self._push_operation(op)  # type: ignore[arg-type, unused-ignore]
        else:
            # OneOf type specifier must have _operation suffix, e.g.: <class_name>_operation
            # to match Hive Protocol type name.
            self._push_operation(operation)  # type: ignore[arg-type, unused-ignore]
        return self

    def _flush_transaction(self) -> None:
        """Apply expiration if not set."""
        if not bool(self._target.expiration):
            self._apply_expiration()

    def _apply_expiration(self) -> None:
        if self._head_block_time is not None:
            expiration = self._head_block_time + self._expiration_time
        else:
            expiration = HiveDateTime.now() + self._expiration_time

        self._target.expiration = expiration.replace(microsecond=0).serialize()
        tx_set_expiration(self._handle, self._target.expiration)

    def _calculate_signer_public_keys(self) -> list[PublicKey]:
        """Calculate public keys of signers."""
        return [
            self._api.get_public_key_from_signature(self.sig_digest, signature) for signature in self._target.signatures
        ]

    def _resolve_tapos_from_transaction(self, proto_transaction: ProtoTransaction) -> python_ref_block_data:
        return python_ref_block_data(
            ref_block_num=proto_transaction.ref_block_num,
            ref_block_prefix=proto_transaction.ref_block_prefix,
        )
