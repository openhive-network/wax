//! Builders for the recurrent-transfer operation: defining or updating a
//! recurring transfer and removing one.

use crate::core::proto;

use crate::WaxError;
use crate::base::foundation::WaxFoundation;
use crate::base::models::asset::{AssetName, NaiAssetConvertible};
use crate::base::models::basic::AccountName;
use crate::base::operation::OperationBuilder;

const DEFAULT_RECURRENCE_HOURS: u32 = 24;
const DEFAULT_EXECUTIONS: u32 = 2;

/// Coerces `amount` to HIVE or HBD, mirroring TS's multi-symbol
/// `createAssetWithRequiredSymbol([HBD, HIVE], …)`.
fn coerce_hive_or_hbd(
    foundation: &dyn WaxFoundation,
    amount: NaiAssetConvertible,
) -> Result<proto::Asset, WaxError> {
    // Try HIVE first to match the dominant case; fall through to HBD if the
    // caller supplied HBD instead. Either symbol is valid for recurrent
    // transfers per the protocol spec.
    let try_hive = foundation
        .create_asset_with_required_symbol(AssetName::Hive, amount.clone());
    match try_hive {
        Ok(asset) => Ok(asset),
        Err(_) => {
            foundation.create_asset_with_required_symbol(AssetName::Hbd, amount)
        }
    }
}

fn build_extensions(
    pair_id: Option<u32>,
) -> Vec<proto::RecurrentTransferExtension> {
    match pair_id {
        Some(pair_id) if pair_id != 0 => vec![proto::RecurrentTransferExtension {
            value: Some(
                proto::recurrent_transfer_extension::Value::RecurrentTransferPairId(
                    proto::RecurrentTransferPairId { pair_id },
                ),
            ),
        }],
        _ => Vec::new(),
    }
}

/// Represents the builder for the define / update flavour of a recurrent
/// transfer.
///
/// TS NOTE: mirrors `DefineRecurrentTransferOperation`
/// (`complex_operations/recurrent_transfer.ts`).
#[derive(Debug, Clone)]
pub struct DefineRecurrentTransferOperation {
    pub from_account: AccountName,
    pub to_account: AccountName,
    pub amount: NaiAssetConvertible,
    pub memo: Option<String>,
    pub recurrence: Option<u32>,
    pub executions: Option<u32>,
    pub pair_id: Option<u32>,
}

impl OperationBuilder for DefineRecurrentTransferOperation {
    fn finalize(
        self: Box<Self>,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = *self;
        let amount = coerce_hive_or_hbd(foundation, this.amount)?;
        if amount.amount == "0" {
            return Err(WaxError::new("Amount must be greater than 0"));
        }

        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::RecurrentTransferOperation(
                proto::RecurrentTransfer {
                    from_account: this.from_account,
                    to_account: this.to_account,
                    amount,
                    memo: this.memo.unwrap_or_default(),
                    recurrence: this
                        .recurrence
                        .unwrap_or(DEFAULT_RECURRENCE_HOURS),
                    executions: this.executions.unwrap_or(DEFAULT_EXECUTIONS),
                    extensions: build_extensions(this.pair_id),
                },
            )),
        }])
    }
}

/// Represents the builder for the removal flavour of a recurrent transfer (a
/// zero-amount HIVE transfer).
///
/// TS NOTE: mirrors `RecurrentTransferRemovalOperation`.
#[derive(Debug, Clone)]
pub struct RecurrentTransferRemovalOperation {
    pub from_account: AccountName,
    pub to_account: AccountName,
    pub pair_id: Option<u32>,
}

impl OperationBuilder for RecurrentTransferRemovalOperation {
    fn finalize(
        self: Box<Self>,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = *self;
        // TS defaults to `{ ...ASSETS.HIVE, amount: "0" }` when the amount is
        // undefined; the symbol parser handles HIVE-zero cleanly.
        let amount = foundation.hive_satoshis(0)?;

        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::RecurrentTransferOperation(
                proto::RecurrentTransfer {
                    from_account: this.from_account,
                    to_account: this.to_account,
                    amount,
                    memo: String::new(),
                    recurrence: DEFAULT_RECURRENCE_HOURS,
                    executions: DEFAULT_EXECUTIONS,
                    extensions: build_extensions(this.pair_id),
                },
            )),
        }])
    }
}
