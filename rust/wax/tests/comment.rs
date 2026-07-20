//! Rust counterparts to the comment-operation tests in
//! `ts/wasm/__tests__/detailed/complex_operations.ts`.
//!
//! Wire-form assertions: the `comment_operation.json_metadata` and emitted
//! `comment_options_operation` are diffed against the same shapes the TS
//! tests expect (modulo the `app` field, which is `"wax/0.1.0"` here vs.
//! TS's `"@hiveio/wax/{version}"`).

use wax::complex_operations::{
    BeneficiaryRoute, BlogPostOperation, ReplyOperation,
};
use wax::models::asset::NaiAssetConvertible;
use wax::{Transaction, WaxFoundation, create_wax_foundation};

const TAPOS: &str = "04c507a8c7fe5be96be64ce7c86855e1806cbde3";
const EXPIRATION: &str = "2023-11-09T21:51:27";
const APP: &str =
    concat!(env!("CARGO_PKG_NAME"), "/", env!("CARGO_PKG_VERSION"));

fn foundation() -> WaxFoundation {
    create_wax_foundation(None)
}

fn fresh_tx(f: &WaxFoundation) -> Transaction {
    f.create_transaction_with_tapos(TAPOS, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

fn extract_comment(op: &wax::proto::Operation) -> &wax::proto::Comment {
    match &op.value {
        Some(wax::proto::operation::Value::CommentOperation(c)) => c,
        other => panic!("expected CommentOperation, got {other:?}"),
    }
}

fn extract_comment_options(
    op: &wax::proto::Operation,
) -> &wax::proto::CommentOptions {
    match &op.value {
        Some(wax::proto::operation::Value::CommentOptionsOperation(c)) => c,
        other => panic!("expected CommentOptionsOperation, got {other:?}"),
    }
}

// Mirrors the TS "Should be able to convert transaction for post with
// beneficiares to legacy api" test (lines 545-599). Asserts the
// json_metadata shape plus a populated comment_options op carrying
// beneficiaries via the extension.
#[test]
fn reply_with_beneficiaries_and_tags() {
    let f = foundation();

    let op = ReplyOperation {
        parent_author: "guest4test".into(),
        parent_permlink: "spam".into(),
        author: "gtg".into(),
        body: "Post with beneficiaries".into(),
        title: Some("Post with beneficiares".into()),
        permlink: Some("post-with-beneficiaries".into()),
        tags: vec!["spam".into()],
        beneficiaries: vec![BeneficiaryRoute {
            account: "guest4test7".into(),
            weight: 40,
        }],
        description: Some("Post with beneficiaries".into()),
        ..Default::default()
    };

    let mut tx = fresh_tx(&f);
    tx.push_complex_operation(&f, op)
        .expect("push_complex_operation");
    let ops = &tx.transaction().operations;
    assert_eq!(ops.len(), 2, "comment + comment_options expected");

    let comment = extract_comment(&ops[0]);
    assert_eq!(comment.parent_author, "guest4test");
    assert_eq!(comment.parent_permlink, "spam");
    assert_eq!(comment.author, "gtg");
    assert_eq!(comment.permlink, "post-with-beneficiaries");
    assert_eq!(comment.title, "Post with beneficiares");
    assert_eq!(comment.body, "Post with beneficiaries");
    assert_eq!(
        comment.json_metadata,
        format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"description":"Post with beneficiaries"}}"#,
        ),
    );

    let options = extract_comment_options(&ops[1]);
    assert_eq!(options.author, "gtg");
    assert_eq!(options.permlink, "post-with-beneficiaries");
    assert_eq!(options.percent_hbd, 10_000);
    assert!(options.allow_votes);
    assert!(options.allow_curation_rewards);
    assert_eq!(options.max_accepted_payout.amount, "1000000000");
    assert_eq!(options.extensions.len(), 1);
    match &options.extensions[0].value {
        Some(wax::proto::comment_options_extension::Value::CommentPayoutBeneficiaries(b)) => {
            assert_eq!(b.beneficiaries.len(), 1);
            assert_eq!(b.beneficiaries[0].account, "guest4test7");
            assert_eq!(b.beneficiaries[0].weight, 40);
        }
        other => panic!("expected CommentPayoutBeneficiaries, got {other:?}"),
    }
}

// Mirrors "Should be able to set percent HBD in ReplyOperation"
// (TS line 601). With percent_hbd != default, the options op IS emitted.
#[test]
fn reply_with_percent_hbd_emits_options() {
    let f = foundation();

    let op = ReplyOperation {
        parent_author: "guest4test".into(),
        parent_permlink: "spam".into(),
        author: "gtg".into(),
        body: "Set percent".into(),
        title: Some("set-percent".into()),
        permlink: Some("set-percent".into()),
        tags: vec!["spam".into()],
        percent_hbd: Some(20),
        description: Some("Set percent".into()),
        ..Default::default()
    };

    let mut tx = fresh_tx(&f);
    tx.push_complex_operation(&f, op)
        .expect("push_complex_operation");
    let ops = &tx.transaction().operations;
    assert_eq!(ops.len(), 2);

    let comment = extract_comment(&ops[0]);
    assert_eq!(
        comment.json_metadata,
        format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"description":"Set percent"}}"#,
        ),
    );

    let options = extract_comment_options(&ops[1]);
    assert_eq!(options.percent_hbd, 20);
    assert!(options.extensions.is_empty());
}

// Mirrors "Should be able to push images in ReplyBuiler" (TS line 648).
// No options touched, so only the comment op is emitted; `image` is the
// JSON key (singular), not `images`.
#[test]
fn reply_with_images_emits_only_comment() {
    let f = foundation();

    let op = ReplyOperation {
        parent_author: "guest4test".into(),
        parent_permlink: "spam".into(),
        author: "gtg".into(),
        body: "Push images".into(),
        title: Some("push-images".into()),
        permlink: Some("push-images".into()),
        tags: vec!["spam".into()],
        images: vec!["test2.png".into(), "test.png".into()],
        description: Some("Push Images".into()),
        ..Default::default()
    };

    let mut tx = fresh_tx(&f);
    tx.push_complex_operation(&f, op)
        .expect("push_complex_operation");
    let ops = &tx.transaction().operations;
    assert_eq!(
        ops.len(),
        1,
        "options op should be suppressed when untouched"
    );

    let comment = extract_comment(&ops[0]);
    assert_eq!(
        comment.json_metadata,
        format!(
            r#"{{"format":"markdown+html","app":"{APP}","tags":["spam"],"image":["test2.png","test.png"],"description":"Push Images"}}"#,
        ),
    );
}

// Mirrors "Should be able to set category in BlogPostOperation" (TS line 683).
#[test]
fn blog_post_with_category() {
    let f = foundation();

    let op = BlogPostOperation {
        category: "test-category".into(),
        author: "gtg".into(),
        title: "Post with category".into(),
        body: "Post with category".into(),
        permlink: Some("post-with-category".into()),
        tags: vec!["spam".into()],
        description: Some("Post with category".into()),
        ..Default::default()
    };

    let mut tx = fresh_tx(&f);
    tx.push_complex_operation(&f, op)
        .expect("push_complex_operation");
    let ops = &tx.transaction().operations;
    assert_eq!(ops.len(), 1);

    let comment = extract_comment(&ops[0]);
    assert_eq!(comment.parent_author, "");
    assert_eq!(comment.parent_permlink, "test-category");
    assert_eq!(comment.author, "gtg");
    assert_eq!(comment.permlink, "post-with-category");
}

// Setting only options-default values (percent_hbd=10000, allow_votes=true,
// etc.) should still suppress the options op — `computed == default`.
#[test]
fn options_at_default_values_are_suppressed() {
    let f = foundation();

    let op = ReplyOperation {
        parent_author: "alice".into(),
        parent_permlink: "spam".into(),
        author: "bob".into(),
        body: "hi".into(),
        permlink: Some("hi".into()),
        percent_hbd: Some(10_000),
        allow_votes: Some(true),
        allow_curation_rewards: Some(true),
        ..Default::default()
    };

    let mut tx = fresh_tx(&f);
    tx.push_complex_operation(&f, op)
        .expect("push_complex_operation");
    assert_eq!(tx.transaction().operations.len(), 1);
}

#[test]
fn reply_rejects_empty_parent_author() {
    let f = foundation();
    let mut tx = fresh_tx(&f);
    let result = tx.push_complex_operation(
        &f,
        ReplyOperation {
            parent_author: String::new(),
            parent_permlink: "spam".into(),
            author: "gtg".into(),
            body: "x".into(),
            ..Default::default()
        },
    );
    assert!(result.is_err());
}

#[test]
fn reply_rejects_empty_parent_permlink() {
    let f = foundation();
    let mut tx = fresh_tx(&f);
    let result = tx.push_complex_operation(
        &f,
        ReplyOperation {
            parent_author: "alice".into(),
            parent_permlink: String::new(),
            author: "gtg".into(),
            body: "x".into(),
            ..Default::default()
        },
    );
    assert!(result.is_err());
}

#[test]
fn rejects_wrong_asset_for_max_accepted_payout() {
    let f = foundation();
    let hive = f.hive_satoshis(1_000_000_000).expect("hive_satoshis");

    let mut tx = fresh_tx(&f);
    let result = tx.push_complex_operation(
        &f,
        ReplyOperation {
            parent_author: "alice".into(),
            parent_permlink: "spam".into(),
            author: "bob".into(),
            body: "x".into(),
            permlink: Some("x".into()),
            max_accepted_payout: Some(NaiAssetConvertible::Asset(hive)),
            ..Default::default()
        },
    );
    assert!(
        result.is_err(),
        "max_accepted_payout must be HBD; HIVE should be rejected"
    );
}

// Default permlink template for Reply is `re-{parent_author}-{millis}`.
#[test]
fn reply_default_permlink_template() {
    let f = foundation();

    let op = ReplyOperation {
        parent_author: "alice".into(),
        parent_permlink: "spam".into(),
        author: "bob".into(),
        body: "x".into(),
        ..Default::default()
    };

    let mut tx = fresh_tx(&f);
    tx.push_complex_operation(&f, op)
        .expect("push_complex_operation");
    let comment = extract_comment(&tx.transaction().operations[0]);
    assert!(
        comment.permlink.starts_with("re-alice-"),
        "expected default permlink 're-alice-<millis>', got {:?}",
        comment.permlink
    );
}
