# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: transfer_to_vesting_completed.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n#transfer_to_vesting_completed.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\"\xfb\x01\n\x1dtransfer_to_vesting_completed\x12\"\n\x0c\x66rom_account\x18\x01 \x02(\tR\x0c\x66rom_account\x12\x1e\n\nto_account\x18\x02 \x02(\tR\nto_account\x12>\n\x0bhive_vested\x18\x03 \x02(\x0b\x32\x1c.hive.protocol.buffers.assetR\x0bhive_vested\x12V\n\x17vesting_shares_received\x18\x04 \x02(\x0b\x32\x1c.hive.protocol.buffers.assetR\x17vesting_shares_received')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'transfer_to_vesting_completed_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_TRANSFER_TO_VESTING_COMPLETED']._serialized_start=76
  _globals['_TRANSFER_TO_VESTING_COMPLETED']._serialized_end=327
# @@protoc_insertion_point(module_scope)