# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: update_proposal.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2
import future_extensions_pb2 as future__extensions__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15update_proposal.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\x1a\x17\x66uture_extensions.proto\"6\n\x18update_proposal_end_date\x12\x1a\n\x08\x65nd_date\x18\x01 \x02(\tR\x08\x65nd_date\"\xcc\x01\n\x19update_proposal_extension\x12\x37\n\x06void_t\x18\x01 \x01(\x0b\x32\x1d.hive.protocol.buffers.void_tH\x00R\x06void_t\x12m\n\x18update_proposal_end_date\x18\x02 \x01(\x0b\x32/.hive.protocol.buffers.update_proposal_end_dateH\x00R\x18update_proposal_end_dateB\x07\n\x05value\"\xe9\x01\n\x0fupdate_proposal\x12 \n\x0bproposal_id\x18\x01 \x02(\x03R\x0bproposal_id\x12\x0f\n\x07\x63reator\x18\x02 \x02(\t\x12:\n\tdaily_pay\x18\x03 \x02(\x0b\x32\x1c.hive.protocol.buffers.assetR\tdaily_pay\x12\x0f\n\x07subject\x18\x04 \x02(\t\x12\x10\n\x08permlink\x18\x05 \x02(\t\x12\x44\n\nextensions\x18\x06 \x03(\x0b\x32\x30.hive.protocol.buffers.update_proposal_extension')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'update_proposal_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_UPDATE_PROPOSAL_END_DATE']._serialized_start=86
  _globals['_UPDATE_PROPOSAL_END_DATE']._serialized_end=140
  _globals['_UPDATE_PROPOSAL_EXTENSION']._serialized_start=143
  _globals['_UPDATE_PROPOSAL_EXTENSION']._serialized_end=347
  _globals['_UPDATE_PROPOSAL']._serialized_start=350
  _globals['_UPDATE_PROPOSAL']._serialized_end=583
# @@protoc_insertion_point(module_scope)
