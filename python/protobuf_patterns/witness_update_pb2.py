# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: witness_update.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import legacy_chain_properties_pb2 as legacy__chain__properties__pb2
import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x14witness_update.proto\x12\x15hive.protocol.buffers\x1a\x1dlegacy_chain_properties.proto\x1a\x0b\x61sset.proto\"\xc4\x01\n\x0ewitness_update\x12\r\n\x05owner\x18\x01 \x02(\t\x12\x0b\n\x03url\x18\x02 \x02(\t\x12,\n\x11\x62lock_signing_key\x18\x03 \x02(\tR\x11\x62lock_signing_key\x12=\n\x05props\x18\x04 \x02(\x0b\x32..hive.protocol.buffers.legacy_chain_properties\x12)\n\x03\x66\x65\x65\x18\x05 \x02(\x0b\x32\x1c.hive.protocol.buffers.asset')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'witness_update_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_WITNESS_UPDATE']._serialized_start=92
  _globals['_WITNESS_UPDATE']._serialized_end=288
# @@protoc_insertion_point(module_scope)
