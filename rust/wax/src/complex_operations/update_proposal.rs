use wax_core::proto;

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::interfaces::OperationBuilder;
use crate::models::asset::{AssetName, NaiAssetConvertible};
use crate::models::basic::{AccountName, HiveDateTime};

/// Builder mirroring `ts/wasm/lib/detailed/complex_operations/update_proposal.ts`.
///
/// `daily_pay` is coerced to HBD at finalize-time, so passing the wrong asset
/// surfaces as `WaxError` from the foundation rather than panicking when the
/// proto op is pushed onto a transaction.
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
        self,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let daily_pay =
            foundation.create_asset_with_required_symbol(AssetName::Hbd, self.daily_pay)?;

        let extensions = match self.end_date {
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
                    proposal_id: self.proposal_id,
                    creator: self.creator,
                    daily_pay,
                    subject: self.subject,
                    permlink: self.permlink,
                    extensions,
                },
            )),
        }])
    }
}
