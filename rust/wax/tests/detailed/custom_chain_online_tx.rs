// Rust port of `ts/wasm/__tests__/detailed/custom_chain_online_tx.ts`.
//
// Like the TS suite, these tests run against live chains:
// - mainnet (the default endpoint) for the read-only trace tests replaying
//   pinned historical transactions, and
// - the public mirrornet (`api.fake.openhive.network`, chain id `42`) for
//   everything that signs or broadcasts, using the well-known mirrornet
//   skeleton key.
//
// TS NOTE: scripted-wire coverage of the same surface lives in
// `online_transaction.rs`. The TS multisig collected-data and root-entries
// tests share one source transaction and are merged into a single test here.

use std::collections::HashSet;
use std::time::{SystemTime, UNIX_EPOCH};

use wax::api::{FindAccountsRequest, GetWitnessScheduleRequest};
use wax::proto::{self, operation::Value as OperationValue};
use wax::{
    AuthorityEntryProcessingStatus, AuthorityPathEntry, HiveChain,
    HiveChainOptions, ProcessedEntry, create_hive_chain,
    create_wax_foundation,
};

use wax_signers_beekeeper::BeekeeperSignatureProvider;

use crate::common::new_in_memory_beekeeper;

const MIRRORNET_API_ENDPOINT: &str = "https://api.fake.openhive.network/";
const MIRRORNET_CHAIN_ID: &str = "42";

/// The well-known mirrornet skeleton key every mirrored account signs with.
const MIRRORNET_SKELETON_KEY: &str =
    "5JNHfZYKGaomSFvd4NUdQ9qMcEAC43kujbfjueTHpVapX1Kzq2n";
const MIRRORNET_SKELETON_PUBLIC_KEY: &str =
    "STM6LLegbAgLAy28EHrffBVuANFWcFgmqRMW13wBmTExqFE9SCkg4";
const AUTHTRACETST1_OWNER_PUBLIC_KEY: &str =
    "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX";

const ACCOUNT_CREATOR: &str = "xbtsio";

// Mainnet tx a7efc7be69861fdcdc39712e532beb8ddc701f03 — five votes, each
// signed by a different account.
const MULTISIG_TX_JSON: &str = r#"{"ref_block_num":808,"ref_block_prefix":1359279161,"extensions":[],"expiration":"2024-08-02T12:09:03","operations":[{"type":"vote_operation","value":{"voter":"ecency","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"ecency.stats","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteem.app","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"good-karma","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteemapp","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}}],"signatures":["1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726","20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f","20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1","2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a","205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5"]}"#;

// The same transaction with the last signature (ecency's) truncated by two
// bytes, so its recovered key matches nothing on chain.
const MULTISIG_TX_BROKEN_SIG_JSON: &str = r#"{"ref_block_num":808,"ref_block_prefix":1359279161,"extensions":[],"expiration":"2024-08-02T12:09:03","operations":[{"type":"vote_operation","value":{"voter":"ecency","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"ecency.stats","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteem.app","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"good-karma","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}},{"type":"vote_operation","value":{"voter":"esteemapp","author":"el-panal","weight":100,"permlink":"el-panal-presentacion-de-autores-destacados-dia31072024"}}],"signatures":["1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726","20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f","20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1","2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a","205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365"]}"#;

// (voter, signature key recovered from the tx, matching signature) — in the
// sorted required-authority order the trace reports.
const MULTISIG_SIGNERS: [(&str, &str, &str); 5] = [
    (
        "ecency",
        "STM8AZuk2ja5vSFySFL2zpB9bNew8wJAg8r4QFtbnoamEX8Jvvq43",
        "205f0e25631bdbcd37669b2f6c36594d0153e468be8b2b6a57f8eae49538132efd0dde1ad6a707788d6a2024efd03a55dd0bb478a40eedce48f6e5db19d365bce5",
    ),
    (
        "ecency.stats",
        "STM8jviUDRAefxmTQ9m8wNdiQV5dmCPSMDjSnztPYZpHf1yfaD6Rd",
        "20223edff229382e67031d993c13d26062ab4d33c45ede7aced7f1e432d6b6d57a4fd68eae708f562a9644ee08ea447fa354febe34aa8ba14a434c66adc753774f",
    ),
    (
        "esteem.app",
        "STM64Bb5TXsiEbjjLsgVrvVttEDsLNSot9p8zJd41D5zEr5opxcHK",
        "20286bd3b0ad2ecb01488ce866361b4fcd53b1f3dac41962496986fdf89c89c20a0e86f8dd2669ed14b6dafc3e0bb0d24ec54a794ee6c0b563275a22a122992ac1",
    ),
    (
        "esteemapp",
        "STM7S3wsVtQotgKLN8wFLPNBALe6YHt8MPLEHuTH5CxfxdhpGPBUP",
        "1f4141e7645dd2bdcdb2001baea165e668a6f9c2a366f6fd2f3e9d878f071f5eb052509eb666b80c1e0daaa7fdec36e3de827087dcd3015c8672b536ddddbc5726",
    ),
    (
        "good-karma",
        "STM5dhkPS223F9d3TCXKttuWpdWgqS2Fx8KNRQve6BMGmAvJ5GnJR",
        "2043b5ea9cbf76f1cd0fbb5f589350d9b8273d241c8bb704189bc9fd4444493c384594536e0387ff121bcdbfa4fa401917e30609ac86ea82f13132d26280e74f9a",
    ),
];

// Mainnet tx da9602787693edccdafa1e7325502e0bb14453d1 — a single transfer.
const TRANSFER_TX_JSON: &str = r#"{"ref_block_num":33561,"ref_block_prefix":2922397352,"extensions":[],"expiration":"2024-09-20T12:16:45","operations":[{"type":"transfer_operation","value":{"to":"bluehy20","from":"splinterboost","memo":"Thank you for delegating to Splinterboost here is your daily HIVE payout!","amount":{"nai":"@@000000021","amount":"14","precision":3}}}],"signatures":["203eed491a1e032bc889b030861a80bf3f0bc8ba7fa30843041825c4f542411fb3678fd527c598dcc6646a5dabf2110691a4d6355c72d7638ffdaa11ac10451d07"]}"#;

// The transfer signature key recovered under legacy (pre-HF26)
// serialization.
const TRANSFER_TX_LEGACY_KEY: &str =
    "STM7jDAdjyLYgqhyCwSafVzNGN4PLBGWrYB9uJun4AitZA8TERgif";

// Mainnet vote whose signer key sits two account-authority redirections
// deep: tattooworld -> leofinance -> steemauto -> key.
const DELEGATED_VOTE_TX_JSON: &str = r#"{"ref_block_num":31682,"ref_block_prefix":1691585842,"extensions":[],"expiration":"2024-10-01T20:10:59","operations":[{"type":"vote_operation","value":{"voter":"tattooworld","author":"mamaemigrante","weight":10000,"permlink":"buscando-ollas-nuevas-para-mi-cocina-looking-for-new-pots-and-pans-for-my-kitchen"}}],"signatures":["20543c6e9e5ea2acfb94e9c5cd6672f302d067b62a4c71832dcaec7caf5e83a83b45ae76c55e3f51f8eb254b460a0585e7f911a93d6e5a58522429b7a4678dc22e"]}"#;

// Mainnet vote with a single redirection level: sunnyvo -> steemauto -> key.
const SINGLE_NEST_VOTE_TX_JSON: &str = r#"{"ref_block_num":59824,"ref_block_prefix":3761625792,"extensions":[],"expiration":"2024-12-12T12:30:00","operations":[{"type":"vote_operation","value":{"voter":"sunnyvo","author":"franciscomarval","weight":475,"permlink":"alegoria-sirenida-mermaid-allegory"}}],"signatures":["20282d87e22cad745d263ee43fe8552044ecb68ebd274a03421d6e59aaaa891d5a594808c58605828c240b9e498f53d32a8f4f7baec5bfcbc7d391af4e4283366e"]}"#;

// The `steemauto` posting key both delegated-sign transactions resolve to.
const STEEMAUTO_POSTING_KEY: &str =
    "STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF";

// Mainnet comment by `temp` — an open-authority account — with no
// signatures at all.
const OPEN_AUTHORITY_TX_JSON: &str = r#"{"ref_block_num":35292,"ref_block_prefix":2546881088,"extensions":[],"expiration":"2024-07-27T20:43:36","operations":[{"type":"comment_operation","value":{"body":"With no response, we have no recourse but to release the source code to exploit this will be publicly released on Sunday July 28, 2024.","title":"","author":"temp","permlink":"37","json_metadata":"","parent_author":"hive-engine","parent_permlink":"market-smart-contract-23"}}],"signatures":[]}"#;

fn mainnet_chain() -> HiveChain {
    create_hive_chain(HiveChainOptions::default()).unwrap()
}

fn mirrornet_chain() -> HiveChain {
    create_hive_chain(HiveChainOptions {
        api_endpoint: MIRRORNET_API_ENDPOINT.to_string(),
        chain_id: MIRRORNET_CHAIN_ID.to_string(),
        ..Default::default()
    })
    .unwrap()
}

#[tokio::test]
async fn authority_trace_for_direct_multisig_from_existing_transaction() {
    let chain = mainnet_chain();

    // The tx comes from mainnet, so signature keys must be recovered under
    // the default (mainnet) chain id.
    let source = create_wax_foundation(None)
        .create_transaction_from_json(MULTISIG_TX_JSON)
        .unwrap();

    let tx = chain.create_transaction(None).await.unwrap();
    let trace = tx
        .generate_authority_verification_trace(false, Some(&source))
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Accepted {
            is_open_authority: false
        })
    ));
    assert_eq!(trace.collected_data.len(), 5);
    assert_eq!(trace.root_entries.len(), 5);

    for (data, (name, key, signature)) in
        trace.collected_data.iter().zip(&MULTISIG_SIGNERS)
    {
        let path = &data.final_authority_path;
        assert!(is_account(path, name));
        assert_eq!(path.processed_role, "posting");
        assert_eq!(
            (path.threshold, path.weight, path.recursion_depth),
            (1, 1, 0)
        );
        assert!(is_accepted(path));
        assert_eq!(path.visited_entries.len(), 1);
        assert!(is_key(&path.visited_entries[0], key));

        assert_eq!(data.matching_signatures.len(), 1);
        assert_eq!(data.matching_signatures[0].signature_key, *key);
        assert_eq!(data.matching_signatures[0].signature, *signature);
    }

    // TS NOTE: covers the separate TS root-entries test — for a fully
    // satisfied multisig the root entries mirror the collected paths.
    for (entry, (name, key, _)) in
        trace.root_entries.iter().zip(&MULTISIG_SIGNERS)
    {
        assert!(is_account(entry, name));
        assert!(is_accepted(entry));
        assert!(is_key(&entry.visited_entries[0], key));
    }
}

/// Similar tx to mainnet da9602787693edccdafa1e7325502e0bb14453d1, rebuilt
/// and signed on the mirrornet, where every account signs with the skeleton
/// key.
#[tokio::test]
async fn authority_trace_for_direct_sign() {
    let chain = mirrornet_chain();

    let mut bk = new_in_memory_beekeeper();
    let created = bk
        .api
        .session(&bk.token)
        .create_wallet("w0", Some("pw"), Some(true))
        .expect("create_wallet");
    let mut wallet = created.wallet;
    let public_key =
        wallet.import_key(MIRRORNET_SKELETON_KEY).expect("import_key");

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer(
        "splinterboost",
        "bluehy20",
        chain.hive_satoshis(14).unwrap(),
        "Thank you for delegating to Splinterboost here is your daily HIVE \
         payout!",
    )));

    let provider = BeekeeperSignatureProvider::new(wallet);
    let signature = tx.sign(&provider, &public_key).expect("sign");

    let trace = tx
        .generate_authority_verification_trace(false, None)
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Accepted {
            is_open_authority: false
        })
    ));

    assert_eq!(trace.collected_data.len(), 1);
    let data = &trace.collected_data[0];
    let path = &data.final_authority_path;
    assert!(is_account(path, "splinterboost"));
    assert_eq!(path.processed_role, "active");
    assert_eq!((path.threshold, path.weight), (1, 1));
    assert!(is_key(&path.visited_entries[0], MIRRORNET_SKELETON_PUBLIC_KEY));

    // TS NOTE: TS fakes the ever-changing signature before comparing; Rust
    // has the produced signature in scope and compares it directly.
    assert_eq!(data.matching_signatures.len(), 1);
    assert_eq!(
        data.matching_signatures[0].signature_key,
        MIRRORNET_SKELETON_PUBLIC_KEY
    );
    assert_eq!(data.matching_signatures[0].signature, signature);
}

#[tokio::test]
async fn authority_trace_for_direct_sign_from_existing_transaction() {
    let chain = mainnet_chain();

    let source = create_wax_foundation(None)
        .create_transaction_from_json(TRANSFER_TX_JSON)
        .unwrap();

    let tx = chain.create_transaction(None).await.unwrap();
    let trace = tx
        .generate_authority_verification_trace(true, Some(&source))
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Accepted {
            is_open_authority: false
        })
    ));

    assert_eq!(trace.collected_data.len(), 1);
    let data = &trace.collected_data[0];
    let path = &data.final_authority_path;
    assert!(is_account(path, "splinterboost"));
    assert_eq!(path.processed_role, "active");
    assert!(is_key(&path.visited_entries[0], TRANSFER_TX_LEGACY_KEY));

    assert_eq!(data.matching_signatures.len(), 1);
    assert_eq!(
        data.matching_signatures[0].signature_key,
        TRANSFER_TX_LEGACY_KEY
    );
    assert_eq!(
        data.matching_signatures[0].signature,
        source.transaction().signatures[0]
    );
}

#[tokio::test]
async fn authority_trace_for_delegated_sign() {
    let chain = mainnet_chain();

    let source = create_wax_foundation(None)
        .create_transaction_from_json(DELEGATED_VOTE_TX_JSON)
        .unwrap();

    let tx = chain.create_transaction(None).await.unwrap();
    let trace = tx
        .generate_authority_verification_trace(false, Some(&source))
        .await
        .unwrap();

    assert_eq!(trace.collected_data.len(), 1);
    let data = &trace.collected_data[0];
    assert_eq!(data.matching_signatures.len(), 1);
    assert_eq!(
        data.matching_signatures[0].signature_key,
        STEEMAUTO_POSTING_KEY
    );
    assert_eq!(
        data.matching_signatures[0].signature,
        source.transaction().signatures[0]
    );

    // The accepted path descends both redirection levels; the key leaf
    // shares the depth of the account that declares it.
    let root = &data.final_authority_path;
    assert!(is_account(root, "tattooworld"));
    assert_eq!(root.recursion_depth, 0);
    let leofinance = &root.visited_entries[0];
    assert!(is_account(leofinance, "leofinance"));
    assert_eq!(leofinance.recursion_depth, 1);
    let steemauto = &leofinance.visited_entries[0];
    assert!(is_account(steemauto, "steemauto"));
    assert_eq!(steemauto.recursion_depth, 2);
    let key = &steemauto.visited_entries[0];
    assert!(is_key(key, STEEMAUTO_POSTING_KEY));
    assert_eq!(key.recursion_depth, 2);
    assert!(key.visited_entries.is_empty());

    for entry in [root, leofinance, steemauto, key] {
        assert!(is_accepted(entry));
        assert_eq!(entry.processed_role, "posting");
        assert_eq!((entry.threshold, entry.weight), (1, 1));
    }
}

#[tokio::test]
async fn authority_trace_for_delegated_sign_with_single_nest_level() {
    let chain = mainnet_chain();

    let source = create_wax_foundation(None)
        .create_transaction_from_json(SINGLE_NEST_VOTE_TX_JSON)
        .unwrap();

    let tx = chain.create_transaction(None).await.unwrap();
    let trace = tx
        .generate_authority_verification_trace(false, Some(&source))
        .await
        .unwrap();

    assert_eq!(trace.collected_data.len(), 1);
    let data = &trace.collected_data[0];
    assert_eq!(
        data.matching_signatures[0].signature_key,
        STEEMAUTO_POSTING_KEY
    );

    let root = &data.final_authority_path;
    assert!(is_account(root, "sunnyvo"));
    assert_eq!(root.recursion_depth, 0);
    let steemauto = &root.visited_entries[0];
    assert!(is_account(steemauto, "steemauto"));
    assert_eq!(steemauto.recursion_depth, 1);
    let key = &steemauto.visited_entries[0];
    assert!(is_key(key, STEEMAUTO_POSTING_KEY));
    assert_eq!(key.recursion_depth, 1);

    for entry in [root, steemauto, key] {
        assert!(is_accepted(entry));
        assert_eq!((entry.threshold, entry.weight), (1, 1));
    }
}

#[tokio::test]
async fn authority_trace_for_open_authority_transaction() {
    let chain = mainnet_chain();

    let source = create_wax_foundation(None)
        .create_transaction_from_json(OPEN_AUTHORITY_TX_JSON)
        .unwrap();

    let tx = chain.create_transaction(None).await.unwrap();
    let trace = tx
        .generate_authority_verification_trace(false, Some(&source))
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Accepted {
            is_open_authority: true
        })
    ));

    assert_eq!(trace.collected_data.len(), 1);
    let data = &trace.collected_data[0];
    assert!(data.matching_signatures.is_empty());

    let path = &data.final_authority_path;
    assert!(is_account(path, "temp"));
    assert_eq!(path.processed_role, "posting");
    assert_eq!((path.threshold, path.weight), (0, 0));
    assert!(path.visited_entries.is_empty());
    assert!(matches!(
        path.processing_status,
        AuthorityEntryProcessingStatus::Accepted {
            is_open_authority: true
        }
    ));
}

/// See `ts/wasm/__tests__/assets/authority_trace_test_accounts.md`.
///
/// Authority graph:
///
///   authtracetst1  active  (threshold = 2)
///     +-- account_auth: authtracetst2  weight 1  -->  active (threshold 1)
///     |     +-- key_auth: skeleton key  weight 1  ** matches signature **
///     +-- account_auth: authtracetst3  weight 1  -->  active (threshold 1)
///           +-- account_auth: authtracetst1  weight 1  ** CYCLE **
///
///   Accumulated weight = 1 < threshold 2  -->  INSUFFICIENT WEIGHT
///   Owner fallback also fails (different key).
#[tokio::test]
async fn authority_trace_for_insufficient_weight_transaction() {
    let chain = mirrornet_chain();

    let mut bk = new_in_memory_beekeeper();
    let created = bk
        .api
        .session(&bk.token)
        .create_wallet("w0", Some("pw"), Some(true))
        .expect("create_wallet");
    let mut wallet = created.wallet;
    let public_key =
        wallet.import_key(MIRRORNET_SKELETON_KEY).expect("import_key");
    let provider = BeekeeperSignatureProvider::new(wallet);

    // Ensure test accounts exist with the correct authority structure.
    ensure_test_accounts_exist(&chain, &provider).await;

    // Build and sign a transfer from authtracetst1 (requires active
    // authority, threshold = 2).
    let mut source_tx = chain.create_transaction(None).await.unwrap();
    source_tx.push_operation(chain.create_operation(transfer(
        "authtracetst1",
        "authtracetst2",
        chain.hive_satoshis(1).unwrap(),
        "Authority trace test",
    )));
    source_tx.sign(&provider, &public_key).expect("sign");
    let source = source_tx.into_transaction();

    // Generate the trace using a separate online transaction.
    let tx = chain.create_transaction(None).await.unwrap();
    let trace = tx
        .generate_authority_verification_trace(false, Some(&source))
        .await
        .unwrap();

    assert!(matches!(
        trace.verification_status,
        Some(AuthorityEntryProcessingStatus::Rejected {
            has_insufficient_weight: true,
            has_matching_public_key: false,
            has_account_authority_cycle: false,
            ..
        })
    ));

    // Active is tried first, then the owner fallback.
    assert_eq!(trace.root_entries.len(), 2);

    let active = &trace.root_entries[0];
    assert!(is_account(active, "authtracetst1"));
    assert_eq!(active.processed_role, "active");
    assert_eq!((active.threshold, active.weight), (2, 1));
    assert!(matches!(
        active.processing_status,
        AuthorityEntryProcessingStatus::Rejected {
            has_insufficient_weight: true,
            ..
        }
    ));

    let [tst2, tst3] = active.visited_entries.as_slice() else {
        panic!("expected the two delegated account entries");
    };

    assert!(is_account(tst2, "authtracetst2"));
    assert!(is_accepted(tst2));
    assert_eq!(tst2.weight, 1);
    assert!(is_key(&tst2.visited_entries[0], &public_key));

    assert!(is_account(tst3, "authtracetst3"));
    assert_eq!(tst3.weight, 0);
    let cycled = &tst3.visited_entries[0];
    assert!(is_account(cycled, "authtracetst1"));
    assert_eq!(cycled.recursion_depth, 2);
    assert!(matches!(
        cycled.processing_status,
        AuthorityEntryProcessingStatus::Rejected {
            has_account_authority_cycle: true,
            account_authority_processing_depth_exceeded: true,
            ..
        }
    ));

    let owner = &trace.root_entries[1];
    assert!(is_account(owner, "authtracetst1"));
    assert_eq!(owner.processed_role, "owner");
    assert_eq!(owner.weight, 0);
    assert!(owner.visited_entries.is_empty());

    // The failed owner fallback is the collected path.
    assert_eq!(trace.collected_data.len(), 1);
    assert!(trace.collected_data[0].matching_signatures.is_empty());
    assert_eq!(
        trace.collected_data[0].final_authority_path.processed_role,
        "owner"
    );
}

#[tokio::test]
async fn authority_trace_root_entries_for_multisig_with_broken_signature() {
    let chain = mainnet_chain();

    let source = create_wax_foundation(None)
        .create_transaction_from_json(MULTISIG_TX_BROKEN_SIG_JSON)
        .unwrap();

    let tx = chain.create_transaction(None).await.unwrap();
    let trace = tx
        .generate_authority_verification_trace(false, Some(&source))
        .await
        .unwrap();

    // ecency's signature no longer recovers its posting key, so it falls
    // through posting (descending its real account-authority redirections),
    // active and owner; the other four voters stay satisfied.
    assert_eq!(trace.root_entries.len(), 7);

    let ecency_roles: Vec<&str> = trace
        .root_entries
        .iter()
        .filter(|entry| is_account(entry, "ecency"))
        .map(|entry| entry.processed_role.as_str())
        .collect();
    assert_eq!(ecency_roles, ["posting", "active", "owner"]);

    for entry in &trace.root_entries {
        if is_account(entry, "ecency") {
            assert!(matches!(
                entry.processing_status,
                AuthorityEntryProcessingStatus::Rejected {
                    has_insufficient_weight: true,
                    has_matching_public_key: false,
                    ..
                }
            ));
            assert_eq!(entry.weight, 0);
        } else {
            assert!(is_accepted(entry));
        }
    }

    // The rejected posting path descends ecency's on-chain redirection
    // chain: ecency -> ecency.app -> hivesigner.
    let posting = &trace.root_entries[0];
    let app = &posting.visited_entries[0];
    assert!(is_account(app, "ecency.app"));
    assert_eq!(app.recursion_depth, 1);
    let signer = &app.visited_entries[0];
    assert!(is_account(signer, "hivesigner"));
    assert_eq!(signer.recursion_depth, 2);
}

#[tokio::test]
async fn catches_private_key_leak_during_explicit_online_validation() {
    let error = tx_security_leak_error(false).await;
    assert_leak_error(&error);
}

#[tokio::test]
async fn catches_private_key_leak_during_direct_broadcast() {
    let error = tx_security_leak_error(true).await;
    assert_leak_error(&error);
}

#[tokio::test]
async fn create_account_and_transfer_to_it_in_one_transaction() {
    let chain = mirrornet_chain();

    let mut bk = new_in_memory_beekeeper();
    let created = bk
        .api
        .session(&bk.token)
        .create_wallet("w0", Some("pw"), Some(true))
        .expect("create_wallet");
    let mut wallet = created.wallet;
    let public_key =
        wallet.import_key(MIRRORNET_SKELETON_KEY).expect("import_key");

    let fee = chain
        .api()
        .database_api
        .get_witness_schedule(GetWitnessScheduleRequest {})
        .await
        .expect("get_witness_schedule")
        .median_props
        .account_creation_fee;

    let account_name = random_account_name();

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(
        OperationValue::AccountCreateOperation(proto::AccountCreate {
            fee,
            creator: ACCOUNT_CREATOR.into(),
            new_account_name: account_name.clone(),
            owner: key_authority(&public_key),
            active: key_authority(&public_key),
            posting: key_authority(&public_key),
            memo_key: public_key.clone(),
            json_metadata: "".into(),
        }),
    ))
    .push_operation(chain.create_operation(transfer(
        ACCOUNT_CREATOR,
        &account_name,
        chain.hive_satoshis(1).unwrap(),
        "",
    )));

    let provider = BeekeeperSignatureProvider::new(wallet);
    tx.sign(&provider, &public_key).expect("sign");

    // TS NOTE: like TS, no real broadcast — proper mirrornet preconfig is
    // still missing; on-chain verification passing is sufficient.
    tx.perform_on_chain_verification().await.unwrap();
}

#[tokio::test]
async fn create_and_sign_transaction_using_online_interface() {
    let chain = mirrornet_chain();

    let mut bk = new_in_memory_beekeeper();
    let created = bk
        .api
        .session(&bk.token)
        .create_wallet("w0", Some("pw"), Some(true))
        .expect("create_wallet");
    let mut wallet = created.wallet;
    let public_key =
        wallet.import_key(MIRRORNET_SKELETON_KEY).expect("import_key");
    assert_eq!(public_key, MIRRORNET_SKELETON_PUBLIC_KEY);

    let mut tx = chain.create_transaction(None).await.unwrap();
    // TS NOTE: `protoVoteOp` from `data.proto-protocol.ts`.
    tx.push_operation(chain.create_operation(OperationValue::VoteOperation(
        proto::Vote {
            voter: "otom".into(),
            author: "c0ff33a".into(),
            permlink: "ewxhnjbj".into(),
            weight: 2200,
        },
    )));
    tx.validate().unwrap();

    tx.perform_on_chain_verification().await.unwrap();

    let provider = BeekeeperSignatureProvider::new(wallet);
    tx.sign(&provider, &public_key).expect("sign");

    assert_eq!(tx.signature_keys().unwrap(), vec![public_key]);
}

// ---------------------------------------------------------------------------
// Mirrornet preconfiguration
// ---------------------------------------------------------------------------

/// Self-contained preconfiguration that creates the `authtracetst*` test
/// accounts on demand — see the authority graph on
/// [`authority_trace_for_insufficient_weight_transaction`] and
/// `ts/wasm/__tests__/assets/authority_trace_test_accounts.md`.
async fn ensure_test_accounts_exist(
    chain: &HiveChain,
    signer: &BeekeeperSignatureProvider<'_>,
) {
    let account_names =
        ["authtracetst1", "authtracetst2", "authtracetst3"];

    let response = chain
        .api()
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: account_names.map(String::from).to_vec(),
            delayed_votes_active: Some(true),
        })
        .await
        .expect("find_accounts");
    let existing: HashSet<&str> = response
        .accounts
        .iter()
        .map(|account| account.name.as_str())
        .collect();

    if existing.len() != account_names.len() {
        println!(
            "Creating test accounts ({}/{} exist)...",
            existing.len(),
            account_names.len()
        );

        let fee = chain
            .api()
            .database_api
            .get_witness_schedule(GetWitnessScheduleRequest {})
            .await
            .expect("get_witness_schedule")
            .median_props
            .account_creation_fee;

        // Steps 1 + 2: authtracetst2 (holds the signing key) and
        // authtracetst3 start with plain skeleton-key authorities; the cycle
        // is added in step 4.
        for name in ["authtracetst2", "authtracetst3"] {
            if existing.contains(name) {
                continue;
            }

            broadcast_signed(chain, signer, chain.create_operation(
                OperationValue::AccountCreateOperation(proto::AccountCreate {
                    fee: fee.clone(),
                    creator: ACCOUNT_CREATOR.into(),
                    new_account_name: name.into(),
                    owner: key_authority(MIRRORNET_SKELETON_PUBLIC_KEY),
                    active: key_authority(MIRRORNET_SKELETON_PUBLIC_KEY),
                    posting: key_authority(MIRRORNET_SKELETON_PUBLIC_KEY),
                    memo_key: MIRRORNET_SKELETON_PUBLIC_KEY.into(),
                    json_metadata: "{}".into(),
                }),
            ))
            .await;
            println!("Created account: {name}");
        }

        // Step 3: authtracetst1 — active delegates to authtracetst2 +
        // authtracetst3, owner uses a different key.
        if !existing.contains("authtracetst1") {
            broadcast_signed(chain, signer, chain.create_operation(
                OperationValue::AccountCreateOperation(proto::AccountCreate {
                    fee: fee.clone(),
                    creator: ACCOUNT_CREATOR.into(),
                    new_account_name: "authtracetst1".into(),
                    owner: key_authority(AUTHTRACETST1_OWNER_PUBLIC_KEY),
                    active: account_authority(
                        2,
                        &[("authtracetst2", 1), ("authtracetst3", 1)],
                    ),
                    posting: key_authority(MIRRORNET_SKELETON_PUBLIC_KEY),
                    memo_key: MIRRORNET_SKELETON_PUBLIC_KEY.into(),
                    json_metadata: "{}".into(),
                }),
            ))
            .await;
            println!("Created account: authtracetst1");
        }
    }

    // Step 4: update authtracetst3's active authority to create the cycle
    // back to authtracetst1.
    let refreshed = chain
        .api()
        .database_api
        .find_accounts(FindAccountsRequest {
            accounts: vec!["authtracetst3".into()],
            delayed_votes_active: Some(true),
        })
        .await
        .expect("find_accounts");
    let needs_update = !refreshed.accounts[0]
        .active
        .account_auths
        .iter()
        .any(|(name, _)| name == "authtracetst1");

    if needs_update {
        broadcast_signed(chain, signer, chain.create_operation(
            OperationValue::AccountUpdateOperation(proto::AccountUpdate {
                account: "authtracetst3".into(),
                owner: None,
                active: Some(account_authority(1, &[("authtracetst1", 1)])),
                posting: Some(key_authority(MIRRORNET_SKELETON_PUBLIC_KEY)),
                memo_key: MIRRORNET_SKELETON_PUBLIC_KEY.into(),
                json_metadata: "{}".into(),
            }),
        ))
        .await;
        println!(
            "Updated authtracetst3 active authority: cycle to authtracetst1"
        );
    }
}

/// Builds a one-operation transaction, signs it with the skeleton key and
/// broadcasts it to the mirrornet.
async fn broadcast_signed(
    chain: &HiveChain,
    signer: &BeekeeperSignatureProvider<'_>,
    operation: wax::Operation,
) {
    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(operation);
    tx.sign(signer, MIRRORNET_SKELETON_PUBLIC_KEY).expect("sign");

    chain.broadcast(&tx).await.expect("broadcast");
}

// ---------------------------------------------------------------------------
// Fixtures and assertion helpers
// ---------------------------------------------------------------------------

/// Runs the TS `txSecurityLeakBody` scenario: a transfer whose memo leaks
/// the skeleton private key, caught either by the explicit on-chain
/// verification or by the pre-broadcast check.
async fn tx_security_leak_error(direct_broadcast: bool) -> String {
    let chain = mirrornet_chain();

    let mut tx = chain.create_transaction(None).await.unwrap();
    tx.push_operation(chain.create_operation(transfer(
        "otom",
        "otom",
        chain.hive_coins(1).unwrap(),
        MIRRORNET_SKELETON_KEY,
    )));

    let error = if direct_broadcast {
        chain.broadcast(&tx).await.unwrap_err()
    } else {
        tx.perform_on_chain_verification().await.unwrap_err()
    };

    error.to_string()
}

/// Asserts the leak-error payload the C++ core raises — the fields TS
/// exposes as `WaxPrivateKeyLeakDetectedException`.
fn assert_leak_error(error: &str) {
    assert!(
        error.contains("Detected private key leak."),
        "unexpected error: {error}"
    );
    assert!(error.contains("otom"), "unexpected account: {error}");
    assert!(error.contains("owner"), "unexpected authority role: {error}");
    assert!(
        error.contains(MIRRORNET_SKELETON_PUBLIC_KEY),
        "unexpected matching key: {error}"
    );
}

fn transfer(
    from: &str,
    to: &str,
    amount: proto::Asset,
    memo: &str,
) -> OperationValue {
    OperationValue::TransferOperation(proto::Transfer {
        from_account: from.into(),
        to_account: to.into(),
        amount,
        memo: memo.into(),
    })
}

fn key_authority(key: &str) -> proto::Authority {
    proto::Authority {
        weight_threshold: 1,
        account_auths: Default::default(),
        key_auths: [(key.to_string(), 1)].into_iter().collect(),
    }
}

fn account_authority(
    threshold: u32,
    auths: &[(&str, u32)],
) -> proto::Authority {
    proto::Authority {
        weight_threshold: threshold,
        account_auths: auths
            .iter()
            .map(|(name, weight)| (name.to_string(), *weight))
            .collect(),
        key_auths: Default::default(),
    }
}

/// A unique, valid account name for the create-account test.
///
/// TS NOTE: TS uses `Math.random`; the Rust port derives the suffix from the
/// current time (max name length is 16 characters).
fn random_account_name() -> String {
    let nanos = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos() as u64;

    format!("zz{:012x}", nanos & 0xffff_ffff_ffff)
}

fn is_account(entry: &AuthorityPathEntry, name: &str) -> bool {
    matches!(&entry.processed_entry, ProcessedEntry::Account(n) if n == name)
}

fn is_key(entry: &AuthorityPathEntry, key: &str) -> bool {
    matches!(&entry.processed_entry, ProcessedEntry::PublicKey(k) if k == key)
}

fn is_accepted(entry: &AuthorityPathEntry) -> bool {
    matches!(
        entry.processing_status,
        AuthorityEntryProcessingStatus::Accepted { .. }
    )
}
