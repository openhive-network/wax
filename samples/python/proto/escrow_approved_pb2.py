# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: escrow_approved.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15\x65scrow_approved.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\"\x9d\x01\n\x0f\x65scrow_approved\x12\x1a\n\x0c\x66rom_account\x18\x01 \x02(\tR\x04\x66rom\x12\x16\n\nto_account\x18\x02 \x02(\tR\x02to\x12\r\n\x05\x61gent\x18\x03 \x02(\t\x12\x1c\n\tescrow_id\x18\x04 \x02(\rR\tescrow_id\x12)\n\x03\x66\x65\x65\x18\x05 \x02(\x0b\x32\x1c.hive.protocol.buffers.asset')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'escrow_approved_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_ESCROW_APPROVED']._serialized_start=62
  _globals['_ESCROW_APPROVED']._serialized_end=219
# @@protoc_insertion_point(module_scope)
