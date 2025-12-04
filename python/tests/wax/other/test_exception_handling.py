from __future__ import annotations

import pytest

import wax

from wax.exceptions import WaxError
from wax.exceptions.wax_specialised_errors import WaxChainAssertionError, WaxProtocolAssertionError, DetailedCxxError


def test_exception_handling() -> None:
    ex_type: type[Exception] | None = None
    ex_args: tuple[str, ...] = ()
    ex_what = ""
    # 0 - pure throw crashes
    # 1 - string literal works (Unknown exception, no args)
    # 2 - std::string works (Unknown exception, no args)
    # 3 - std::exception works correctly, args are present
    # 4 - FC_ASSERT works (Unknown exception, no args)
    with pytest.raises(WaxError, match="Hello, my exception!"):
        wax.verify_exception_handling(3)


def test_exception_relay() -> None:
    ex_type: type[Exception] | None = None
    ex_args: str | tuple[object, ...] = ()
    ex_source = "Unknown"
    try:
        wax.cpp_throws(4)
    except WaxChainAssertionError as inst:
        ex_source = "Chain"
        ex_type = type(inst)
        ex_args = inst.assert_hash
    except WaxProtocolAssertionError as inst:
        ex_source = "Protocol"
        ex_type = type(inst)
        ex_args = inst.assert_hash
    except DetailedCxxError as inst:
        ex_source = "unknown"
        ex_type = type(inst)
        ex_args = inst.assert_hash
    except Exception as inst:
        ex_type = type(inst)
        ex_args = inst.args

    print(ex_type)
    print(ex_args)
    print(ex_source)

    assert ex_type is WaxProtocolAssertionError
    assert ex_args == "3372626016653902757"
    assert ex_source == "Protocol"
