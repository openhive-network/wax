# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: pow2.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import legacy_chain_properties_pb2 as legacy__chain__properties__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\npow2.proto\x12\x15hive.protocol.buffers\x1a\x1dlegacy_chain_properties.proto\"c\n\npow2_input\x12&\n\x0eworker_account\x18\x01 \x02(\tR\x0eworker_account\x12\x1e\n\nprev_block\x18\x02 \x02(\tR\nprev_block\x12\r\n\x05nonce\x18\x03 \x02(\x04\"^\n\x08pow2_pow\x12\x30\n\x05input\x18\x01 \x02(\x0b\x32!.hive.protocol.buffers.pow2_input\x12 \n\x0bpow_summary\x18\x02 \x02(\rR\x0bpow_summary\"D\n\x0e\x65quihash_proof\x12\t\n\x01n\x18\x01 \x02(\r\x12\t\n\x01k\x18\x02 \x02(\r\x12\x0c\n\x04seed\x18\x03 \x02(\t\x12\x0e\n\x06inputs\x18\x04 \x03(\r\"\xb8\x01\n\x0c\x65quihash_pow\x12\x30\n\x05input\x18\x01 \x02(\x0b\x32!.hive.protocol.buffers.pow2_input\x12\x34\n\x05proof\x18\x02 \x02(\x0b\x32%.hive.protocol.buffers.equihash_proof\x12\x1e\n\nprev_block\x18\x03 \x02(\tR\nprev_block\x12 \n\x0bpow_summary\x18\x04 \x02(\rR\x0bpow_summary\"\x90\x01\n\tpow2_work\x12/\n\x04pow2\x18\x01 \x01(\x0b\x32\x1f.hive.protocol.buffers.pow2_powH\x00\x12I\n\x0c\x65quihash_pow\x18\x02 \x01(\x0b\x32#.hive.protocol.buffers.equihash_powH\x00R\x0c\x65quihash_powB\x07\n\x05value\"\x9b\x01\n\x04pow2\x12.\n\x04work\x18\x01 \x02(\x0b\x32 .hive.protocol.buffers.pow2_work\x12$\n\rnew_owner_key\x18\x02 \x01(\tR\rnew_owner_key\x12=\n\x05props\x18\x03 \x02(\x0b\x32..hive.protocol.buffers.legacy_chain_properties')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'pow2_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_POW2_INPUT']._serialized_start=68
  _globals['_POW2_INPUT']._serialized_end=167
  _globals['_POW2_POW']._serialized_start=169
  _globals['_POW2_POW']._serialized_end=263
  _globals['_EQUIHASH_PROOF']._serialized_start=265
  _globals['_EQUIHASH_PROOF']._serialized_end=333
  _globals['_EQUIHASH_POW']._serialized_start=336
  _globals['_EQUIHASH_POW']._serialized_end=520
  _globals['_POW2_WORK']._serialized_start=523
  _globals['_POW2_WORK']._serialized_end=667
  _globals['_POW2']._serialized_start=670
  _globals['_POW2']._serialized_end=825
# @@protoc_insertion_point(module_scope)
