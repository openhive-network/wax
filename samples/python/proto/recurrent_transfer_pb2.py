# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: recurrent_transfer.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import future_extensions_pb2 as future__extensions__pb2
import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x18recurrent_transfer.proto\x12\x15hive.protocol.buffers\x1a\x17\x66uture_extensions.proto\x1a\x0b\x61sset.proto\"-\n\x1arecurrent_transfer_pair_id\x12\x0f\n\x07pair_id\x18\x01 \x02(\r\"\xb5\x01\n\x1crecurrent_transfer_extension\x12/\n\x06void_t\x18\x01 \x01(\x0b\x32\x1d.hive.protocol.buffers.void_tH\x00\x12W\n\x1arecurrent_transfer_pair_id\x18\x02 \x01(\x0b\x32\x31.hive.protocol.buffers.recurrent_transfer_pair_idH\x00\x42\x0b\n\textension\"\xdb\x01\n\x12recurrent_transfer\x12\x0c\n\x04\x66rom\x18\x01 \x02(\t\x12\n\n\x02to\x18\x02 \x02(\t\x12,\n\x06\x61mount\x18\x03 \x02(\x0b\x32\x1c.hive.protocol.buffers.asset\x12\x0c\n\x04memo\x18\x04 \x02(\t\x12\x12\n\nrecurrence\x18\x05 \x02(\r\x12\x12\n\nexecutions\x18\x06 \x02(\r\x12G\n\nextensions\x18\x07 \x03(\x0b\x32\x33.hive.protocol.buffers.recurrent_transfer_extension')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'recurrent_transfer_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_RECURRENT_TRANSFER_PAIR_ID']._serialized_start=89
  _globals['_RECURRENT_TRANSFER_PAIR_ID']._serialized_end=134
  _globals['_RECURRENT_TRANSFER_EXTENSION']._serialized_start=137
  _globals['_RECURRENT_TRANSFER_EXTENSION']._serialized_end=318
  _globals['_RECURRENT_TRANSFER']._serialized_start=321
  _globals['_RECURRENT_TRANSFER']._serialized_end=540
# @@protoc_insertion_point(module_scope)
