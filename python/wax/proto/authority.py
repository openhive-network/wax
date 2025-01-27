from wax.exceptions import WaxImportProtoBeforeCompileError

try:
    from wax._private.proto.authority_pb2 import authority
except (ImportError, ModuleNotFoundError) as error:
    raise WaxImportProtoBeforeCompileError from error


__all__ = [
    "authority",
]