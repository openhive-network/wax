# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: escrow_approve.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x14\x65scrow_approve.proto\x12\x15hive.protocol.buffers\"\x8f\x01\n\x0e\x65scrow_approve\x12\x1a\n\x0c\x66rom_account\x18\x01 \x02(\tR\x04\x66rom\x12\x16\n\nto_account\x18\x02 \x02(\tR\x02to\x12\r\n\x05\x61gent\x18\x03 \x02(\t\x12\x0b\n\x03who\x18\x04 \x02(\t\x12\x1c\n\tescrow_id\x18\x05 \x02(\rR\tescrow_id\x12\x0f\n\x07\x61pprove\x18\x06 \x02(\x08')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'escrow_approve_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_ESCROW_APPROVE']._serialized_start=48
  _globals['_ESCROW_APPROVE']._serialized_end=191
# @@protoc_insertion_point(module_scope)
