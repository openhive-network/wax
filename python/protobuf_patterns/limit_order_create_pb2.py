# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: limit_order_create.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x18limit_order_create.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\"\xf8\x01\n\x12limit_order_create\x12\r\n\x05owner\x18\x01 \x02(\t\x12\x0f\n\x07orderid\x18\x02 \x02(\r\x12\x44\n\x0e\x61mount_to_sell\x18\x03 \x02(\x0b\x32\x1c.hive.protocol.buffers.assetR\x0e\x61mount_to_sell\x12\x44\n\x0emin_to_receive\x18\x04 \x02(\x0b\x32\x1c.hive.protocol.buffers.assetR\x0emin_to_receive\x12\"\n\x0c\x66ill_or_kill\x18\x05 \x02(\x08R\x0c\x66ill_or_kill\x12\x12\n\nexpiration\x18\x06 \x02(\t')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'limit_order_create_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_LIMIT_ORDER_CREATE']._serialized_start=65
  _globals['_LIMIT_ORDER_CREATE']._serialized_end=313
# @@protoc_insertion_point(module_scope)
