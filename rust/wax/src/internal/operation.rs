use wax_core::RustOperation;

use crate::WaxError;
use crate::interfaces::Operation;
use crate::internal::protocol::rust_protocol;
use crate::models::basic::AccountName;

impl Operation for RustOperation {
    fn validate(&self) -> Result<(), WaxError> {
        rust_protocol()
            .cpp_op_validate(&self.handle)
            .map_err(WaxError::from)
    }

    fn impacted_accounts(&self) -> Result<Vec<AccountName>, WaxError> {
        rust_protocol()
            .cpp_op_impacted_accounts(&self.handle)
            .map_err(WaxError::from)
    }
}
