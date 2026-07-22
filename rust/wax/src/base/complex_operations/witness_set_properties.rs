use crate::core::proto;

use crate::WaxError;
use crate::base::foundation::WaxFoundation;
use crate::base::models::asset::{AssetName, NaiAssetConvertible};
use crate::base::models::basic::{AccountName, PublicKey};
use crate::base::operation::ComplexOperation;
use crate::base::result::{JsonPrice, WitnessSetPropertiesProps};

/// Represents the base/quote pair for the witness HBD↔HIVE exchange rate.
/// `base` is the HBD-denominated side; `quote` is the HIVE-denominated side.
/// Both are coerced to their required symbols in `finalize` so callers can
/// pass any `NaiAssetConvertible` shape.
#[derive(Debug, Clone, Default)]
pub struct HbdExchangeRate {
    pub base: NaiAssetConvertible,
    pub quote: NaiAssetConvertible,
}

/// Represents the builder for the witness-set-properties operation.
///
/// Asset/price fields are coerced to their required symbols at `finalize`
/// time (HIVE for `account_creation_fee`, HBD/HIVE for `hbd_exchange_rate`)
/// so the wrong symbol surfaces as a `WaxError` rather than a wire-time
/// rejection by hived.
#[derive(Debug, Clone, Default)]
pub struct WitnessSetPropertiesOperation {
    pub owner: AccountName,
    /// Current witness signing key. Required — hived uses it to authorise
    /// the update.
    pub witness_signing_key: PublicKey,
    pub new_signing_key: Option<PublicKey>,
    pub account_creation_fee: Option<NaiAssetConvertible>,
    pub url: Option<String>,
    pub hbd_exchange_rate: Option<HbdExchangeRate>,
    pub maximum_block_size: Option<u32>,
    pub hbd_interest_rate: Option<u16>,
    pub account_subsidy_budget: Option<i32>,
    pub account_subsidy_decay: Option<u32>,
}

impl ComplexOperation for WitnessSetPropertiesOperation {
    fn finalize(
        self,
        foundation: &WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let this = self;
        let account_creation_fee = this
            .account_creation_fee
            .map(|fee| {
                foundation
                    .create_asset_with_required_symbol(AssetName::Hive, fee)
            })
            .transpose()?;

        let hbd_exchange_rate = this
            .hbd_exchange_rate
            .map(|rate| {
                let base = foundation.create_asset_with_required_symbol(
                    AssetName::Hbd,
                    rate.base,
                )?;
                let quote = foundation.create_asset_with_required_symbol(
                    AssetName::Hive,
                    rate.quote,
                )?;
                Ok::<JsonPrice, WaxError>(JsonPrice { base, quote })
            })
            .transpose()?;

        let props = WitnessSetPropertiesProps {
            key: this.witness_signing_key,
            new_signing_key: this.new_signing_key,
            account_creation_fee,
            url: this.url,
            hbd_exchange_rate,
            maximum_block_size: this.maximum_block_size,
            hbd_interest_rate: this.hbd_interest_rate,
            account_subsidy_budget: this.account_subsidy_budget,
            account_subsidy_decay: this.account_subsidy_decay,
        };

        let serialized_props = foundation.serialize_witness_props(&props)?;

        Ok(vec![proto::Operation {
            value: Some(
                proto::operation::Value::WitnessSetPropertiesOperation(
                    proto::WitnessSetProperties {
                        owner: this.owner,
                        props: serialized_props,
                        extensions: Vec::new(),
                    },
                ),
            ),
        }])
    }
}
