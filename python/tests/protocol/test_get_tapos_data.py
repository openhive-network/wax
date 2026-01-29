from typing import Any, cast

from wax import get_tapos_data
from tests.utils.refs import API_REF_HF_BLOCK


def test_get_tapos_data() -> None:
    block_id = cast(str, API_REF_HF_BLOCK["previous"])
    transactions = cast(list[dict[str, Any]], API_REF_HF_BLOCK["transactions"])
    transaction = transactions[2]
    tapos = get_tapos_data(block_id=block_id.encode())
    assert tapos.ref_block_num == transaction["ref_block_num"]
    assert tapos.ref_block_prefix == transaction["ref_block_prefix"]
