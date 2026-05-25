use wax_core::proto;

use crate::WaxError;
use crate::foundation::WaxFoundation;
use crate::interfaces::OperationBuilder;
use crate::models::asset::{AssetName, NaiAssetConvertible};
use crate::models::basic::{AccountName, PublicKey};
use crate::result::{JsonPrice, WitnessSetPropertiesProps};

/// Base + quote pair for the witness HBD↔HIVE exchange rate. `base` is the
/// HBD-denominated side; `quote` is the HIVE-denominated side. Both are
/// coerced to their required symbols in `finalize` so callers can pass any
/// `NaiAssetConvertible` shape.
#[derive(Debug, Clone)]
pub struct HbdExchangeRate {
    pub base: NaiAssetConvertible,
    pub quote: NaiAssetConvertible,
}

/// Builder mirroring `ts/wasm/lib/detailed/complex_operations/witness_set_properties.ts`
/// and `python/wax/wax/complex_operations/witness_set_properties.py`.
///
/// Asset/price fields are coerced to their required symbols at `finalize`
/// time (HIVE for `account_creation_fee`, HBD/HIVE for `hbd_exchange_rate`)
/// so the wrong symbol surfaces as a `WaxError` rather than a wire-time
/// rejection by hived.
#[derive(Debug, Clone)]
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

impl OperationBuilder for WitnessSetPropertiesOperation {
    fn finalize(
        self,
        foundation: &dyn WaxFoundation,
    ) -> Result<Vec<proto::Operation>, WaxError> {
        let account_creation_fee = self
            .account_creation_fee
            .map(|fee| foundation.create_asset_with_required_symbol(AssetName::Hive, fee))
            .transpose()?;

        let hbd_exchange_rate = self
            .hbd_exchange_rate
            .map(|rate| {
                let base =
                    foundation.create_asset_with_required_symbol(AssetName::Hbd, rate.base)?;
                let quote =
                    foundation.create_asset_with_required_symbol(AssetName::Hive, rate.quote)?;
                Ok::<JsonPrice, WaxError>(JsonPrice { base, quote })
            })
            .transpose()?;

        let props = WitnessSetPropertiesProps {
            key: self.witness_signing_key,
            new_signing_key: self.new_signing_key,
            account_creation_fee,
            url: self.url,
            hbd_exchange_rate,
            maximum_block_size: self.maximum_block_size,
            hbd_interest_rate: self.hbd_interest_rate,
            account_subsidy_budget: self.account_subsidy_budget,
            account_subsidy_decay: self.account_subsidy_decay,
        };

        let serialized_props = foundation.serialize_witness_props(&props)?;

        Ok(vec![proto::Operation {
            value: Some(proto::operation::Value::WitnessSetPropertiesOperation(
                proto::WitnessSetProperties {
                    owner: self.owner,
                    props: serialized_props,
                    extensions: Vec::new(),
                },
            )),
        }])
    }
}
