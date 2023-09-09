from abc import ABC, abstractmethod


class OperationVisitor(ABC):
    def accept(self, operation):
        operation_name = operation.WhichOneof("value")
        if hasattr(self, operation_name):
            method = getattr(self, operation_name)
            method(operation)

    @abstractmethod
    def limit_order_cancel(self, op):
        pass

    @abstractmethod
    def vote(self, op):
        pass

    @abstractmethod
    def comment(self, op):
        pass
    

class MyOperationVisitor(OperationVisitor):
  def limit_order_cancel(self, op):
      print(f"Handling limit_order_cancel operation: {op}")

  def vote(self, op):
      print(f"Handling vote operation: {op}")

  def comment(self, op):
      print(f"Handling comment operation: {op}")