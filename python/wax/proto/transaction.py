from wax.exceptions import WaxImportProtoBeforeCompileError

try:
    from wax._private.proto.transaction_pb2 import transaction
except (ImportError, ModuleNotFoundError) as error:
    raise WaxImportProtoBeforeCompileError from error

__all__ = [
    "transaction",
]
