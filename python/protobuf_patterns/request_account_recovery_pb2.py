# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: request_account_recovery.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import authority_pb2 as authority__pb2
import future_extensions_pb2 as future__extensions__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x1erequest_account_recovery.proto\x12\x15hive.protocol.buffers\x1a\x0f\x61uthority.proto\x1a\x17\x66uture_extensions.proto\"\x88\x02\n\x18request_account_recovery\x12*\n\x10recovery_account\x18\x01 \x02(\tR\x10recovery_account\x12.\n\x12\x61\x63\x63ount_to_recover\x18\x02 \x02(\tR\x12\x61\x63\x63ount_to_recover\x12R\n\x13new_owner_authority\x18\x03 \x02(\x0b\x32 .hive.protocol.buffers.authorityR\x13new_owner_authority\x12<\n\nextensions\x18\x04 \x03(\x0b\x32(.hive.protocol.buffers.future_extensions')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'request_account_recovery_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_REQUEST_ACCOUNT_RECOVERY']._serialized_start=100
  _globals['_REQUEST_ACCOUNT_RECOVERY']._serialized_end=364
# @@protoc_insertion_point(module_scope)