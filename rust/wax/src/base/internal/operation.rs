use crate::core::{RustOperation, proto};

use crate::WaxError;
use crate::base::interfaces::Operation;
use crate::base::internal::protocol::rust_protocol;
use crate::base::models::basic::AccountName;

impl Operation for RustOperation {
    fn proto(&self) -> &proto::Operation {
        RustOperation::proto(self)
    }

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
