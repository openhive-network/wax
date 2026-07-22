//! Shared fixture for the encryption test suites — Rust port of
//! `ts/wasm/__tests__/assets/data.encryption-operations.ts`: the
//! `utilFunctionTest` driver plus the operation fixtures used by
//! `encrypted_operations.rs` and `non_encrypted_operations.rs`.

use wax::Transaction;
use wax::proto::{self, operation::Value as OperationValue};

use wax_signers_beekeeper::BeekeeperSignatureProvider;

use crate::common::{WaxTestCtx, new_in_memory_beekeeper};

// Keys pinned by the TS fixture: the encryption key pair, the optional second
// recipient and the signing key.
const ENCRYPTION_WIF: &str =
    "5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT";
const OTHER_ENCRYPTION_WIF: &str =
    "5KXNQP5feaaXpp28yRrGaFeNYZT7Vrb1PqLEyo7E3pJiG1veLKG";
const SIGNING_WIF: &str = "5KGKYWMXReJewfj5M29APNMqGEu173DzvHv5TeJAg9SkjUeQV78";

const TAPOS: &str = "04c507a8c7fe5be96be64ce7c86855e1806cbde3";
const EXPIRATION: &str = "2023-11-09T21:51:27";

const MEMO_KEY: &str = "STM8GC13uCZbP44HzMLV6zPZGwVQ8Nt4Kji8PapsPiNq1BK153XTX";

/// Drives the shared encryption round trip of the TS `utilFunctionTest`:
/// build a TAPOS transaction, open an encryption range (one or two recipient
/// keys), let `lambda` push operations (and open/close further ranges),
/// close the last range, encrypt + sign, optionally assert which operations
/// ended up encrypted, then decrypt and return the resulting proto
/// transaction.
///
/// TS NOTE: TS folds the encryption pass into `signer.signTransaction`; Rust
/// keeps `perform_operation_encryption` and `sign` as two explicit steps (see
/// `hive_base.rs`). The TS `EncryptionVisitor` check runs `accept` per
/// operation with a lambda asserting the `#` ciphertext prefix; here
/// [`encryptable_data`] extracts the same memo-style field the visitor
/// touches and [`assert_encryption_state`] applies the identical prefix
/// checks.
pub fn util_function_test(
    ctx: &WaxTestCtx,
    lambda: impl FnOnce(&mut Transaction, &[String]),
    non_encrypted_operation_indices: &[usize],
    other_encryption_key: bool,
) -> proto::Transaction {
    let bk = new_in_memory_beekeeper();
    let created = bk.session.create_wallet("w0", "pw").expect("create_wallet");
    let mut wallet = created.wallet;
    let key = wallet.import_key(ENCRYPTION_WIF).expect("import_key");

    let mut tx = ctx
        .base
        .create_transaction_with_tapos(TAPOS, EXPIRATION)
        .expect("create_transaction_with_tapos");

    let mut encryption_keys = vec![key];
    if other_encryption_key {
        encryption_keys.push(
            wallet
                .import_key(OTHER_ENCRYPTION_WIF)
                .expect("import_key other"),
        );
    }

    tx.start_encrypt(
        &encryption_keys[0],
        encryption_keys.get(1).map(String::as_str),
    );
    lambda(&mut tx, &encryption_keys);
    tx.stop_encrypt().expect("stop_encrypt");

    let signing_key =
        wallet.import_key(SIGNING_WIF).expect("import_key signing");
    let provider = BeekeeperSignatureProvider::new(wallet);
    tx.perform_operation_encryption(&provider)
        .expect("perform_operation_encryption");
    tx.sign(&provider, &signing_key).expect("sign");

    if !non_encrypted_operation_indices.is_empty() {
        assert_encryption_state(&tx, non_encrypted_operation_indices);
    }

    tx.decrypt(&provider).expect("decrypt");

    tx.transaction().clone()
}

/// Asserts that every operation carrying an encryptable field is encrypted
/// (`#`-prefixed ciphertext) unless its index is listed in `non_encrypted`.
/// Operations without an encryptable field are skipped, mirroring the TS
/// `EncryptionVisitor` never invoking its callback for them.
fn assert_encryption_state(tx: &Transaction, non_encrypted: &[usize]) {
    for (index, op) in tx.transaction().operations.iter().enumerate() {
        let Some(data) = encryptable_data(op) else {
            continue;
        };
        let should_be_encrypted = !non_encrypted.contains(&index);

        assert_eq!(
            data.starts_with('#'),
            should_be_encrypted,
            "operation #{index}: unexpected encryption state for data {data:?}",
        );
    }
}

/// Returns the memo-style field the encryption pass touches on `op`, if the
/// operation type supports encryption. For `custom_json_operation` the
/// ciphertext lives inside the `{"encrypted": "..."}` envelope.
fn encryptable_data(op: &proto::Operation) -> Option<String> {
    match op.value.as_ref()? {
        OperationValue::TransferOperation(t) => Some(t.memo.clone()),
        OperationValue::TransferToSavingsOperation(t) => Some(t.memo.clone()),
        OperationValue::TransferFromSavingsOperation(t) => Some(t.memo.clone()),
        OperationValue::RecurrentTransferOperation(t) => Some(t.memo.clone()),
        OperationValue::CommentOperation(c) => Some(c.body.clone()),
        OperationValue::CustomJsonOperation(c) => {
            let envelope: Option<String> = serde_json::from_str(&c.json)
                .ok()
                .and_then(|parsed: serde_json::Value| {
                    parsed
                        .get("encrypted")
                        .and_then(serde_json::Value::as_str)
                        .map(str::to_string)
                });

            envelope.or_else(|| Some(c.json.clone()))
        }
        _ => None,
    }
}

// ---------------------------------------------------------------------------
// Assets and authorities
// ---------------------------------------------------------------------------

fn asset(amount: &str, precision: u32, nai: &str) -> proto::Asset {
    proto::Asset {
        amount: amount.into(),
        precision,
        nai: nai.into(),
    }
}

fn hive(amount: &str) -> proto::Asset {
    asset(amount, 3, "@@000000021")
}

fn hbd(amount: &str) -> proto::Asset {
    asset(amount, 3, "@@000000013")
}

fn vests(amount: &str) -> proto::Asset {
    asset(amount, 6, "@@000000037")
}

fn empty_authority() -> proto::Authority {
    proto::Authority {
        weight_threshold: 1,
        account_auths: Default::default(),
        key_auths: Default::default(),
    }
}

// ---------------------------------------------------------------------------
// Operation fixtures (TS export order)
// ---------------------------------------------------------------------------

pub fn comment_op() -> OperationValue {
    OperationValue::CommentOperation(proto::Comment {
        parent_author: "gtg".into(),
        parent_permlink: "test-comment".into(),
        author: "gtg".into(),
        permlink: "test-comment-2".into(),
        title: "Test comment".into(),
        body: "Test comment body".into(),
        json_metadata: "{}".into(),
    })
}

pub fn transfer_op() -> OperationValue {
    OperationValue::TransferOperation(proto::Transfer {
        from_account: "gtg".into(),
        to_account: "initminer".into(),
        amount: hive("100"),
        memo: "This should be encrypted".into(),
    })
}

pub fn custom_json_op() -> OperationValue {
    OperationValue::CustomJsonOperation(proto::CustomJson {
        required_auths: vec!["gtg".into()],
        required_posting_auths: vec!["gtg".into()],
        id: "custom_json".into(),
        json: "{}".into(),
    })
}

pub fn transfer_to_savings_op() -> OperationValue {
    OperationValue::TransferToSavingsOperation(proto::TransferToSavings {
        from_account: "gtg".into(),
        to_account: "savings".into(),
        amount: hive("100"),
        memo: "This should be encrypted".into(),
    })
}

pub fn transfer_from_savings_op() -> OperationValue {
    OperationValue::TransferFromSavingsOperation(proto::TransferFromSavings {
        from_account: "savings".into(),
        request_id: 1,
        to_account: "gtg".into(),
        amount: hive("100"),
        memo: "This should be encrypted".into(),
    })
}

pub fn recurrent_transfer_op() -> OperationValue {
    OperationValue::RecurrentTransferOperation(proto::RecurrentTransfer {
        from_account: "gtg".into(),
        to_account: "initminer".into(),
        amount: hive("100"),
        memo: "This should be encrypted".into(),
        recurrence: 24,
        executions: 2,
        extensions: Vec::new(),
    })
}

pub fn vote_op() -> OperationValue {
    OperationValue::VoteOperation(proto::Vote {
        voter: "gtg".into(),
        author: "initminer".into(),
        permlink: "test-permlink".into(),
        weight: 100,
    })
}

pub fn convert_op() -> OperationValue {
    OperationValue::ConvertOperation(proto::Convert {
        owner: "gtg".into(),
        requestid: 1,
        amount: hbd("100"),
    })
}

pub fn transfer_to_vesting_op() -> OperationValue {
    OperationValue::TransferToVestingOperation(proto::TransferToVesting {
        from_account: "gtg".into(),
        to_account: "initminer".into(),
        amount: hive("100"),
    })
}

pub fn withdraw_vesting_op() -> OperationValue {
    OperationValue::WithdrawVestingOperation(proto::WithdrawVesting {
        account: "gtg".into(),
        vesting_shares: vests("100"),
    })
}

pub fn limit_order_create_op() -> OperationValue {
    OperationValue::LimitOrderCreateOperation(proto::LimitOrderCreate {
        owner: "gtg".into(),
        orderid: 1,
        amount_to_sell: hive("100"),
        min_to_receive: hbd("50"),
        fill_or_kill: false,
        expiration: "2023-11-09T21:51:27".into(),
    })
}

pub fn limit_order_cancel_op() -> OperationValue {
    OperationValue::LimitOrderCancelOperation(proto::LimitOrderCancel {
        owner: "gtg".into(),
        orderid: 1,
    })
}

pub fn feed_publish_op() -> OperationValue {
    OperationValue::FeedPublishOperation(proto::FeedPublish {
        publisher: "gtg".into(),
        exchange_rate: proto::Price {
            base: hive("100"),
            quote: hbd("50"),
        },
    })
}

pub fn account_create_op() -> OperationValue {
    OperationValue::AccountCreateOperation(proto::AccountCreate {
        fee: hive("100"),
        creator: "gtg".into(),
        new_account_name: "initminer".into(),
        owner: empty_authority(),
        active: empty_authority(),
        posting: empty_authority(),
        memo_key: MEMO_KEY.into(),
        json_metadata: "{}".into(),
    })
}

pub fn account_update_op() -> OperationValue {
    OperationValue::AccountUpdateOperation(proto::AccountUpdate {
        account: "gtg".into(),
        owner: Some(empty_authority()),
        active: Some(empty_authority()),
        posting: Some(empty_authority()),
        memo_key: MEMO_KEY.into(),
        json_metadata: "{}".into(),
    })
}

pub fn account_witness_vote_op() -> OperationValue {
    OperationValue::AccountWitnessVoteOperation(proto::AccountWitnessVote {
        account: "gtg".into(),
        witness: "initminer".into(),
        approve: true,
    })
}

pub fn account_witness_proxy_op() -> OperationValue {
    OperationValue::AccountWitnessProxyOperation(proto::AccountWitnessProxy {
        account: "gtg".into(),
        proxy: "initminer".into(),
    })
}

pub fn witness_block_approve_op() -> OperationValue {
    OperationValue::WitnessBlockApproveOperation(proto::WitnessBlockApprove {
        witness: "initminer".into(),
        block_id: "1".into(),
    })
}

pub fn delete_comment_op() -> OperationValue {
    OperationValue::DeleteCommentOperation(proto::DeleteComment {
        author: "gtg".into(),
        permlink: "test-permlink".into(),
    })
}

pub fn comment_options_op() -> OperationValue {
    OperationValue::CommentOptionsOperation(proto::CommentOptions {
        author: "gtg".into(),
        permlink: "test-permlink".into(),
        max_accepted_payout: hbd("100"),
        percent_hbd: 10,
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: Vec::new(),
    })
}

pub fn set_withdraw_vesting_route_op() -> OperationValue {
    OperationValue::SetWithdrawVestingRouteOperation(
        proto::SetWithdrawVestingRoute {
            from_account: "gtg".into(),
            to_account: "initminer".into(),
            percent: 10,
            auto_vest: true,
        },
    )
}

pub fn limit_order_create2_op() -> OperationValue {
    OperationValue::LimitOrderCreate2Operation(proto::LimitOrderCreate2 {
        owner: "gtg".into(),
        orderid: 1,
        amount_to_sell: hive("100"),
        fill_or_kill: false,
        exchange_rate: proto::Price {
            base: hive("100"),
            quote: hbd("50"),
        },
        expiration: "2023-11-09T21:51:27".into(),
    })
}

pub fn claim_account_op() -> OperationValue {
    OperationValue::ClaimAccountOperation(proto::ClaimAccount {
        creator: "gtg".into(),
        fee: hive("100"),
        extensions: Vec::new(),
    })
}

pub fn create_claimed_account_op() -> OperationValue {
    OperationValue::CreateClaimedAccountOperation(proto::CreateClaimedAccount {
        creator: "gtg".into(),
        new_account_name: "initminer".into(),
        owner: empty_authority(),
        active: empty_authority(),
        posting: empty_authority(),
        memo_key: MEMO_KEY.into(),
        json_metadata: "{}".into(),
        extensions: Vec::new(),
    })
}

pub fn request_account_recovery_op() -> OperationValue {
    OperationValue::RequestAccountRecoveryOperation(
        proto::RequestAccountRecovery {
            recovery_account: "gtg".into(),
            account_to_recover: "initminer".into(),
            new_owner_authority: empty_authority(),
            extensions: Vec::new(),
        },
    )
}

pub fn change_recovery_account_op() -> OperationValue {
    OperationValue::ChangeRecoveryAccountOperation(
        proto::ChangeRecoveryAccount {
            account_to_recover: "gtg".into(),
            new_recovery_account: "initminer".into(),
            extensions: Vec::new(),
        },
    )
}

pub fn escrow_transfer_op() -> OperationValue {
    OperationValue::EscrowTransferOperation(proto::EscrowTransfer {
        from_account: "initminer".into(),
        to_account: "gtg".into(),
        agent: "blocktrades".into(),
        escrow_id: 100,
        hbd_amount: hbd("100"),
        hive_amount: hive("100"),
        fee: hive("100"),
        ratification_deadline: "2023-11-09T21:51:20".into(),
        escrow_expiration: "2023-11-09T21:51:27".into(),
        json_meta: "{}".into(),
    })
}

pub fn escrow_dispute_op() -> OperationValue {
    OperationValue::EscrowDisputeOperation(proto::EscrowDispute {
        from_account: "initminer".into(),
        to_account: "gtg".into(),
        agent: "blocktrades".into(),
        who: "gtg".into(),
        escrow_id: 100,
    })
}

pub fn escrow_release_op() -> OperationValue {
    OperationValue::EscrowReleaseOperation(proto::EscrowRelease {
        from_account: "initminer".into(),
        to_account: "gtg".into(),
        agent: "gtg".into(),
        who: "gtg".into(),
        receiver: "gtg".into(),
        escrow_id: 100,
        hbd_amount: hbd("100"),
        hive_amount: hive("100"),
    })
}

pub fn escrow_approve_op() -> OperationValue {
    OperationValue::EscrowApproveOperation(proto::EscrowApprove {
        from_account: "initminer".into(),
        to_account: "gtg".into(),
        agent: "gtg".into(),
        who: "gtg".into(),
        escrow_id: 100,
        approve: true,
    })
}

pub fn cancel_transfer_from_savings_op() -> OperationValue {
    OperationValue::CancelTransferFromSavingsOperation(
        proto::CancelTransferFromSavings {
            from_account: "gtg".into(),
            request_id: 1,
        },
    )
}

pub fn decline_voting_rights_op() -> OperationValue {
    OperationValue::DeclineVotingRightsOperation(proto::DeclineVotingRights {
        account: "gtg".into(),
        decline: true,
    })
}

pub fn claim_reward_balance_op() -> OperationValue {
    OperationValue::ClaimRewardBalanceOperation(proto::ClaimRewardBalance {
        account: "gtg".into(),
        reward_hive: hive("100"),
        reward_hbd: hbd("100"),
        reward_vests: vests("100"),
    })
}

pub fn delegate_vesting_shares_op() -> OperationValue {
    OperationValue::DelegateVestingSharesOperation(
        proto::DelegateVestingShares {
            delegator: "gtg".into(),
            delegatee: "initminer".into(),
            vesting_shares: vests("100"),
        },
    )
}

pub fn account_create_with_delegation_op() -> OperationValue {
    OperationValue::AccountCreateWithDelegationOperation(
        proto::AccountCreateWithDelegation {
            fee: hive("100"),
            delegation: vests("50"),
            creator: "gtg".into(),
            new_account_name: "initminer".into(),
            owner: empty_authority(),
            active: empty_authority(),
            posting: empty_authority(),
            memo_key: MEMO_KEY.into(),
            json_metadata: "{}".into(),
            extensions: Vec::new(),
        },
    )
}

pub fn account_update2_op() -> OperationValue {
    OperationValue::AccountUpdate2Operation(proto::AccountUpdate2 {
        account: "gtg".into(),
        owner: Some(empty_authority()),
        active: Some(empty_authority()),
        posting: Some(empty_authority()),
        memo_key: Some(MEMO_KEY.into()),
        json_metadata: "{}".into(),
        posting_json_metadata: "{}".into(),
        extensions: Vec::new(),
    })
}

pub fn create_proposal_op() -> OperationValue {
    OperationValue::CreateProposalOperation(proto::CreateProposal {
        creator: "initminer".into(),
        receiver: "gtg".into(),
        start_date: "2023-11-09T21:51:27".into(),
        end_date: "2023-11-10T21:51:27".into(),
        daily_pay: hbd("100"),
        subject: "Test subject".into(),
        permlink: "test-permlink".into(),
        extensions: Vec::new(),
    })
}

pub fn update_proposal_votes_op() -> OperationValue {
    OperationValue::UpdateProposalVotesOperation(proto::UpdateProposalVotes {
        voter: "gtg".into(),
        proposal_ids: vec![1],
        approve: true,
        extensions: Vec::new(),
    })
}

pub fn remove_proposal_op() -> OperationValue {
    OperationValue::RemoveProposalOperation(proto::RemoveProposal {
        proposal_owner: "initminer".into(),
        proposal_ids: vec![1],
        extensions: Vec::new(),
    })
}

pub fn update_proposal_op() -> OperationValue {
    OperationValue::UpdateProposalOperation(proto::UpdateProposal {
        proposal_id: 1,
        creator: "initminer".into(),
        daily_pay: hbd("100"),
        subject: "Test subject".into(),
        permlink: "test-permlink".into(),
        extensions: Vec::new(),
    })
}

pub fn collateralized_convert_op() -> OperationValue {
    OperationValue::CollateralizedConvertOperation(
        proto::CollateralizedConvert {
            owner: "gtg".into(),
            requestid: 1,
            amount: hive("100"),
        },
    )
}
