from abc import ABC, abstractmethod

from wax.proto import comment_pb2, limit_order_cancel_pb2, vote_pb2


class OperationVisitor(ABC):
    def accept(self, operation):
        operation_name = operation.WhichOneof("value")
        if hasattr(self, operation_name):
            method = getattr(self, operation_name)
            method(operation)

    @abstractmethod
    def limit_order_cancel(self, op : limit_order_cancel_pb2.limit_order_cancel):
        pass

    @abstractmethod
    def vote(self, op : vote_pb2.vote):
        pass

    @abstractmethod
    def comment(self, op : comment_pb2):
        pass
    

class MyOperationVisitor(OperationVisitor):
  def limit_order_cancel(self, op : limit_order_cancel_pb2.limit_order_cancel):
      print(f"Handling limit_order_cancel operation: {op}")

  def vote(self, op : vote_pb2.vote) -> None:
      print(f"Handling vote operation: {op}")

  def comment(self, op : comment_pb2.comment) -> None:
      print(f"Handling comment operation: {op}")