# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: account_update2.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import authority_pb2 as authority__pb2
import future_extensions_pb2 as future__extensions__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15\x61\x63\x63ount_update2.proto\x12\x15hive.protocol.buffers\x1a\x0f\x61uthority.proto\x1a\x17\x66uture_extensions.proto\"\xee\x02\n\x0f\x61\x63\x63ount_update2\x12\x0f\n\x07\x61\x63\x63ount\x18\x01 \x02(\t\x12/\n\x05owner\x18\x02 \x01(\x0b\x32 .hive.protocol.buffers.authority\x12\x30\n\x06\x61\x63tive\x18\x03 \x01(\x0b\x32 .hive.protocol.buffers.authority\x12\x31\n\x07posting\x18\x04 \x01(\x0b\x32 .hive.protocol.buffers.authority\x12\x1a\n\x08memo_key\x18\x05 \x01(\tR\x08memo_key\x12$\n\rjson_metadata\x18\x06 \x02(\tR\rjson_metadata\x12\x34\n\x15posting_json_metadata\x18\x07 \x02(\tR\x15posting_json_metadata\x12<\n\nextensions\x18\x08 \x03(\x0b\x32(.hive.protocol.buffers.future_extensions')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'account_update2_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_ACCOUNT_UPDATE2']._serialized_start=91
  _globals['_ACCOUNT_UPDATE2']._serialized_end=457
# @@protoc_insertion_point(module_scope)
