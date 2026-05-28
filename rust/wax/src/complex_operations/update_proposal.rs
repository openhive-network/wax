//! Builder for the update-proposal operation.

use wax_core::proto;

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::interfaces::OperationBuilder;
use crate::models::asset::{AssetName, NaiAssetConvertible};
use crate::models::basic::{AccountName, HiveDateTime};

/// Represents the builder for the update-proposal operation.
///
/// `daily_pay` is coerced to HBD at finalize-time, so passing the wrong asset
/// surfaces as a `WaxError` from the foundation rather than panicking when the
/// proto op is pushed onto a transaction.
///
/// TS NOTE: mirrors `complex_operations/update_proposal.ts`.
#[derive(Debug, Clone)]
pub struct UpdateProposalOperation {
    pub proposal_id: i64,
    pub creator: AccountName,
    pub daily_pay: NaiAssetConvertible,
    pub subject: String,
    pub permlink: String,
    pub end_date: Option<HiveDateTime>,
}

impl OperationBuilder for UpdateProposalOperation {
    fn finalize(
        self: Box<Self>,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = *self;
        let daily_pay = foundation.create_asset_with_required_symbol(
            AssetName::Hbd,
            this.daily_pay,
        )?;

        let extensions = match this.end_date {
            Some(end_date) => vec![proto::UpdateProposalExtension {
                value: Some(
                    proto::update_proposal_extension::Value::UpdateProposalEndDate(
                        proto::UpdateProposalEndDate {
                            end_date: end_date.serialize(),
                        },
                    ),
                ),
            }],
            None => Vec::new(),
        };

        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::UpdateProposalOperation(
                proto::UpdateProposal {
                    proposal_id: this.proposal_id,
                    creator: this.creator,
                    daily_pay,
                    subject: this.subject,
                    permlink: this.permlink,
                    extensions,
                },
            )),
        }])
    }
}
