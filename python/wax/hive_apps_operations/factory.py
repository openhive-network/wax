from abc import ABC, abstractmethod
from typing import List, TypeVar, Generic, Dict, Any, Iterable, Union, cast
import json

from wax import IWaxBaseInterface
from wax._private.operation_base import OperationBase, ConvertedToProtoOperation
from wax._private.proto.custom_json_pb2 import custom_json
from wax._private.proto.operation_pb2 import operation
from wax.exceptions import WaxError

TAccountName = str
ChildT = TypeVar('ChildT', bound='HiveAppsOperation')
BodyT = TypeVar('BodyT', bound=Dict[str, Any] | List[Any])

def stringify(obj: Any) -> str:
    def default(value):
        if isinstance(value, int) and abs(value) > (1 << 53):
            return str(value)
        return value
    return json.dumps(obj, default=default)


class HiveAppsOperation(OperationBase, Generic[ChildT, BodyT], ABC):
    def __init__(self) -> None:
        self.body: List[BodyT] = []
        self.ops: List[operation] = []

    @property
    @abstractmethod
    def id(self) -> str:
        ...

    def authorize(self, required_posting_auths: str | List[str], required_auths: List[str] = []) -> ChildT:
        if isinstance(required_posting_auths, str):
            posting_auths = [required_posting_auths]
        else:
            posting_auths = required_posting_auths

        if required_auths is not None:
            auths = required_auths
        else:
            auths = []

        if not posting_auths and not auths:
            raise WaxError("Missing authority")

        for body in self.body:
            custom_op = custom_json(
                id=self.id,
                json=stringify(body),
                required_auths=auths,
                required_posting_auths=posting_auths
            )

            op = operation()
            op.custom_json_operation.CopyFrom(custom_op)

            self.ops.append(op)

        self.body.clear()
        return cast(ChildT, self)

    def finalize(self, _sink: IWaxBaseInterface) -> Iterable[operation]:
        return self.ops