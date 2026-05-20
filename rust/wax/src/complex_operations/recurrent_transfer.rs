use wax_core::proto;

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::interfaces::OperationBuilder;
use crate::models::asset::{AssetName, NaiAssetConvertible};
use crate::models::basic::AccountName;

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
    let try_hive =
        foundation.create_asset_with_required_symbol(AssetName::Hive, amount.clone());
    match try_hive {
        Ok(asset) => Ok(asset),
        Err(_) => foundation.create_asset_with_required_symbol(AssetName::Hbd, amount),
    }
}

fn build_extensions(pair_id: Option<u32>) -> Vec<proto::RecurrentTransferExtension> {
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

/// Builder for the `define` / `update` flavour of recurrent transfer, mirroring
/// `DefineRecurrentTransferOperation` from
/// `ts/wasm/lib/detailed/complex_operations/recurrent_transfer.ts`.
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
        self,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let amount = coerce_hive_or_hbd(foundation, self.amount)?;
        if amount.amount == "0" {
            return Err(WaxError::new("Amount must be greater than 0"));
        }

        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::RecurrentTransferOperation(
                proto::RecurrentTransfer {
                    from_account: self.from_account,
                    to_account: self.to_account,
                    amount,
                    memo: self.memo.unwrap_or_default(),
                    recurrence: self.recurrence.unwrap_or(DEFAULT_RECURRENCE_HOURS),
                    executions: self.executions.unwrap_or(DEFAULT_EXECUTIONS),
                    extensions: build_extensions(self.pair_id),
                },
            )),
        }])
    }
}

/// Builder for the removal flavour of recurrent transfer (zero-amount HIVE).
/// Mirrors `RecurrentTransferRemovalOperation` from TS.
#[derive(Debug, Clone)]
pub struct RecurrentTransferRemovalOperation {
    pub from_account: AccountName,
    pub to_account: AccountName,
    pub pair_id: Option<u32>,
}

impl OperationBuilder for RecurrentTransferRemovalOperation {
    fn finalize(
        self,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        // TS defaults to `{ ...ASSETS.HIVE, amount: "0" }` when the amount is
        // undefined; the symbol parser handles HIVE-zero cleanly.
        let amount = foundation.hive_satoshis(0)?;

        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::RecurrentTransferOperation(
                proto::RecurrentTransfer {
                    from_account: self.from_account,
                    to_account: self.to_account,
                    amount,
                    memo: String::new(),
                    recurrence: DEFAULT_RECURRENCE_HOURS,
                    executions: DEFAULT_EXECUTIONS,
                    extensions: build_extensions(self.pair_id),
                },
            )),
        }])
    }
}
