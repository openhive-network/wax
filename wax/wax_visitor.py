from abc import ABC, abstractmethod

from wax.proto import comment_pb2, limit_order_cancel_pb2, vote_pb2
from wax.proto.transaction_pb2 import operation


class OperationVisitor(ABC):
    def accept(self, operation: operation):
        target_operation_name = operation.WhichOneof("value")
        if hasattr(self, target_operation_name):
            method = getattr(self, target_operation_name)
            target_operation = getattr(operation, target_operation_name)
            method(target_operation)

    @abstractmethod
    def limit_order_cancel(self, op: limit_order_cancel_pb2.limit_order_cancel):
        pass

    @abstractmethod
    def vote(self, op: vote_pb2.vote):
        pass

    @abstractmethod
    def comment(self, op: comment_pb2):
        pass
        pass
