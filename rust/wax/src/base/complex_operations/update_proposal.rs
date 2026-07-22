//! Builder for the update-proposal operation.

use crate::core::proto;

use crate::WaxError;
use crate::base::foundation::WaxFoundation;
use crate::base::models::asset::{AssetName, NaiAssetConvertible};
use crate::base::models::basic::AccountName;
use crate::base::models::hive_date_time::HiveDateTime;
use crate::base::operation::ComplexOperation;

/// Represents the builder for the update-proposal operation.
///
/// `daily_pay` is coerced to HBD at finalize-time, so passing the wrong asset
/// surfaces as a `WaxError` from the foundation rather than panicking when the
/// proto op is pushed onto a transaction.
#[derive(Debug, Clone, Default)]
pub struct UpdateProposalOperation {
    pub proposal_id: i64,
    pub creator: AccountName,
    pub daily_pay: NaiAssetConvertible,
    pub subject: String,
    pub permlink: String,
    pub end_date: Option<HiveDateTime>,
}

impl ComplexOperation for UpdateProposalOperation {
    fn finalize(
        self,
        foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = self;
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
