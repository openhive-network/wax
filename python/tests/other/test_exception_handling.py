from __future__ import annotations

import pytest

import wax

def test_exception_handling() -> None:
  ex_type = None
  ex_args = ()
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
    print (ex_type)
    ex_args = inst.args
    print (ex_args)
    ex_what = str(inst)
    print(ex_what) # call __str__

  assert ex_type == RuntimeError
  assert ex_args == ('Hello, my exception!',)
  assert ex_what == 'Hello, my exception!'
