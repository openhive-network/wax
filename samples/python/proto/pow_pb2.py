# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pow.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import legacy_chain_properties_pb2 as legacy__chain__properties__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\tpow.proto\x12\x15hive.protocol.buffers\x1a\x1dlegacy_chain_properties.proto\"J\n\x08pow_work\x12\x0e\n\x06worker\x18\x01 \x02(\t\x12\r\n\x05input\x18\x02 \x02(\t\x12\x11\n\tsignature\x18\x03 \x02(\t\x12\x0c\n\x04work\x18\x04 \x02(\t\"\xc6\x01\n\x03pow\x12&\n\x0eworker_account\x18\x01 \x02(\tR\x0eworker_account\x12\x1a\n\x08\x62lock_id\x18\x02 \x02(\tR\x08\x62lock_id\x12\r\n\x05nonce\x18\x03 \x02(\x04\x12-\n\x04work\x18\x04 \x02(\x0b\x32\x1f.hive.protocol.buffers.pow_work\x12=\n\x05props\x18\x05 \x02(\x0b\x32..hive.protocol.buffers.legacy_chain_properties')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'pow_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_POW_WORK']._serialized_start=67
  _globals['_POW_WORK']._serialized_end=141
  _globals['_POW']._serialized_start=144
  _globals['_POW']._serialized_end=342
# @@protoc_insertion_point(module_scope)
