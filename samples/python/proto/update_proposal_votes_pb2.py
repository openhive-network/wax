# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: update_proposal_votes.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import future_extensions_pb2 as future__extensions__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x1bupdate_proposal_votes.proto\x12\x15hive.protocol.buffers\x1a\x17\x66uture_extensions.proto\"\x99\x01\n\x15update_proposal_votes\x12\r\n\x05voter\x18\x01 \x02(\t\x12\"\n\x0cproposal_ids\x18\x02 \x03(\x03R\x0cproposal_ids\x12\x0f\n\x07\x61pprove\x18\x03 \x02(\x08\x12<\n\nextensions\x18\x04 \x03(\x0b\x32(.hive.protocol.buffers.future_extensions')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'update_proposal_votes_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_UPDATE_PROPOSAL_VOTES']._serialized_start=80
  _globals['_UPDATE_PROPOSAL_VOTES']._serialized_end=233
# @@protoc_insertion_point(module_scope)
