use wax::RustOperation;


pub trait RustTransactionApi {
    fn push_operation(self, op: RustOperation) -> Self;
}
