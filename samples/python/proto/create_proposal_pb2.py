# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: create_proposal.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2
import future_extensions_pb2 as future__extensions__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15\x63reate_proposal.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\x1a\x17\x66uture_extensions.proto\"\x8d\x02\n\x0f\x63reate_proposal\x12\x0f\n\x07\x63reator\x18\x01 \x02(\t\x12\x10\n\x08receiver\x18\x02 \x02(\t\x12\x1e\n\nstart_date\x18\x03 \x02(\tR\nstart_date\x12\x1a\n\x08\x65nd_date\x18\x04 \x02(\tR\x08\x65nd_date\x12:\n\tdaily_pay\x18\x05 \x02(\x0b\x32\x1c.hive.protocol.buffers.assetR\tdaily_pay\x12\x0f\n\x07subject\x18\x06 \x02(\t\x12\x10\n\x08permlink\x18\x07 \x02(\t\x12<\n\nextensions\x18\x08 \x03(\x0b\x32(.hive.protocol.buffers.future_extensions')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'create_proposal_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_CREATE_PROPOSAL']._serialized_start=87
  _globals['_CREATE_PROPOSAL']._serialized_end=356
# @@protoc_insertion_point(module_scope)