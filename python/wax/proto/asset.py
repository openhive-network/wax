from wax.exceptions import WaxImportProtoBeforeCompileError

try:
    from wax._private.proto.asset_pb2 import asset
except (ImportError, ModuleNotFoundError) as error:
    raise WaxImportProtoBeforeCompileError from error

__all__ = [
    "asset",
]
