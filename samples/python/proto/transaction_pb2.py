# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: transaction.proto
"""Generated protocol buffer code."""
from google.protobuf import descriptor as _descriptor
from google.protobuf import descriptor_pool as _descriptor_pool
from google.protobuf import symbol_database as _symbol_database
from google.protobuf.internal import builder as _builder
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import comment_pb2 as comment__pb2
import vote_pb2 as vote__pb2
import limit_order_cancel_pb2 as limit__order__cancel__pb2
import recurrent_transfer_pb2 as recurrent__transfer__pb2


DESCRIPTOR = _descriptor_pool.Default().AddSerializedFile(b'\n\x11transaction.proto\x12\x15hive.protocol.buffers\x1a\rcomment.proto\x1a\nvote.proto\x1a\x18limit_order_cancel.proto\x1a\x18recurrent_transfer.proto\"\xae\x02\n\toperation\x12\x31\n\x07\x63omment\x18\x0f \x01(\x0b\x32\x1e.hive.protocol.buffers.commentH\x00\x12+\n\x04vote\x18\x10 \x01(\x0b\x32\x1b.hive.protocol.buffers.voteH\x00\x12[\n\x12limit_order_cancel\x18\x11 \x01(\x0b\x32).hive.protocol.buffers.limit_order_cancelH\x00R\x12limit_order_cancel\x12[\n\x12recurrent_transfer\x18\x12 \x01(\x0b\x32).hive.protocol.buffers.recurrent_transferH\x00R\x12recurrent_transferB\x07\n\x05value\"C\n\x0btransaction\x12\x34\n\noperations\x18\x12 \x03(\x0b\x32 .hive.protocol.buffers.operation')

_globals = globals()
_builder.BuildMessageAndEnumDescriptors(DESCRIPTOR, _globals)
_builder.BuildTopDescriptorsAndMessages(DESCRIPTOR, 'transaction_pb2', _globals)
if _descriptor._USE_C_DESCRIPTORS == False:

  DESCRIPTOR._options = None
  _globals['_OPERATION']._serialized_start=124
  _globals['_OPERATION']._serialized_end=426
  _globals['_TRANSACTION']._serialized_start=428
  _globals['_TRANSACTION']._serialized_end=495
# @@protoc_insertion_point(module_scope)
