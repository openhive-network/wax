# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: account.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2
import authority_pb2 as authority__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\raccount.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\x1a\x0f\x61uthority.proto\"\xeb\x01\n\x0e\x61\x63\x63ount_create\x12)\n\x03\x66\x65\x65\x18\x01 \x02(\x0b\x32\x1c.hive.protocol.buffers.asset\x12\x0f\n\x07\x63reator\x18\x02 \x02(\t\x12*\n\x10new_account_name\x18\x03 \x02(\tR\x10new_account_name\x12/\n\x05owner\x18\x04 \x02(\x0b\x32 .hive.protocol.buffers.authority\x12\x1a\n\x08memo_key\x18\x05 \x02(\tR\x08memo_key\x12$\n\rjson_metadata\x18\x06 \x02(\tR\rjson_metadata')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'account_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_ACCOUNT_CREATE']._serialized_start=71
  _globals['_ACCOUNT_CREATE']._serialized_end=306
# @@protoc_insertion_point(module_scope)
