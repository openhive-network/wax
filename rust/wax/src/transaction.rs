pub struct RustTransaction {
    block_num: u32,
    block_prefix: u32,
    expiration_iso: String,
    ops: Vec<String>,
}

impl RustTransaction {
    pub fn new(
        block_num: u32,
        block_prefix: u32,
        expiration_iso: impl Into<String>,
        ops: Vec<String>,
    ) -> Self {
        Self {
            block_num,
            block_prefix,
            expiration_iso: expiration_iso.into(),
            ops,
        }
    }

    pub(crate) fn ref_block_num(&self) -> u32 {
        self.block_num
    }
    pub(crate) fn ref_block_prefix(&self) -> u32 {
        self.block_prefix
    }
    pub(crate) fn expiration(&self) -> String {
        self.expiration_iso.clone()
    }
    pub(crate) fn operation_count(&self) -> usize {
        self.ops.len()
    }
    pub(crate) fn operation_at(&self, idx: usize) -> String {
        self.ops[idx].clone()
    }
}
