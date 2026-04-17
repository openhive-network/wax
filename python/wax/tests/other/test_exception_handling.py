from __future__ import annotations

import wax
from wax.exceptions import WaxAssertionError, WaxError


def test_exception_handling() -> None:
    ex_type: type[Exception] | None = None
    ex_args: tuple[str, ...] = ()
    ex_what = ""
    try:
        # 0 - pure throw crashes
        # 1 - string literal works (Unknown exception, no args)
        # 2 - std::string works (Unknown exception, no args)
        # 3 - std::exception works correctly, args are present
        # 4 - FC_ASSERT works (Unknown exception, no args)
        wax.verify_exception_handling(3)
    except Exception as inst:
        ex_type = type(inst)
        print(ex_type)
        ex_args = inst.args
        print(ex_args)
        ex_what = str(inst)
        print(ex_what)  # call __str__

    assert ex_type == WaxError
    assert ex_args == ("Hello, my exception!",)
    assert ex_what == "Hello, my exception!"


def test_exception_relay() -> None:
    ex_type: type[Exception] | None = None
    ex_args: str | tuple[object, ...] = ()
    ex_category = "Unknown"
    try:
        wax.cpp_throws(4)
    except WaxAssertionError as inst:
        ex_type = type(inst)
        ex_args = inst.assert_hash
        ex_category = inst.category
    except Exception as inst:
        ex_type = type(inst)
        ex_args = inst.args

    print(ex_type)
    print(ex_args)
    print(ex_category)

    assert ex_type is WaxAssertionError
    assert ex_args == "3372626016653902757"
    assert ex_category == "protocol"
