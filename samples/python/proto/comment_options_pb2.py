# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: comment_options.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import asset_pb2 as asset__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x15\x63omment_options.proto\x12\x15hive.protocol.buffers\x1a\x0b\x61sset.proto\"9\n\x16\x62\x65neficiary_route_type\x12\x0f\n\x07\x61\x63\x63ount\x18\x01 \x02(\t\x12\x0e\n\x06weight\x18\x02 \x02(\r\"d\n\x1c\x63omment_payout_beneficiaries\x12\x44\n\rbeneficiaries\x18\x01 \x03(\x0b\x32-.hive.protocol.buffers.beneficiary_route_type\"\xc8\x02\n\x0f\x63omment_options\x12\x0e\n\x06\x61uthor\x18\x01 \x02(\t\x12\x10\n\x08permlink\x18\x02 \x02(\t\x12N\n\x13max_accepted_payout\x18\x03 \x02(\x0b\x32\x1c.hive.protocol.buffers.assetR\x13max_accepted_payout\x12 \n\x0bpercent_hbd\x18\x04 \x02(\rR\x0bpercent_hbd\x12 \n\x0b\x61llow_votes\x18\x05 \x02(\x08R\x0b\x61llow_votes\x12\x36\n\x16\x61llow_curation_rewards\x18\x06 \x02(\x08R\x16\x61llow_curation_rewards\x12G\n\nextensions\x18\x07 \x03(\x0b\x32\x33.hive.protocol.buffers.comment_payout_beneficiaries')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'comment_options_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:
  DESCRIPTOR._options = None
  _globals['_BENEFICIARY_ROUTE_TYPE']._serialized_start=61
  _globals['_BENEFICIARY_ROUTE_TYPE']._serialized_end=118
  _globals['_COMMENT_PAYOUT_BENEFICIARIES']._serialized_start=120
  _globals['_COMMENT_PAYOUT_BENEFICIARIES']._serialized_end=220
  _globals['_COMMENT_OPTIONS']._serialized_start=223
  _globals['_COMMENT_OPTIONS']._serialized_end=551
# @@protoc_insertion_point(module_scope)
