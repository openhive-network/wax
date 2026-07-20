//! The operation type: wire-form access, validation and impacted-account
//! queries, plus the complex-operation trait producing operations.

use crate::core::{RustOperation, proto};

use crate::WaxError;
use crate::base::foundation::WaxFoundation;
use crate::base::internal::protocol::rust_protocol;
use crate::base::models::basic::AccountName;

/// Represents a single protocol operation: read access to its wire-form
/// state, validation and impacted-account queries. Created by the
/// `create_operation*` factories on [`WaxFoundation`].
pub struct Operation {
    pub(crate) inner: RustOperation,
}

impl Operation {
    pub(crate) fn from_rust(inner: RustOperation) -> Self {
        Self { inner }
    }

    /// Returns the underlying [`proto::Operation`] mirror.
    pub fn proto(&self) -> &proto::Operation {
        self.inner.proto()
    }

    /// Validates the operation against the protocol rules.
    pub fn validate(&self) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_op_validate(&self.inner.handle)
            .map_err(WaxError::from)
    }

    /// Returns the accounts impacted by the operation.
    pub fn impacted_accounts(&self) -> Result<Vec<AccountName>, WaxError> {
        rust_protocol()
            .cpp_op_impacted_accounts(&self.inner.handle)
            .map_err(WaxError::from)
    }
}

/// Provides construction of one or more operations from higher-level inputs.
pub trait ComplexOperation {
    /// Consume the complex operation and emit the wire-form operations it
    /// represents.
    fn finalize(
        self,
        foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError>;
}
