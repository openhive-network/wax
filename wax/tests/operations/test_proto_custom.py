# custom_operation={
#   "type": "custom_operation",
#   "value": {
#     "required_auths": [
#       "bytemaster"
#     ],
#     "id": 777,
#     "data": "0a627974656d617374657207737465656d697402a3d13897d82114466ad87a74b73a53292d8331d1bd1d3082da6bfbcff19ed097029db013797711c88cccca3692407f9ff9b9ce7221aaa2d797f1692be2215d0a5f6d2a8cab6832050078bc5729201e3ea24ea9f7873e6dbdc65a6bd9899053b9acda876dc69f11a13df9ca8b26b6"
#   }
# }

from utils.checkers import check_operations

from wax.proto import custom_pb2, transaction_pb2


def test_custom():
    custom: custom_pb2.custom = custom_pb2.custom(
        required_auths=["bytemaster"],
        id=777,
        data="0a627974656d617374657207737465656d697402a3d13897d82114466ad87a74b73a53292d8331d1bd1d3082da6bfbcff19ed097029db013797711c88cccca3692407f9ff9b9ce7221aaa2d797f1692be2215d0a5f6d2a8cab6832050078bc5729201e3ea24ea9f7873e6dbdc65a6bd9899053b9acda876dc69f11a13df9ca8b26b6",
    )

    custom_operation: transaction_pb2.operation = transaction_pb2.operation(
        custom=custom
    )
    check_operations(custom_operation)
