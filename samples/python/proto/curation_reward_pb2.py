# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: curation_reward.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15\x63uration_reward.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\"\xdc\x01\n\x0f\x63uration_reward\x12\x0f\n\x07\x63urator\x18\x01 \x02(\t\x12,\n\x06reward\x18\x02 \x02(\x0b\x32\x1c.hive.protocol.buffers.asset\x12&\n\x0e\x63omment_author\x18\x03 \x02(\tR\x0e\x63omment_author\x12*\n\x10\x63omment_permlink\x18\x04 \x02(\tR\x10\x63omment_permlink\x12\x36\n\x16payout_must_be_claimed\x18\x05 \x02(\x08R\x16payout_must_be_claimed')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'curation_reward_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_CURATION_REWARD']._serialized_start=62
  _globals['_CURATION_REWARD']._serialized_end=282
# @@protoc_insertion_point(module_scope)
