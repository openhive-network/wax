from wax import get_proto_tapos_data
from utils.refs import PROTO_REF_HF_BLOCK

def test_get_proto_tapos_data():
    block_id = PROTO_REF_HF_BLOCK["previous"]
    transaction = PROTO_REF_HF_BLOCK["transactions"][2]
    tapos = get_proto_tapos_data(block_id.encode())
    assert tapos.ref_block_num == transaction["ref_block_num"]
    assert tapos.ref_block_prefix == transaction["ref_block_prefix"]
