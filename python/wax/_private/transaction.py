from __future__ import annotations

import json
from copy import deepcopy
from typing import TYPE_CHECKING, TypeAlias

from google.protobuf.json_format import MessageToJson, Parse
from typing_extensions import Self

from wax._private.core.constants import DEFAULT_TRANSACTION_EXPIRATION_TIME
from wax._private.models.hive_date_time import HiveDateTime
from wax._private.models.transaction_required_authorities import TransactionRequiredAuthorities
from wax._private.result_tools import (
    decode_impacted_account_names,
    expose_result_as_cpp_string,
    expose_result_as_python_string,
    to_cpp_string,
    validate_wax_result,
)
from wax.cpp_python_bridge import (  # type: ignore[attr-defined]
    api_to_proto,
    calculate_proto_sig_digest,
    calculate_proto_transaction_id,
    get_tapos_data,
    get_transaction_required_authorities,
    proto_to_api,
    proto_transaction_get_impacted_accounts,
    python_ref_block_data,
    serialize_proto_transaction,
    validate_proto_transaction,
)
from wax.interfaces import ITransaction, JsonTransaction, ProtoTransaction
from wax._private.operation_base import OperationBase
from wax.proto.transaction import transaction as proto_transaction

if TYPE_CHECKING:
    from datetime import timedelta

    from beekeepy import AsyncUnlockedWallet
    from wax import IWaxBaseInterface
    from wax.models.basic import AccountName, Hex, PublicKey, SigDigest, Signature, TransactionId
    from wax.models.operations import WaxMetaOperation


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

        self.tapos = (
            get_tapos_data(to_cpp_string(tapos_block_id))
            if isinstance(tapos_block_id, str)
            else self._resolve_tapos_from_transaction(tapos_block_id)
        )

        if isinstance(tapos_block_id, ProtoTransaction):  # type: ignore[misc, unused-ignore] # proto generated
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
    def sig_digest(self) -> SigDigest:
        sig_digest = calculate_proto_sig_digest(to_cpp_string(self.to_string()), to_cpp_string(self._api.chain_id))
        validate_wax_result(sig_digest)
        return expose_result_as_python_string(sig_digest)

    @property
    def impacted_accounts(self) -> list[AccountName]:
        impacted_accounts = proto_transaction_get_impacted_accounts(to_cpp_string(self.to_string()))
        return decode_impacted_account_names(impacted_accounts)

    @property
    def id(self) -> TransactionId:
        transaction_id = calculate_proto_transaction_id(to_cpp_string(self.to_string()))
        validate_wax_result(transaction_id)
        return expose_result_as_python_string(transaction_id)

    @property
    def signature_keys(self) -> list[PublicKey]:
        return self._calculate_signer_public_keys()

    @property
    def required_authorities(self) -> TransactionRequiredAuthorities:
        required_authorities = get_transaction_required_authorities(to_cpp_string(self.to_api()))
        return TransactionRequiredAuthorities(required_authorities)

    def validate(self) -> None:
        validation_result = validate_proto_transaction(to_cpp_string(self.to_string()))
        validate_wax_result(validation_result)

    async def sign(self, wallet: AsyncUnlockedWallet, public_key: PublicKey) -> Signature:
        self.validate()
        sig = await wallet.sign_digest(sig_digest=self.sig_digest, key=public_key)
        self._target.signatures.append(sig)
        return sig

    def add_signature(self, signature: Signature) -> Signature:
        self._target.signatures.append(signature)
        return signature

    def to_string(self) -> str:
        self._flush_transaction()
        return MessageToJson(self._target)

    def to_binary_form(self) -> Hex:
        conversion_result = serialize_proto_transaction(to_cpp_string(self.to_string()))
        validate_wax_result(conversion_result)
        return expose_result_as_python_string(conversion_result)

    @staticmethod
    def from_api(api: IWaxBaseInterface, transaction: JsonTransaction) -> Transaction:
        proto_data = api_to_proto(to_cpp_string(transaction))
        validate_wax_result(proto_data)

        proto_tx = Parse(expose_result_as_cpp_string(proto_data), proto_transaction())
        return Transaction(api, proto_tx)

    def to_api(self) -> str:
        result = proto_to_api(to_cpp_string(self.to_string()))
        validate_wax_result(result)

        as_string = expose_result_as_python_string(result)
        as_dict = json.loads(as_string)

        try:
            as_dict["extensions"]
        except KeyError:
            as_dict["extensions"] = []  # manually add extensions if not present as MessageToJson convert cuts them off

        return json.dumps(as_dict)

    def to_dict(self) -> dict[str, str]:
        return json.loads(self.to_api())  # type: ignore[no-any-return]

    def to_api_json(self) -> JsonTransaction:
        return self.to_api()

    def push_operation(self, operation: WaxMetaOperation) -> Self:
        if isinstance(operation, OperationBase):
            for op in operation.finalize(self._api):
                self._target.operations.add(**{op.__class__.__name__: op})
        else:
            self._target.operations.add(**{operation.__class__.__name__: operation})
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

        self._target.expiration = str(expiration.replace(microsecond=0).isoformat())

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
