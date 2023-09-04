# distutils: language = c++
from functools import wraps

from libcpp.string cimport string

from wax cimport error_code, result, protocol
from .wax_result import python_result, python_error_code

def cpp_function(foo):
    @wraps(foo)
    def wrapper(*args, **kwargs):
        try:
            value, content, exception_message = foo(*args, **kwargs)
            return python_result(status=python_error_code(value), result=content, exception_message=exception_message)
        except Exception as ex:
            return python_result(value=0, content="", exception_message=str(ex))
    return wrapper

@cpp_function
def validate_operation(operation: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_validate_operation(operation)
    return response.value, response.content, response.exception_message

@cpp_function
def validate_transaction(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_validate_transaction(transaction)
    return response.value, response.content, response.exception_message

@cpp_function
def validate_proto_operation(operation: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_validate_proto_operation(operation)
    return response.value, response.content, response.exception_message

@cpp_function
def validate_proto_transaction(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_validate_proto_transaction(transaction)
    return response.value, response.content, response.exception_message

@cpp_function
def calculate_transaction_id(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_transaction_id(transaction)
    return response.value, response.content, response.exception_message

@cpp_function
def calculate_sig_digest(transaction: bytes, chain_id: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_sig_digest(transaction, chain_id)
    return response.value, response.content, response.exception_message

@cpp_function
def serialize_transaction(transaction: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_serialize_transaction(transaction)
    return response.value, response.content, response.exception_message

@cpp_function
def generate_private_key() -> python_result:
    cdef protocol obj
    response =  obj.cpp_generate_private_key()
    return response.value, response.content, response.exception_message

@cpp_function
def calculate_public_key(wif: bytes) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_public_key(wif)
    return response.value, response.content, response.exception_message

@cpp_function
def calculate_manabar_full_regeneration_time(now: int, max_mana: int, current_mana: int, last_update_time: int) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_manabar_full_regeneration_time( now, max_mana, current_mana, last_update_time )
    return response.value, response.content, response.exception_message

@cpp_function
def calculate_current_manabar_value(now: int, max_mana: int, current_mana: int, last_update_time: int) -> python_result:
    cdef protocol obj
    response = obj.cpp_calculate_current_manabar_value( now, max_mana, current_mana, last_update_time )
    return response.value, response.content, response.exception_message
