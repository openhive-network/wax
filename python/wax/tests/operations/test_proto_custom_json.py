from wax_local_tools.checkers import check_operations, check_transaction

from wax.proto.operations import (
    custom_json,
    operation,
)
from wax.proto.transaction import transaction

"""
        required_auths: collections.abc.Iterable[builtins.str] | None = ...,
        required_posting_auths: collections.abc.Iterable[builtins.str] | None = ...,
        id: builtins.str | None = ...,
        json: builtins.str | None = ...,
"""


def test_custom_json():
    custom_json_proto: custom_json = custom_json(
        required_auths=["bytemaster"], required_posting_auths=["other"], id="666", json="{}"
    )

    custom_json_operation: operation = operation(custom_json_operation=custom_json_proto)
    check_operations(custom_json_operation)

    transaction_proto: transaction = transaction(operations=[custom_json_operation])

    check_transaction(transaction_proto)
