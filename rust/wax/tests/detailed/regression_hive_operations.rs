// Rust port of `ts/wasm/__tests__/detailed/regression_hive_operations.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// Every TS test follows one pattern: build a TAPOS transaction, push a raw
// proto operation, `validate()` the transaction, then `toStrictEqual` the
// operation read back from `transaction.operations[0]` against a second copy
// of the same literal. [`assert_pushed_unchanged`] asserts the identical
// invariant — push + C++ handle creation + validation leave the stored proto
// mirror equal to the input — by cloning the fixture instead of writing each
// literal twice.

use std::collections::HashMap;

use wax::Transaction;
use wax::proto::{self, operation::Value as OperationValue};

use crate::common::{WaxTestCtx, wax_test};

const TAPOS_BLOCK_ID: &str = "04c1c7a566fc0da66aee465714acee7346b48ac2";
const EXPIRATION: &str = "2023-08-01T15:38:48";

// Public keys pinned by the TS fixtures; reused across the authority-bearing
// operations below.
const KEY_A: &str = "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh";
const KEY_B: &str = "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fn tapos_tx(ctx: &WaxTestCtx) -> Transaction {
    ctx.base
        .create_transaction_with_tapos(TAPOS_BLOCK_ID, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

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

fn authority(
    weight_threshold: u32,
    account_auths: &[(&str, u32)],
    key_auths: &[(&str, u32)],
) -> proto::Authority {
    proto::Authority {
        weight_threshold,
        account_auths: account_auths
            .iter()
            .map(|(name, weight)| (name.to_string(), *weight))
            .collect(),
        key_auths: key_auths
            .iter()
            .map(|(key, weight)| (key.to_string(), *weight))
            .collect(),
    }
}

/// Pushes `value` into a fresh TAPOS transaction, validates the transaction
/// and asserts the operation stored on the proto mirror equals what was
/// pushed.
fn assert_pushed_unchanged(ctx: &WaxTestCtx, value: OperationValue) {
    let expected = proto::Operation {
        value: Some(value.clone()),
    };

    let mut tx = tapos_tx(ctx);
    tx.push_operation(ctx.base.create_operation(value));
    tx.validate().expect("validate");

    assert_eq!(tx.transaction().operations[0], expected);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

// TS line 55: "Vote opeartion Test".
#[test]
fn vote_operation() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::VoteOperation(proto::Vote {
                voter: "alice".into(),
                author: "bob".into(),
                permlink: "example-post".into(),
                weight: 10000,
            }),
        );
    });
}

// TS line 82: "Witness Update Test".
#[test]
fn witness_update() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::WitnessUpdateOperation(proto::WitnessUpdate {
                owner: "alice".into(),
                url: "https://alice.example.com".into(),
                block_signing_key: KEY_A.into(),
                props: proto::LegacyChainProperties {
                    account_creation_fee: hive("100000"),
                    maximum_block_size: 65536,
                    hbd_interest_rate: 1000,
                },
                fee: hive("0"),
            }),
        );
    });
}

// TS line 135: "Witness Set Properties Test".
#[test]
fn witness_set_properties() {
    wax_test(None, |ctx| {
        let props: HashMap<String, String> = [
            ("maximum_block_size", "00000100"),
            ("account_creation_fee", "88130000000000002320bcbe"),
            ("url", "0f68747470733a2f2f686976652e696f"),
            (
                "key",
                "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83",
            ),
        ]
        .into_iter()
        .map(|(key, value)| (key.to_string(), value.to_string()))
        .collect();

        assert_pushed_unchanged(
            ctx,
            OperationValue::WitnessSetPropertiesOperation(
                proto::WitnessSetProperties {
                    owner: "example-witness".into(),
                    props,
                    extensions: Vec::new(),
                },
            ),
        );
    });
}

// TS line 170: "Witness Block Aprove Test".
#[test]
fn witness_block_approve() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::WitnessBlockApproveOperation(
                proto::WitnessBlockApprove {
                    witness: "test-witness".into(),
                    block_id: "123456789".into(),
                },
            ),
        );
    });
}

// TS line 194: "Withdraw Vesting Test".
#[test]
fn withdraw_vesting() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::WithdrawVestingOperation(proto::WithdrawVesting {
                account: "user123".into(),
                vesting_shares: vests("100000000"),
            }),
        );
    });
}

// TS line 225: "Update Proposal Test".
#[test]
fn update_proposal() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::UpdateProposalOperation(proto::UpdateProposal {
                proposal_id: 123456789,
                creator: "creator-account".into(),
                daily_pay: hbd("100000"),
                subject: "Updated Proposal Subject".into(),
                permlink: "updated-proposal-permlink".into(),
                extensions: vec![proto::UpdateProposalExtension {
                    value: Some(
                        proto::update_proposal_extension::Value::UpdateProposalEndDate(
                            proto::UpdateProposalEndDate {
                                end_date: "2024-01-01T00:00:00".into(),
                            },
                        ),
                    ),
                }],
            }),
        );
    });
}

// TS line 272: "Update Proposal Votes Test".
#[test]
fn update_proposal_votes() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::UpdateProposalVotesOperation(
                proto::UpdateProposalVotes {
                    voter: "some-user".into(),
                    proposal_ids: vec![1001, 1002],
                    approve: true,
                    extensions: Vec::new(),
                },
            ),
        );
    });
}

// TS line 299: "Transfer Operation Test".
#[test]
fn transfer_operation() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::TransferOperation(proto::Transfer {
                from_account: "alice".into(),
                to_account: "bob".into(),
                amount: hive("100000"),
                memo: "Here's your payment".into(),
            }),
        );
    });
}

// TS line 334: "Transfer To Vesting Test".
#[test]
fn transfer_to_vesting() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::TransferToVestingOperation(
                proto::TransferToVesting {
                    from_account: "sender-account".into(),
                    to_account: "receiver-account".into(),
                    amount: hive("1000"),
                },
            ),
        );
    });
}

// TS line 367: "Transfer To Savings Test".
#[test]
fn transfer_to_savings() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::TransferToSavingsOperation(
                proto::TransferToSavings {
                    from_account: "alice".into(),
                    to_account: "bob".into(),
                    amount: hbd("1000"),
                    memo: "Saving for future".into(),
                },
            ),
        );
    });
}

// TS line 402: "Transfer From Savings Test".
#[test]
fn transfer_from_savings() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::TransferFromSavingsOperation(
                proto::TransferFromSavings {
                    from_account: "alice".into(),
                    request_id: 12345,
                    to_account: "bob".into(),
                    amount: hive("1000"),
                    memo: "Rent payment".into(),
                },
            ),
        );
    });
}

// TS line 439: "Transaction Test".
#[test]
fn transaction_tapos_fields() {
    wax_test(None, |ctx| {
        let tx = tapos_tx(ctx);

        assert_eq!(
            tx.transaction(),
            &proto::Transaction {
                ref_block_num: 51109,
                ref_block_prefix: 2785934438,
                expiration: EXPIRATION.into(),
                operations: Vec::new(),
                extensions: Vec::new(),
                signatures: Vec::new(),
            }
        );
    });
}

// TS line 456: "Set Withdraw Vesting Route Test".
#[test]
fn set_withdraw_vesting_route() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::SetWithdrawVestingRouteOperation(
                proto::SetWithdrawVestingRoute {
                    from_account: "from-user".into(),
                    to_account: "to-user".into(),
                    percent: 50,
                    auto_vest: true,
                },
            ),
        );
    });
}

// TS line 483: "Request Account Recovery Test".
#[test]
fn request_account_recovery() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::RequestAccountRecoveryOperation(
                proto::RequestAccountRecovery {
                    recovery_account: "recovery-user".into(),
                    account_to_recover: "compromised-user".into(),
                    new_owner_authority: authority(
                        1,
                        &[("intermediary", 1)],
                        &[(KEY_A, 1)],
                    ),
                    extensions: Vec::new(),
                },
            ),
        );
    });
}

// TS line 518: "Remove Proposal Test".
#[test]
fn remove_proposal() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::RemoveProposalOperation(proto::RemoveProposal {
                proposal_owner: "user123".into(),
                proposal_ids: vec![101, 202],
                extensions: Vec::new(),
            }),
        );
    });
}

// TS line 543: "Recurrent Transfer Test".
#[test]
fn recurrent_transfer() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::RecurrentTransferOperation(
                proto::RecurrentTransfer {
                    from_account: "sender".into(),
                    to_account: "receiver".into(),
                    amount: hive("1000"),
                    memo: "Monthly subscription".into(),
                    recurrence: 720,
                    executions: 12,
                    extensions: vec![proto::RecurrentTransferExtension {
                        value: Some(
                            proto::recurrent_transfer_extension::Value::RecurrentTransferPairId(
                                proto::RecurrentTransferPairId { pair_id: 1 },
                            ),
                        ),
                    }],
                },
            ),
        );
    });
}

// TS line 580: "Recover Account Test".
#[test]
fn recover_account() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::RecoverAccountOperation(proto::RecoverAccount {
                account_to_recover: "example-account".into(),
                new_owner_authority: authority(
                    1,
                    &[("intermediary", 1)],
                    &[(KEY_A, 1)],
                ),
                recent_owner_authority: authority(
                    1,
                    &[("gtg", 1)],
                    &[(KEY_A, 1)],
                ),
                extensions: Vec::new(),
            }),
        );
    });
}

// TS line 623: "POW Test".
//
// TS NOTE: `pow.nonce` is proto `uint64`, which ts-proto surfaces as a string
// ("2679032206"); in Rust it is a plain `u64`.
#[test]
fn pow() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::PowOperation(proto::Pow {
                worker_account: "some-account".into(),
                block_id: "003e9e6a776ccd3c72e6f1d3dc42f8cd5ee7d4bf".into(),
                nonce: 2679032206,
                work: proto::PowWork {
                    worker: "STM56h3LYjBgwFNucK4BNWwzV9S9odoQgtBTo8tW7HSBWQr6B85fG".into(),
                    input: "9401eda213a342333f08b5cb78a63e001a94bf3b9b4e4010361dc2ac091d2291".into(),
                    signature: "1fcd252a535a25dfff6bf8207c2c81c27ace3658bc894046cb24c5e01ba13dad76661ece701471f49c8c11b4eabeb586544876495e8e7d6d62e86931a68aa97a67".into(),
                    work: "000000002c131fe666ffc53cd4ac3c1bd4c80298294f7980ea5ffff510d0d472".into(),
                },
                props: proto::LegacyChainProperties {
                    account_creation_fee: hive("1"),
                    maximum_block_size: 131072,
                    hbd_interest_rate: 1000,
                },
            }),
        );
    });
}

// TS line 678: "POW2 Test".
#[test]
fn pow2() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::Pow2Operation(proto::Pow2 {
                work: proto::Pow2Work {
                    value: Some(proto::pow2_work::Value::Pow2(
                        proto::Pow2Pow {
                            input: proto::Pow2Input {
                                worker_account: "example-worker".into(),
                                prev_block: "0000000000000000".into(),
                                nonce: 123456789,
                            },
                            pow_summary: 0,
                        },
                    )),
                },
                new_owner_key: Some(
                    "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r"
                        .into(),
                ),
                props: proto::LegacyChainProperties {
                    account_creation_fee: hive("3000"),
                    maximum_block_size: 65536,
                    hbd_interest_rate: 1000,
                },
            }),
        );
    });
}

// TS line 737: "Limit Order Create Test".
#[test]
fn limit_order_create() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::LimitOrderCreateOperation(
                proto::LimitOrderCreate {
                    owner: "user123".into(),
                    orderid: 98765,
                    amount_to_sell: hive("100"),
                    min_to_receive: hbd("200"),
                    fill_or_kill: true,
                    expiration: "2023-12-01T00:00:00".into(),
                },
            ),
        );
    });
}

// TS line 784: "Limit Order Create 2 Test".
#[test]
fn limit_order_create2() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::LimitOrderCreate2Operation(
                proto::LimitOrderCreate2 {
                    owner: "user123".into(),
                    orderid: 789,
                    amount_to_sell: hive("1000"),
                    fill_or_kill: true,
                    exchange_rate: proto::Price {
                        base: hive("2000"),
                        quote: hbd("500"),
                    },
                    expiration: "2023-12-01T00:00:00".into(),
                },
            ),
        );
    });
}

// TS line 845: "Limit Order Cancel Test".
#[test]
fn limit_order_cancel() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::LimitOrderCancelOperation(
                proto::LimitOrderCancel {
                    owner: "user123".into(),
                    orderid: 456,
                },
            ),
        );
    });
}

// TS line 867: "Feed Publish Test".
#[test]
fn feed_publish() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::FeedPublishOperation(proto::FeedPublish {
                publisher: "example-witness".into(),
                exchange_rate: proto::Price {
                    base: hbd("0345"),
                    quote: hive("1000"),
                },
            }),
        );
    });
}

// TS line 912: "Escrow Transfer Test".
#[test]
fn escrow_transfer() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::EscrowTransferOperation(proto::EscrowTransfer {
                from_account: "alice".into(),
                to_account: "bob".into(),
                agent: "charlie".into(),
                escrow_id: 12345,
                hbd_amount: hbd("1000"),
                hive_amount: hive("2000"),
                fee: hbd("50"),
                ratification_deadline: "2023-09-01T12:00:00".into(),
                escrow_expiration: "2023-12-01T12:00:00".into(),
                json_meta: "{}".into(),
            }),
        );
    });
}

// TS line 975: "Escrow Release Test".
#[test]
fn escrow_release() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::EscrowReleaseOperation(proto::EscrowRelease {
                from_account: "alice".into(),
                to_account: "bob".into(),
                agent: "charlie".into(),
                who: "alice".into(),
                receiver: "bob".into(),
                escrow_id: 12345,
                hbd_amount: hbd("1000"),
                hive_amount: hive("2000"),
            }),
        );
    });
}

// TS line 1026: "Escrow Dispute Test".
#[test]
fn escrow_dispute() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::EscrowDisputeOperation(proto::EscrowDispute {
                from_account: "alice".into(),
                to_account: "bob".into(),
                agent: "charlie".into(),
                who: "alice".into(),
                escrow_id: 101,
            }),
        );
    });
}

// TS line 1055: "Escrow Approve Test".
#[test]
fn escrow_approve() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::EscrowApproveOperation(proto::EscrowApprove {
                from_account: "sender".into(),
                to_account: "receiver".into(),
                agent: "escrow-agent".into(),
                who: "receiver".into(),
                escrow_id: 123456,
                approve: true,
            }),
        );
    });
}

// TS line 1086: "Delete Comment Test".
#[test]
fn delete_comment() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::DeleteCommentOperation(proto::DeleteComment {
                author: "example-user".into(),
                permlink: "example_post".into(),
            }),
        );
    });
}

// TS line 1109: "Delegate Vesting Shares Test".
#[test]
fn delegate_vesting_shares() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::DelegateVestingSharesOperation(
                proto::DelegateVestingShares {
                    delegator: "user1".into(),
                    delegatee: "user2".into(),
                    vesting_shares: vests("1000"),
                },
            ),
        );
    });
}

// TS line 1142: "Decline Voting Rights Test".
#[test]
fn decline_voting_rights() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::DeclineVotingRightsOperation(
                proto::DeclineVotingRights {
                    account: "example-user".into(),
                    decline: true,
                },
            ),
        );
    });
}

// TS line 1165: "Custom Operation Test".
#[test]
fn custom_operation() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CustomOperation(proto::Custom {
                required_auths: vec!["user1".into(), "user2".into()],
                id: 123,
                data: "7598a1d3e8cdf938".into(),
            }),
        );
    });
}

// TS line 1190: "Custom JSON Test".
#[test]
fn custom_json() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CustomJsonOperation(proto::CustomJson {
                required_auths: Vec::new(),
                required_posting_auths: vec!["example-user".into()],
                id: "follow".into(),
                json: r#"{"follower":"example_user","following":"target_user","action":"follow"}"#.into(),
            }),
        );
    });
}

// TS line 1217: "Create Proposal Test".
#[test]
fn create_proposal() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CreateProposalOperation(proto::CreateProposal {
                creator: "alice".into(),
                receiver: "bob".into(),
                start_date: "2023-09-01T00:00:00".into(),
                end_date: "2023-12-01T00:00:00".into(),
                daily_pay: hbd("100000"),
                subject: "Development Proposal".into(),
                permlink: "dev-proposal".into(),
                extensions: Vec::new(),
            }),
        );
    });
}

// TS line 1260: "Create Claimed Account Test".
#[test]
fn create_claimed_account() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CreateClaimedAccountOperation(
                proto::CreateClaimedAccount {
                    creator: "alice".into(),
                    new_account_name: "bob".into(),
                    owner: authority(1, &[("account1", 1)], &[(KEY_B, 1)]),
                    active: authority(1, &[("account2", 1)], &[(KEY_B, 1)]),
                    posting: authority(1, &[("account3", 1)], &[(KEY_B, 1)]),
                    memo_key: KEY_B.into(),
                    json_metadata: "".into(),
                    extensions: Vec::new(),
                },
            ),
        );
    });
}

// TS line 1319: "Convert Test".
#[test]
fn convert() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::ConvertOperation(proto::Convert {
                owner: "alice".into(),
                requestid: 123,
                amount: hbd("1000000"),
            }),
        );
    });
}

// TS line 1352: "Comment Test".
#[test]
fn comment() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CommentOperation(proto::Comment {
                parent_author: "".into(),
                parent_permlink: "travel".into(),
                author: "user123".into(),
                permlink: "my-first-post".into(),
                title: "My First Post".into(),
                body: "Hello, this is my first post on the platform!".into(),
                json_metadata: r#"{"app":"peakd/2023.2.3","format":"markdown","tags":["introduction","firstpost"]}"#.into(),
            }),
        );
    });
}

// TS line 1385: "Comment Options Test".
#[test]
fn comment_options() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CommentOptionsOperation(proto::CommentOptions {
                author: "example-author".into(),
                permlink: "example-permlink".into(),
                max_accepted_payout: hbd("1000000"),
                percent_hbd: 10000,
                allow_votes: true,
                allow_curation_rewards: true,
                extensions: vec![proto::CommentOptionsExtension {
                    value: Some(
                        proto::comment_options_extension::Value::CommentPayoutBeneficiaries(
                            proto::CommentPayoutBeneficiaries {
                                beneficiaries: vec![
                                    proto::BeneficiaryRouteType {
                                        account: "beneficiary1".into(),
                                        weight: 5000,
                                    },
                                    proto::BeneficiaryRouteType {
                                        account: "beneficiary2".into(),
                                        weight: 5000,
                                    },
                                ],
                            },
                        ),
                    ),
                }],
            }),
        );
    });
}

// TS line 1432: "Collateralized Convert Test".
#[test]
fn collateralized_convert() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CollateralizedConvertOperation(
                proto::CollateralizedConvert {
                    owner: "example-user".into(),
                    requestid: 12345,
                    amount: hive("100000"),
                },
            ),
        );
    });
}

// TS line 1465: "Claim Reward Balance Test".
#[test]
fn claim_reward_balance() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::ClaimRewardBalanceOperation(
                proto::ClaimRewardBalance {
                    account: "alice".into(),
                    reward_hive: hive("100000"),
                    reward_hbd: hbd("50000"),
                    reward_vests: vests("200000"),
                },
            ),
        );
    });
}

// TS line 1492: "Claim Account Test".
#[test]
fn claim_account() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::ClaimAccountOperation(proto::ClaimAccount {
                creator: "user123".into(),
                fee: hive("1000"),
                extensions: Vec::new(),
            }),
        );
    });
}

// TS line 1525: "Change Recovery Account Test".
#[test]
fn change_recovery_account() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::ChangeRecoveryAccountOperation(
                proto::ChangeRecoveryAccount {
                    account_to_recover: "example-user".into(),
                    new_recovery_account: "new-recovery".into(),
                    extensions: Vec::new(),
                },
            ),
        );
    });
}

// TS line 1550: "Cancel Transfer From Savings Test".
#[test]
fn cancel_transfer_from_savings() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::CancelTransferFromSavingsOperation(
                proto::CancelTransferFromSavings {
                    from_account: "alice".into(),
                    request_id: 1234,
                },
            ),
        );
    });
}

// TS line 1573: "Account Witness Vote Test".
#[test]
fn account_witness_vote() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::AccountWitnessVoteOperation(
                proto::AccountWitnessVote {
                    account: "user123".into(),
                    witness: "witness456".into(),
                    approve: true,
                },
            ),
        );
    });
}

// TS line 1598: "Account Witness Proxy Test".
#[test]
fn account_witness_proxy() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::AccountWitnessProxyOperation(
                proto::AccountWitnessProxy {
                    account: "user1".into(),
                    proxy: "user2".into(),
                },
            ),
        );
    });
}

// TS line 1621: "Account Update2 Test".
#[test]
fn account_update2() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::AccountUpdate2Operation(proto::AccountUpdate2 {
                account: "example-account".into(),
                owner: Some(authority(
                    1,
                    &[("account-name-1", 1)],
                    &[(KEY_B, 1)],
                )),
                active: Some(authority(1, &[], &[(KEY_B, 1)])),
                posting: Some(authority(
                    2,
                    &[("account-name-2", 1)],
                    &[(KEY_B, 1), (KEY_A, 1)],
                )),
                memo_key: Some(KEY_B.into()),
                json_metadata: "{}".into(),
                posting_json_metadata: "{}".into(),
                extensions: Vec::new(),
            }),
        );
    });
}

// TS line 1680: "Account Update Test".
#[test]
fn account_update() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::AccountUpdateOperation(proto::AccountUpdate {
                account: "example-user".into(),
                owner: Some(authority(
                    1,
                    &[("account-name1", 1), ("account-name2", 2)],
                    &[(KEY_A, 1), (KEY_B, 2)],
                )),
                active: Some(authority(
                    1,
                    &[("another-account1", 1), ("another-account2", 2)],
                    &[(KEY_A, 1), (KEY_B, 2)],
                )),
                posting: Some(authority(
                    1,
                    &[("posting-account1", 3), ("posting-account2", 4)],
                    &[(KEY_A, 3), (KEY_B, 4)],
                )),
                memo_key: KEY_A.into(),
                json_metadata: "{}".into(),
            }),
        );
    });
}

// TS line 1735: "Account Create Test".
#[test]
fn account_create() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::AccountCreateOperation(proto::AccountCreate {
                fee: hive("3"),
                creator: "existing-account".into(),
                new_account_name: "new-account".into(),
                owner: authority(1, &[], &[(KEY_A, 1)]),
                active: authority(1, &[], &[(KEY_A, 1)]),
                posting: authority(1, &[], &[(KEY_A, 1)]),
                memo_key: KEY_A.into(),
                json_metadata: "{}".into(),
            }),
        );
    });
}

// TS line 1802: "Account Creation with Delegation Test".
#[test]
fn account_create_with_delegation() {
    wax_test(None, |ctx| {
        assert_pushed_unchanged(
            ctx,
            OperationValue::AccountCreateWithDelegationOperation(
                proto::AccountCreateWithDelegation {
                    fee: hive("1000"),
                    delegation: vests("50000"),
                    creator: "test-creator".into(),
                    new_account_name: "new-account".into(),
                    owner: authority(1, &[], &[(KEY_B, 1)]),
                    active: authority(1, &[], &[(KEY_B, 1)]),
                    posting: authority(1, &[], &[(KEY_B, 1)]),
                    memo_key: KEY_A.into(),
                    json_metadata: "".into(),
                    extensions: Vec::new(),
                },
            ),
        );
    });
}
