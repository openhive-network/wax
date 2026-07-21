// Rust port of `ts/wasm/__tests__/detailed/custom_jsons.ts`.
//
// Tests appear in TS source order. Each Rust test has a `// TS line N` comment
// pointing back to the TS original.
//
// TS NOTE: the TS builders take variadic blog/delegatee tails; the Rust
// builders fold them into a `Vec` and return `Result` (list-size and
// authority validation happens at call time), hence the `expect` chains.

use serde_json::json;

use wax::Transaction;
use wax::hive_apps_operations::community::{
    AvailableCommunityRoles, CommunityOperation, CommunityProps,
};
use wax::hive_apps_operations::follow::{FollowBlogAction, FollowOperation};
use wax::hive_apps_operations::{HiveAppsOperation, ResourceCreditsOperation};
use wax::proto::{self, operation::Value as OperationValue};

use crate::common::{WaxTestCtx, wax_test};

const TAPOS: &str = "04c507a8c7fe5be96be64ce7c86855e1806cbde3";
const EXPIRATION: &str = "2023-11-09T21:51:27";

fn fresh_tx(ctx: &WaxTestCtx) -> Transaction {
    ctx.base
        .create_transaction_with_tapos(TAPOS, EXPIRATION)
        .expect("create_transaction_with_tapos")
}

// data.proto-protocol.ts: `protoVoteOp`.
fn proto_vote_op() -> OperationValue {
    OperationValue::VoteOperation(proto::Vote {
        voter: "otom".into(),
        author: "c0ff33a".into(),
        permlink: "ewxhnjbj".into(),
        weight: 2200,
    })
}

fn api_json(tx: &Transaction) -> serde_json::Value {
    tx.to_api_json().expect("to_api_json")
}

fn custom_json(json_payload: &str, posting_auth: &str) -> serde_json::Value {
    json!({
        "type": "custom_json_operation",
        "value": {
            "id": "follow",
            "json": json_payload,
            "required_auths": [],
            "required_posting_auths": [posting_auth],
        }
    })
}

fn community_json(json_payload: &str) -> serde_json::Value {
    json!({
        "type": "custom_json_operation",
        "value": {
            "id": "community",
            "json": json_payload,
            "required_auths": [],
            "required_posting_auths": ["gtg"],
        }
    })
}

// data.protocol.ts: `customJsonsTransaction` — shared by the first two tests.
fn custom_jsons_transaction() -> serde_json::Value {
    json!({
        "ref_block_num": 1960,
        "ref_block_prefix": 3915120327u32,
        "expiration": "2023-11-09T21:51:27",
        "extensions": [],
        "signatures": [],
        "operations": [
            {
                "type": "vote_operation",
                "value": {
                    "voter": "otom",
                    "author": "c0ff33a",
                    "permlink": "ewxhnjbj",
                    "weight": 2200,
                }
            },
            custom_json(
                r#"["follow",{"follower":"initminer","following":"gtg","what":["blog"]}]"#,
                "initminer",
            ),
            custom_json(
                r#"["follow",{"follower":"initminer","following":"spammer","what":["ignore"]}]"#,
                "initminer",
            ),
            custom_json(
                r#"["follow",{"follower":"initminer","following":"spammer","what":["reset_following_list"]}]"#,
                "initminer",
            ),
            custom_json(
                r#"["follow",{"follower":"initminer","following":"spammer","what":["reset_muted_list"]}]"#,
                "initminer",
            ),
        ]
    })
}

// TS line 8: "Should be able to create transaction with hive apps follow
// operation using transaction interface".
#[test]
fn follow_operation_authorizing_each_action() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_operation(ctx.base.create_operation(proto_vote_op()));

        let follow = FollowOperation::new()
            .follow_blog("initminer", vec!["gtg".into()])
            .expect("follow_blog")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize")
            .mute_blog("initminer", vec!["spammer".into()])
            .expect("mute_blog")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize")
            .reset_blog_list(
                FollowBlogAction::Both,
                "initminer",
                vec!["spammer".into()],
            )
            .expect("reset_blog_list")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, follow)
            .expect("push_complex_operation");

        assert_eq!(api_json(&tx), custom_jsons_transaction());
    });
}

// TS line 29: "Should be able to create transaction with hive apps follow
// operation authorizing at the end using transaction interface".
#[test]
fn follow_operation_authorizing_at_the_end() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);
        tx.push_operation(ctx.base.create_operation(proto_vote_op()));

        let follow = FollowOperation::new()
            .follow_blog("initminer", vec!["gtg".into()])
            .expect("follow_blog")
            .mute_blog("initminer", vec!["spammer".into()])
            .expect("mute_blog")
            .reset_blog_list(
                FollowBlogAction::FollowBlog,
                "initminer",
                vec!["spammer".into()],
            )
            .expect("reset_blog_list")
            .reset_blog_list(
                FollowBlogAction::MuteBlog,
                "initminer",
                vec!["spammer".into()],
            )
            .expect("reset_blog_list")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, follow)
            .expect("push_complex_operation");

        assert_eq!(api_json(&tx), custom_jsons_transaction());
    });
}

// TS line 49: "Should be able to create transaction with mutliple hive apps
// authorizing at the end using transaction interface".
#[test]
fn multiple_follow_actions_authorized_at_the_end() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);

        let follow = FollowOperation::new()
            .follow_blacklist_blog("initminer", vec!["gtg".into()])
            .expect("follow_blacklist_blog")
            .follow_muted_blog("initminer", vec!["gtg".into()])
            .expect("follow_muted_blog")
            .reset_all_blog("initminer", vec!["gtg".into()])
            .expect("reset_all_blog")
            .reset_blacklist_blog("initminer", vec!["gtg".into()])
            .expect("reset_blacklist_blog")
            .reset_follow_blacklist_blog("initminer", vec!["gtg".into()])
            .expect("reset_follow_blacklist_blog")
            .reset_follow_muted_blog("initminer", vec!["gtg".into()])
            .expect("reset_follow_muted_blog")
            .unblacklist_blog("initminer", vec!["gtg".into()])
            .expect("unblacklist_blog")
            .unfollow_blacklist_blog("initminer", vec!["gtg".into()])
            .expect("unfollow_blacklist_blog")
            .unfollow_blog("initminer", vec!["gtg".into()])
            .expect("unfollow_blog")
            .unfollow_muted_blog("initminer", vec!["gtg".into()])
            .expect("unfollow_muted_blog")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, follow)
            .expect("push_complex_operation");

        // data.protocol.ts: `customMultipleJsonsTransaction`.
        let follow_what = |what: &str| {
            custom_json(
                &format!(
                    r#"["follow",{{"follower":"initminer","following":"gtg","what":["{what}"]}}]"#
                ),
                "initminer",
            )
        };
        assert_eq!(
            api_json(&tx),
            json!({
                "ref_block_num": 1960,
                "ref_block_prefix": 3915120327u32,
                "expiration": "2023-11-09T21:51:27",
                "extensions": [],
                "signatures": [],
                "operations": [
                    follow_what("follow_blacklist"),
                    follow_what("follow_muted"),
                    follow_what("reset_all_lists"),
                    follow_what("reset_blacklist"),
                    follow_what("reset_follow_blacklist"),
                    follow_what("reset_follow_muted_list"),
                    follow_what("unblacklist"),
                    follow_what("unfollow_blacklist"),
                    follow_what(""),
                    follow_what("unfollow_muted"),
                ]
            })
        );
    });
}

// TS line 73: "Should be able to create transaction with setting community
// user role using transaction interface".
#[test]
fn community_set_role_for_every_role() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);

        let community = CommunityOperation::new()
            .set_role(
                "test-community",
                "guest4test",
                AvailableCommunityRoles::Owner,
            )
            .set_role(
                "test-community",
                "guest4test2",
                AvailableCommunityRoles::Admin,
            )
            .set_role(
                "test-community",
                "guest4test3",
                AvailableCommunityRoles::Mod,
            )
            .set_role(
                "test-community",
                "guest4test4",
                AvailableCommunityRoles::Member,
            )
            .set_role(
                "test-community",
                "guest4test5",
                AvailableCommunityRoles::Guest,
            )
            .set_role(
                "test-community",
                "guest4test6",
                AvailableCommunityRoles::Muted,
            )
            .authorize(vec!["gtg".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, community)
            .expect("push_complex_operation");

        let set_role = |account: &str, role: &str| {
            community_json(&format!(
                r#"["setRole",{{"community":"test-community","account":"{account}","role":"{role}"}}]"#
            ))
        };
        assert_eq!(
            api_json(&tx),
            json!({
                "ref_block_num": 1960,
                "ref_block_prefix": 3915120327u32,
                "expiration": "2023-11-09T21:51:27",
                "extensions": [],
                "signatures": [],
                "operations": [
                    set_role("guest4test", "owner"),
                    set_role("guest4test2", "admin"),
                    set_role("guest4test3", "mod"),
                    set_role("guest4test4", "member"),
                    set_role("guest4test5", "guest"),
                    set_role("guest4test6", "muted"),
                ]
            })
        );
    });
}

// TS line 168: "Should be able to create transaction with mutliple community
// hive apps authorizing at the end using transaction interface".
#[test]
fn multiple_community_actions_authorized_at_the_end() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);

        let community = CommunityOperation::new()
            .flag_post("mycomm", "gtg", "first-post", "note")
            .mute_post("mycomm", "gtg", "first-post", "note")
            .pin_post("mycomm", "gtg", "first-post")
            .subscribe("mycomm")
            .unmute_post("mycomm", "gtg", "first-post", "note")
            .unpin_post("mycomm", "gtg", "first-post")
            .unsubscribe("mycomm")
            .set_user_title("mycomm", "gtg", "first-post")
            .update_props(
                "mycomm",
                CommunityProps {
                    title: "Custom title".into(),
                    about: Some("This community is the best!".into()),
                    description: Some("Accepting all kind of users".into()),
                    flag_text: Some("1. Smoking here is not allowed".into()),
                    is_nsfw: Some(false),
                    lang: Some("en".into()),
                },
            )
            .set_role("mycomm", "gtg", AvailableCommunityRoles::Owner)
            .authorize(vec!["gtg".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, community)
            .expect("push_complex_operation");

        // data.protocol.ts: `customCommunityJsonsTransaction`.
        assert_eq!(
            api_json(&tx),
            json!({
                "ref_block_num": 1960,
                "ref_block_prefix": 3915120327u32,
                "expiration": "2023-11-09T21:51:27",
                "extensions": [],
                "signatures": [],
                "operations": [
                    community_json(r#"["flagPost",{"community":"mycomm","account":"gtg","permlink":"first-post","notes":"note"}]"#),
                    community_json(r#"["mutePost",{"community":"mycomm","account":"gtg","permlink":"first-post","notes":"note"}]"#),
                    community_json(r#"["pinPost",{"community":"mycomm","account":"gtg","permlink":"first-post"}]"#),
                    community_json(r#"["subscribe",{"community":"mycomm"}]"#),
                    community_json(r#"["unmutePost",{"community":"mycomm","account":"gtg","permlink":"first-post","notes":"note"}]"#),
                    community_json(r#"["unpinPost",{"community":"mycomm","account":"gtg","permlink":"first-post"}]"#),
                    community_json(r#"["unsubscribe",{"community":"mycomm"}]"#),
                    community_json(r#"["setUserTitle",{"community":"mycomm","account":"gtg","title":"first-post"}]"#),
                    community_json(r#"["updateProps",{"community":"mycomm","props":{"title":"Custom title","about":"This community is the best!","description":"Accepting all kind of users","flag_text":"1. Smoking here is not allowed","is_nsfw":false,"lang":"en"}}]"#),
                    community_json(r#"["setRole",{"community":"mycomm","account":"gtg","role":"owner"}]"#),
                ]
            })
        );
    });
}

// TS line 199: "Should be able to create transaction with hive apps reblog
// operation using transaction interface".
#[test]
fn follow_reblog_operation() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);

        let follow = FollowOperation::new()
            .reblog("initminer", "gtg", "first-post")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, follow)
            .expect("push_complex_operation");

        assert_eq!(
            api_json(&tx),
            json!({
                "ref_block_num": 1960,
                "ref_block_prefix": 3915120327u32,
                "expiration": "2023-11-09T21:51:27",
                "extensions": [],
                "signatures": [],
                "operations": [
                    custom_json(
                        r#"["reblog",{"account":"initminer","author":"gtg","permlink":"first-post"}]"#,
                        "initminer",
                    ),
                ]
            })
        );
    });
}

// TS line 232: "Should be able to create transaction with hive apps rc
// operation using transaction interface".
#[test]
fn resource_credits_operation() {
    wax_test(None, |ctx| {
        let mut tx = fresh_tx(ctx);

        let rc = ResourceCreditsOperation::new()
            .delegate("initminer", 3000, vec!["gtg".into()])
            .expect("delegate")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize")
            .remove_delegation("initminer", vec!["gtg".into()])
            .expect("remove_delegation")
            .authorize(vec!["initminer".into()], vec![])
            .expect("authorize");
        tx.push_complex_operation(&ctx.base, rc)
            .expect("push_complex_operation");

        let delegate_rc = |max_rc: &str| {
            json!({
                "type": "custom_json_operation",
                "value": {
                    "id": "rc",
                    "json": format!(
                        r#"["delegate_rc",{{"from":"initminer","delegatees":["gtg"],"max_rc":"{max_rc}","extensions":[]}}]"#
                    ),
                    "required_auths": [],
                    "required_posting_auths": ["initminer"],
                }
            })
        };
        assert_eq!(
            api_json(&tx),
            json!({
                "ref_block_num": 1960,
                "ref_block_prefix": 3915120327u32,
                "expiration": "2023-11-09T21:51:27",
                "extensions": [],
                "signatures": [],
                "operations": [delegate_rc("3000"), delegate_rc("0")]
            })
        );
    });
}
