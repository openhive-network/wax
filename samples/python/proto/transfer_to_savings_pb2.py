# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: transfer_to_savings.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x19transfer_to_savings.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\"\x85\x01\n\x13transfer_to_savings\x12\x1a\n\x0c\x66rom_account\x18\x01 \x02(\tR\x04\x66rom\x12\x16\n\nto_account\x18\x02 \x02(\tR\x02to\x12,\n\x06\x61mount\x18\x03 \x02(\x0b\x32\x1c.hive.protocol.buffers.asset\x12\x0c\n\x04memo\x18\x04 \x02(\t')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'transfer_to_savings_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_TRANSFER_TO_SAVINGS']._serialized_start=66
  _globals['_TRANSFER_TO_SAVINGS']._serialized_end=199
# @@protoc_insertion_point(module_scope)
