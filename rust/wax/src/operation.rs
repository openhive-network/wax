pub struct RustOperation {
    kind: String,
    fields: Vec<(String, String)>,
}

impl RustOperation {
    pub fn new(kind: impl Into<String>, fields: Vec<(String, String)>) -> Self {
        Self {
            kind: kind.into(),
            fields,
        }
    }

    pub(crate) fn op_type(&self) -> String {
        self.kind.clone()
    }
    pub(crate) fn field_count(&self) -> usize {
        self.fields.len()
    }
    pub(crate) fn field_key_at(&self, idx: usize) -> String {
        self.fields[idx].0.clone()
    }
    pub(crate) fn field_value_at(&self, idx: usize) -> String {
        self.fields[idx].1.clone()
    }
}
