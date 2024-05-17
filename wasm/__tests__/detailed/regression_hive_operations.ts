import { chromium, ChromiumBrowser, ConsoleMessage } from "playwright";
import { test } from "../assets/jest-helper";
import { DEFAULT_STORAGE_ROOT } from "@hiveio/beekeeper/node";
import fs from "fs";
import { expect } from "@playwright/test";
import {
  account_create,
  account_create_with_delegation,
  account_update,
  account_update2,
  account_witness_proxy,
  account_witness_vote,
  cancel_transfer_from_savings,
  change_recovery_account,
  claim_account,
  claim_reward_balance,
  collateralized_convert,
  comment,
  comment_options,
  convert,
  create_claimed_account,
  create_proposal,
  custom,
  custom_json,
  decline_voting_rights,
  delegate_vesting_shares,
  delete_comment,
  escrow_approve,
  escrow_dispute,
  escrow_release,
  escrow_transfer,
  feed_publish,
  limit_order_cancel,
  limit_order_create,
  limit_order_create2,
  operation,
  pow,
  pow2,
  recover_account,
  recurrent_transfer,
  remove_proposal,
  request_account_recovery,
  set_withdraw_vesting_route,
  transfer,
  transfer_from_savings,
  transfer_to_savings,
  transfer_to_vesting,
  update_proposal,
  update_proposal_votes,
  vesting_shares_split,
  vote,
  withdraw_vesting,
  witness_set_properties,
  witness_update
} from "../../dist/bundle/index-full";

let browser!: ChromiumBrowser;

test.describe('Wax transaction builder hive operations regression tests', () => {
  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true
    });
  });

  test.beforeEach(async({ page }) => {
    page.on('console', (msg: ConsoleMessage) => {
      console.log('>>', msg.type(), msg.text())
    });

    if(fs.existsSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`))
      fs.rmSync(`${DEFAULT_STORAGE_ROOT}/.beekeeper/w0.wallet`);

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test.html", { waitUntil: "load" });
  });

  test('Vote opeartion Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: vote = {
        voter: "alice",
        author: "bob",
        permlink: "example-post",
        weight: 10000
      };

      const op: operation = { vote: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      voter: "alice",
      author: "bob",
      permlink: "example-post",
      weight: 10000
    });
  });

  test('Witness Update Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: witness_update = {
        owner: "alice",
        url: "https://alice.example.com",
        block_signing_key: "HIVE8KhdgP747CbKNzrN2dzFCkBdGh",
        props: {
          account_creation_fee: {
            amount: "100.000",
            precision: 3,
            nai: "@@100000021"
          },
          maximum_block_size: 65536,
          hbd_interest_rate: 1000,
        },
        fee: {
          amount: "0.000",
          precision: 3,
          nai: "@@100000021"
        }
      };

      const op: operation = { witness_update: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      witness_update: {
        owner: "alice",
        url: "https://alice.example.com",
        block_signing_key: "HIVE8KhdgP747CbKNzrN2dzFCkBdGh",
        props: {
          account_creation_fee: {
            amount: "100.000",
            precision: 3,
            nai: "@@100000021"
          },
          maximum_block_size: 65536,
          hbd_interest_rate: 1000,
        },
        fee: {
          amount: "0.000",
          precision: 3,
          nai: "@@100000021"
        }
      }
    });
  });

  test('Witness Set Properties Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: witness_set_properties = {
          owner: "example_witness",
          props: {
              "maximum_block_size": "65536",
              "account_creation_fee": "3.000 HIVE",
              "url": "https://example.com/mywitness"
          },
          extensions: []
      };

      const op: operation = { witness_set_properties: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      owner: "example_witness",
      props: {
        "maximum_block_size": "65536",
        "account_creation_fee": "3.000 HIVE",
        "url": "https://example.com/mywitness"
      },
      extensions: []
    });
  });

  test('Witness Block Aprove Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const tx = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const protoMessage = {
        witness: "test witness",
        blockId: "123456789"
      } as operation;

      tx.push(protoMessage).validate();

      return tx.build().operations[0];
    });

    expect(retVal).toStrictEqual({ witness: "test witness", block_id: "123456789" });
  });

  test('Withdraw Vesting Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: withdraw_vesting = {
        account: "user123",
        vesting_shares: {
          amount: "100.000000",
          precision: 6,
          nai: "@@000000037"
        }
      };

      const op: operation = { withdraw_vesting: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account: "user123",
      vesting_shares: {
        amount: "100.000000",
        precision: 6,
        nai: "@@000000037"
      }
    });
  });

  test('Vesting Shares Split Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: vesting_shares_split = {
        owner: "example_user",
        vesting_shares_before_split: {
          amount: "1000000",
          precision: 6,
          nai: "@@000000037"
        },
        vesting_shares_after_split: {
          amount: "6000000",
          precision: 12,
          nai: "@@000000037"
        }
      };

      const op: operation = { vesting_shares_split: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      vesting_shares_split: {
        owner: "example_user",
        vesting_shares_before_split: {
          amount: "1000000",
          precision: 6,
          nai: "@@000000037"
        },
        vesting_shares_after_split: {
          amount: "6000000",
          precision: 12,
          nai: "@@000000037"
        }
      }
    });
  });

  test('Update Proposal Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: update_proposal = {
        proposal_id: '123456789',
        creator: "creator_account",
        daily_pay: {
          amount: '100.000',
          precision: 3,
          nai: '@@000000021'
        },
        subject: 'Updated Proposal Subject',
        permlink: 'updated-proposal-permlink',
        extensions: [{
          update_proposal_end_date: {
            end_date: '2024-01-01T00:00:00'
          }
        }]
      };

      const op: operation = { update_proposal: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      proposal_id: '123456789',
      creator: "creator_account",
      daily_pay: {
        amount: '100.000',
        precision: 3,
        nai: '@@000000021'
      },
      subject: 'Updated Proposal Subject',
      permlink: 'updated-proposal-permlink',
      extensions: [{
        update_proposal_end_date: {
          end_date: '2024-01-01T00:00:00'
        }
      }]
    });
  });

  test('Update Proposal Votes Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: update_proposal_votes = {
        voter: "someUser",
        proposal_ids: ['1001', '1002'],
        approve: true,
        extensions: []
      };

      const op: operation = { update_proposal_votes: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      voter: "someUser",
      proposal_ids: ['1001', '1002'],
      approve: true,
      extensions: []
    });
  });

  test('Transfer Operation Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: transfer = {
        from_account: "alice",
        to_account: "bob",
        amount: {
          amount: "100.000",
          precision: 3,
          nai: "@@000000021"
        },
        memo: "Here's your payment"
      };

      const op: operation = { transfer: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "alice",
      to_account: "bob",
      amount: {
        amount: "100.000",
        precision: 3,
        nai: "@@000000021"
      },
      memo: "Here's your payment"
    });
  });

  test('Transfer To Vesting Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: transfer_to_vesting = {
        from_account: "sender_account",
        to_account: "receiver_account",
        amount: {
          amount: "1000",
          precision: 3,
          nai: "1234567890"
        }
      };

      const op: operation = { transfer_to_vesting: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "sender_account",
      to_account: "receiver_account",
      amount: {
        amount: "1000",
        precision: 3,
        nai: "1234567890"
      }
    });
  });

  test('Transfer To Savings Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: transfer_to_savings = {
        from_account: "alice",
        to_account: "bob",
        amount: {
          amount: "1000",
          precision: 3,
          nai: "@@000000013"
        },
        memo: "Saving for future"
      };

      const op: operation = { transfer_to_savings: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from: "alice",
      to: "bob",
      amount: {
        amount: "1000",
        precision: 3,
        nai: "@@000000013"
      },
      memo: "Saving for future"
    });
  });

  test('Transfer From Savings Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
    const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

    const testedOp: transfer_from_savings = {
      from_account: "alice",
      request_id: 12345,
      to_account: "bob",
      amount: {
        amount: "1000",
        precision: 3,
        nai: "@@000000021"
      },
      memo: "Rent payment"
    };

    const op: operation = { transfer_from_savings: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "alice",
      request_id: 12345,
      to_account: "bob",
      amount: {
        amount: "1000",
        precision: 3,
        nai: "@@000000021"
      },
      memo: "Rent payment"
    });
  });

  test('Transaction Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      return txB.build();
    });

    expect(retVal).toStrictEqual({
      ref_block_num: 1,
      ref_block_prefix: 123456789,
      expiration: "2023-08-01T15:38:48",
      operations: [],
      extensions: [],
      signatures: []
    });
  });

  test('Set Withdraw Vesting Route Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: set_withdraw_vesting_route = {
        from_account: "fromUser",
        to_account: "toUser",
        percent: 50,
        auto_vest: true
      };

      const op: operation = { set_withdraw_vesting_route: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "fromUser",
      to_account: "toUser",
      percent: 50,
      auto_vest: true
    });
  });

  test('Request Account Recovery Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: request_account_recovery = {
        recovery_account: "recoveryUser",
        account_to_recover: "compromisedUser",
        new_owner_authority: {
          weight_threshold: 1,
          account_auths: { "intermediary": 1 },
          key_auths: { "public_key": 1 }
        },
        extensions: []
      };

      const op: operation = { request_account_recovery: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      recovery_account: "recoveryUser",
      account_to_recover: "compromisedUser",
      new_owner_authority: {
        weight_threshold: 1,
        account_auths: { "intermediary": 1 },
        key_auths: { "public_key": 1 }
      },
      extensions: []
    });
  });

  test('Remove Proposal Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: remove_proposal = {
        proposal_owner: "user123",
        proposal_ids: ['101', '202'],
        extensions: []
      };

      const op: operation = { remove_proposal: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      proposal_owner: "user123",
      proposal_ids: ['101', '202'],
      extensions: []
    });
  });

  test('Recurrent Transfer Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: recurrent_transfer = {
        from_account: "sender",
        to_account: "receiver",
        amount: { amount: "1000", precision: 3, nai: "@@000000021" },
        memo: "Monthly subscription",
        recurrence: 720,
        executions: 12,
        extensions: [
          { recurrent_transfer_pair_id: { pair_id: 1 } }
        ]
      };

      const op: operation = { recurrent_transfer: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "sender",
      to_account: "receiver",
      amount: { amount: "1000", precision: 3, nai: "@@000000021" },
      memo: "Monthly subscription",
      recurrence: 720,
      executions: 12,
      extensions: [
        { recurrent_transfer_pair_id: { pair_id: 1 } }
      ]
    });
  });

  test('Recover Account Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: recover_account = {
        account_to_recover: "example_account",
        new_owner_authority: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        recent_owner_authority: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        extensions: []
      };

      const op: operation = { recover_account: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account_to_recover: "example_account",
      new_owner_authority: {
        weight_threshold: 1,
        account_auths: {},
        key_auths: {}
      },
      recent_owner_authority: {
        weight_threshold: 1,
        account_auths: {},
        key_auths: {}
      },
      extensions: []
    });
  });

  test('POW Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: pow = {
        worker_account: "some_account",
        block_id: "0000000000000000000000000000000000000000",
        nonce: '1234567890',
        work: {
          worker: "some_worker",
          input: "some_input",
          signature: "some_signature",
          work: "some_work"
        },
        props: {
          account_creation_fee: { amount: "1000.000", precision: 3, nai: "@@000000021" },
          maximum_block_size: 65536,
          hbd_interest_rate: 1000
        }
      };

      const op: operation = { pow: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      worker_account: "some_account",
      block_id: "0000000000000000000000000000000000000000",
      nonce: '1234567890',
      work: {
        worker: "some_worker",
        input: "some_input",
        signature: "some_signature",
        work: "some_work"
      },
      props: {
        account_creation_fee: { amount: "1000.000", precision: 3, nai: "@@000000021" },
        maximum_block_size: 65536,
        hbd_interest_rate: 1000
      }
    });
  });

  test('POW2 Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: pow2 = {
        work: {
          pow2: {
            input: {
              worker_account: "example_worker",
              prev_block: "0000000000000000",
              nonce: '123456789'
            },
            pow_summary: 0
          }
        },
        new_owner_key: '000000000000',
        props: {
          account_creation_fee: {
            amount: "3000",
            precision: 3,
            nai: "@@000000013"
          },
          maximum_block_size: 65536,
          hbd_interest_rate: 1000
        }
      };

      const op: operation = { pow2: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      work: {
        pow2: {
          input: {
            worker_account: "example_worker",
            prev_block: "0000000000000000",
            nonce: '123456789'
          },
          pow_summary: 0
        }
      },
      new_owner_key: '000000000000',
      props: {
        account_creation_fee: {
          amount: "3000",
          precision: 3,
          nai: "@@000000013"
        },
        maximum_block_size: 65536,
        hbd_interest_rate: 1000
      }
    });
  });

  test('Limit Order Create Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
     const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: limit_order_create = {
        owner: "user123",
        orderid: 98765,
        amount_to_sell: {
          amount: "100",
          precision: 3,
          nai: "@@000000021"
        },
        min_to_receive: {
          amount: "200",
          precision: 3,
          nai: "@@000000013"
        },
        fill_or_kill: true,
        expiration: "2023-12-01T00:00:00"
      };

      const op: operation = { limit_order_create: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      owner: "user123",
      orderid: 98765,
      amount_to_sell: {
        amount: "100",
        precision: 3,
        nai: "@@000000021"
      },
      min_to_receive: {
        amount: "200",
        precision: 3,
        nai: "@@000000013"
      },
      fill_or_kill: true,
      expiration: "2023-12-01T00:00:00"
    });
  });

  test('Limit Order Create 2 Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: limit_order_create2 = {
        owner: "user123",
        orderid: 789,
        amount_to_sell: {
          amount: "1000",
          precision: 3,
          nai: "@@000000021"
        },
        fill_or_kill: true,
        exchange_rate: {
          base: {
            amount: "2000",
            precision: 3,
            nai: "@@000000021"
          },
          quote: {
            amount: "500",
            precision: 3,
            nai: "@@000000013"
          }
        },
        expiration: "2023-12-01T00:00:00"
      };

      const op: operation = { "limit_order_create2" : testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      owner: "user123",
      orderid: 789,
      amount_to_sell: {
        amount: "1000",
        precision: 3,
        nai: "@@000000021"
      },
      fill_or_kill: true,
      exchange_rate: {
        base: {
          amount: "2000",
          precision: 3,
          nai: "@@000000021"
        },
        quote: {
          amount: "500",
          precision: 3,
          nai: "@@000000013"
        }
      },
      expiration: "2023-12-01T00:00:00"
    });
  });

  test('Limit Order Cancel Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: limit_order_cancel = {
          owner: "user123",
          orderid: 456
      };

      const op: operation = { limit_order_cancel: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({ owner: "user123", orderid: 456 });
  });

  test('Feed Publish Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: feed_publish = {
        publisher: "example_witness",
        exchange_rate: {
          base: {
            amount: "0.345",
            precision: 3,
            nai: "@@000000013"
          },
          quote: {
            amount: "1.000",
            precision: 3,
            nai: "@@000000021"
          }
        }
      };

      const op: operation = { feed_publish: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      publisher: "example_witness",
      exchange_rate: {
        base: {
          amount: "0.345",
          precision: 3,
          nai: "@@000000013"
        },
        quote: {
          amount: "1.000",
          precision: 3,
          nai: "@@000000021"
        }
      }
    });
  });

  test('Escrow Transfer Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: escrow_transfer = {
        from_account: "alice",
        to_account: "bob",
        agent: "charlie",
        escrow_id: 12345,
        hbd_amount: {
          amount: "1000",
          precision: 3,
          nai: "@@000000013"
        },
        hive_amount: {
          amount: "2000",
          precision: 3,
          nai: "@@000000021"
        },
        fee: {
          amount: "50",
          precision: 3,
          nai: "@@000000013"
        },
        ratification_deadline: "2023-09-01T12:00:00",
        escrow_expiration: "2023-12-01T12:00:00",
        json_meta: '{}'
      };

      const op: operation = { escrow_transfer: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "alice",
      to_account: "bob",
      agent: "charlie",
      escrow_id: 12345,
      hbd_amount: {
        amount: "1000",
        precision: 3,
        nai: "@@000000013"
      },
      hive_amount: {
        amount: "2000",
        precision: 3,
        nai: "@@000000021"
      },
      fee: {
        amount: "50",
        precision: 3,
        nai: "@@000000013"
      },
      ratification_deadline: "2023-09-01T12:00:00",
      escrow_expiration: "2023-12-01T12:00:00",
      json_meta: '{}'
    });
  });

  test('Escrow Release Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: escrow_release = {
        from_account: "alice",
        to_account: "bob",
        agent: "charlie",
        who: "alice",
        receiver: "bob",
        escrow_id: 12345,
        hbd_amount: {
          amount: "1000",
          precision: 3,
          nai: "@@000000013"
        },
        hive_amount: {
          amount: "2000",
          precision: 3,
          nai: "@@000000021"
        }
      };

      const op: operation = { escrow_release: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "alice",
      to_account: "bob",
      agent: "charlie",
      who: "alice",
      receiver: "bob",
      escrow_id: 12345,
      hbd_amount: {
        amount: "1000",
        precision: 3,
        nai: "@@000000013"
      },
      hive_amount: {
        amount: "2000",
        precision: 3,
        nai: "@@000000021"
      }
    });
  });

  test('Escrow Dispute Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: escrow_dispute = {
        from_account: "alice",
        to_account: "bob",
        agent: "charlie",
        who: "alice",
        escrow_id: 101
      };

      const op: operation = { escrow_dispute: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "alice",
      to_account: "bob",
      agent: "charlie",
      who: "alice",
      escrow_id: 101
    });
  });

  test('Escrow Approve Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: escrow_approve = {
        from_account: "sender",
        to_account: "receiver",
        agent: "escrow_agent",
        who: "receiver",
        escrow_id: 123456,
        approve: true
      };

      const op: operation = { escrow_approve: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "sender",
      to_account: "receiver",
      agent: "escrow_agent",
      who: "receiver",
      escrow_id: 123456,
      approve: true
    });
  });

  test('Delete Comment Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: delete_comment = {
        author: "example_user",
        permlink: "example_post"
      };

      const op: operation = { delete_comment: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      author: "example_user",
      permlink: "example_post"
    });
  });

  test('Delegate Vesting Shares Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: delegate_vesting_shares = {
        delegator: "user1",
        delegatee: "user2",
        vesting_shares: {
          amount: "1000",
          precision: 3,
          nai: "1234567890"
        }
      };

      const op: operation = { delegate_vesting_shares: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      delegate_vesting_shares: {
        delegator: "user1",
        delegatee: "user2",
        vesting_shares: {
          amount: "1000",
          precision: 3,
          nai: "1234567890"
        }
      }
    });
  });

  test('Decline Voting Rights Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: decline_voting_rights = {
        account: "example_user",
        decline: true
      };

      const op: operation = { decline_voting_rights: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account: "example_user",
      decline: true
    });
  });

  test('Custom Operation Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: custom = {
        required_auths: ["user1", "user2"],
        id: 123,
        data: "data_payload"
      };

      const op: operation = { custom: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      required_auths: ["user1", "user2"],
      id: 123,
      data: "data_payload"
    });
  });

  test('Custom JSON Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: custom_json = {
        required_auths: [],
        required_posting_auths: ["example_user"],
        id: "follow",
        json: "{\"follower\":\"example_user\",\"following\":\"target_user\",\"action\":\"follow\"}"
      };

      const op: operation = { custom_json: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      required_auths: [],
      required_posting_auths: ["example_user"],
      id: "follow",
      json: "{\"follower\":\"example_user\",\"following\":\"target_user\",\"action\":\"follow\"}"
    });
  });

  test('Create Proposal Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: create_proposal = {
        creator: "alice",
        receiver: "bob",
        start_date: "2023-09-01T00:00:00",
        end_date: "2023-12-01T00:00:00",
        daily_pay: {
          amount: "100.000",
          precision: 3,
          nai: "@@000000013"
        },
        subject: "Development Proposal",
        permlink: "dev-proposal",
        extensions: []
      };

      const op: operation = { create_proposal: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      create_proposal: {
        creator: "alice",
        receiver: "bob",
        start_date: "2023-09-01T00:00:00",
        end_date: "2023-12-01T00:00:00",
        daily_pay: {
          amount: "100.000",
          precision: 3,
          nai: "@@000000013"
        },
        subject: "Development Proposal",
        permlink: "dev-proposal",
        extensions: []
      }
    });
  });

  test('Create Claimed Account Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: create_claimed_account = {
        creator: "alice",
        new_account_name: "bob",
        owner: {
          weight_threshold: 1,
          account_auths: { "account1": 1 },
          key_auths: { "key1": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: { "account2": 1 },
          key_auths: { "key2": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: { "account3": 1 },
          key_auths: { "key3": 1 }
        },
        memo_key: "memo123",
        json_metadata: "",
        extensions: []
      };

      const op: operation = { create_claimed_account: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      creator: "alice",
      new_account_name: "bob",
      owner: {
        weight_threshold: 1,
        account_auths: { "account1": 1 },
        key_auths: { "key1": 1 }
      },
      active: {
        weight_threshold: 1,
        account_auths: { "account2": 1 },
        key_auths: { "key2": 1 }
      },
      posting: {
        weight_threshold: 1,
        account_auths: { "account3": 1 },
        key_auths: { "key3": 1 }
      },
      memo_key: "memo123",
      json_metadata: "",
      extensions: []
    });
  });

  test('Convert Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: convert = {
        owner: "alice",
        requestid: 123,
        amount: {
          amount: "1000.000",
          precision: 3,
          nai: "@@000000013"
        }
      };

      const op: operation = { convert: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      owner: "alice",
      requestid: 123,
      amount: {
        amount: "1000.000",
        precision: 3,
        nai: "@@000000013"
      }
    });
  });

  test('Comment Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: comment = {
        parent_author: "",
        parent_permlink: "travel",
        author: "user123",
        permlink: "my-first-post",
        title: "My First Post",
        body: "Hello, this is my first post on the platform!",
        json_metadata: JSON.stringify({ app: "peakd/2023.2.3", format: "markdown", tags: ["introduction", "firstpost"] })
      };

      const op: operation = { comment: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      parent_author: "",
      parent_permlink: "travel",
      author: "user123",
      permlink: "my-first-post",
      title: "My First Post",
      body: "Hello, this is my first post on the platform!",
      json_metadata: '{"app":"peakd/2023.2.3","format":"markdown","tags":["introduction","firstpost"]}'
    });
  });

  test('Comment Options Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: comment_options = {
        author: "example_author",
        permlink: "example-permlink",
        max_accepted_payout: { amount: "1000000", precision: 3, nai: "@@000000013" },
        percent_hbd: 10000,
        allow_votes: true,
        allow_curation_rewards: true,
        extensions: [{
          comment_payout_beneficiaries: {
            beneficiaries: [
              { account: "beneficiary1", weight: 5000 },
              { account: "beneficiary2", weight: 5000 }
            ]
          }
        }]
      };

      const op: operation = { comment_options: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      author: "example_author",
      permlink: "example-permlink",
      max_accepted_payout: { amount: "1000000", precision: 3, nai: "@@000000013" },
      percent_hbd: 10000,
      allow_votes: true,
      allow_curation_rewards: true,
      extensions: [{
        comment_payout_beneficiaries: {
          beneficiaries: [
            { account: "beneficiary1", weight: 5000 },
            { account: "beneficiary2", weight: 5000 }
          ]
        }
      }]
    });
  });

  test('Collateralized Convert Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: collateralized_convert = {
        owner: "exampleUser",
        requestid: 12345,
        amount: {
          amount: "100.000",
          precision: 3,
          nai: "@@000000021"
        }
      };

      const op: operation = { collateralized_convert: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      owner: "exampleUser",
      requestid: 12345,
      amount: {
        amount: "100.000",
        precision: 3,
        nai: "@@000000021"
      }
    });
  });

  test('Claim Reward Balance Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: claim_reward_balance = {
        account: "alice",
        reward_hive: { amount: "100.000", precision: 3, nai: "@@000000021" },
        reward_hbd: { amount: "50.000", precision: 3, nai: "@@000000013" },
        reward_vests: { amount: "200.000", precision: 6, nai: "@@000000037" }
      };

      const op: operation = { claim_reward_balance: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account: "alice",
      reward_hive: { amount: "100.000", precision: 3, nai: "@@000000021" },
      reward_hbd: { amount: "50.000", precision: 3, nai: "@@000000013" },
      reward_vests: { amount: "200.000", precision: 6, nai: "@@000000037" }
    });
  });

  test('Claim Account Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: claim_account = {
        creator: "user123",
        fee: {
          amount: "1000",
          precision: 3,
          nai: "@@000000021"
        },
        extensions: []
      };

      const op: operation = { claim_account: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      creator: "user123",
      fee: {
        amount: "1000",
        precision: 3,
        nai: "@@000000021"
      },
      extensions: []
    });
  });

  test('Change Recovery Account Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: change_recovery_account = {
        account_to_recover: "example_user",
        new_recovery_account: "new_recovery_account",
        extensions: []
      };

      const op: operation = { change_recovery_account: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      change_recovery_account: {
        account_to_recover: "example_user",
        new_recovery_account: "new_recovery_account",
        extensions: []
      }
    });
  });

  test('Cancel Transfer From Savings Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: cancel_transfer_from_savings = {
        from_account: "alice",
        request_id: 1234
      };

      const op: operation = { cancel_transfer_from_savings: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      from_account: "alice",
      request_id: 1234
    });
  });

  test('Account Witness Vote Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_witness_vote = {
        account: "user123",
        witness: "witness456",
        approve: true
      };

      const op: operation = { account_witness_vote: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account_witness_vote: {
        account: "user123",
        witness: "witness456",
        approve: true
      }
    });
  });

  test('Account Witness Proxy Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_witness_proxy = {
        account: "user1",
        proxy: "user2"
      };

      const op: operation = { account_witness_proxy: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account: "user1",
      proxy: "user2"
    });
  });

  test('Account Update2 Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_update2 = {
        account: "example_account",
        owner: {
          weight_threshold: 1,
          account_auths: {"account_name_1": 1},
          key_auths: {"first_key": 1}
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {"active_key": 1}
        },
        posting: {
          weight_threshold: 2,
          account_auths: {"account_name_2": 1},
          key_auths: {"posting_key1": 1, "posting_key2": 1}
        },
        memo_key: "memo_key_example",
        json_metadata: "{}",
        posting_json_metadata: "{}",
        extensions: []
      };

      const op: operation = {account_update2: testedOp};
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account: "example_account",
      owner: {
        weight_threshold: 1,
        account_auths: {"account_name_1": 1},
        key_auths: {"first_key": 1}
      },
      active: {
        weight_threshold: 1,
        account_auths: {},
        key_auths: {"active_key": 1}
      },
      posting: {
        weight_threshold: 2,
        account_auths: {"account_name_2": 1},
        key_auths: {"posting_key1": 1, "posting_key2": 1}
      },
      memo_key: "memo_key_example",
      json_metadata: "{}",
      posting_json_metadata: "{}",
      extensions: []
    });
  });

  test('Account Update Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_update = {
        account: "exampleUser",
        owner: {
          weight_threshold: 1,
          account_auths: { "accountName1": 1, "accountName2": 2 },
          key_auths: { "key1": 1, "key2": 2 }
        },
        active: {
          weight_threshold: 1,
          account_auths: { "anotherAccount1": 1, "anotherAccount2": 2 },
          key_auths: { "activeKey1": 1, "activeKey2": 2 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: { "postingAccount1": 3, "postingAccount2": 4 },
          key_auths: { "postingKey1": 3, "postingKey2": 4 }
        },
        memo_key: "memoKeyExample",
        json_metadata: "{}"
      };

      const op: operation = { account_update: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account: "exampleUser",
      owner: {
        weight_threshold: 1,
        account_auths: { "accountName1": 1, "accountName2": 2 },
        key_auths: { "key1": 1, "key2": 2 }
      },
      active: {
        weight_threshold: 1,
        account_auths: { "anotherAccount1": 1, "anotherAccount2": 2 },
        key_auths: { "activeKey1": 1, "activeKey2": 2 }
      },
      posting: {
        weight_threshold: 1,
        account_auths: { "postingAccount1": 3, "postingAccount2": 4 },
        key_auths: { "postingKey1": 3, "postingKey2": 4 }
      },
      memo_key: "memoKeyExample",
      json_metadata: "{}"
    });
  });

  test('Account Create Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_create = {
        fee: {
          amount: "3",
          precision: 3,
          nai: "@@000000021"
        },
        creator: "existing_account",
        new_account_name: "new_account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "HIVE6k9a45YAq...": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "HIVE5k9b55YDf...": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "HIVE4j8d60Yes...": 1 }
        },
        memo_key: "HIVE7d9g45Xdz...",
        json_metadata: "{}"
      };

      const op: operation = { account_create: testedOp };
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account_create: {
        fee: {
          amount: "3",
          precision: 3,
          nai: "@@000000021"
        },
        creator: "existing_account",
        new_account_name: "new_account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "HIVE6k9a45YAq...": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "HIVE5k9b55YDf...": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "HIVE4j8d60Yes...": 1 }
        },
        memo_key: "HIVE7d9g45Xdz...",
        json_metadata: "{}"
      }
    });
  });

  test('Account Creation with Delegation Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = new chain.TransactionBuilder("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_create_with_delegation = {
        fee: {amount: "1000", precision: 3, nai: "@@000000021"},
        delegation: {amount: "50000", precision: 6, nai: "@@000000037"},
        creator: "test_creator",
        new_account_name: "new_account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        memo_key: "STM5j1234567890",
        json_metadata: "",
        extensions: []
      };

      const op: operation = {account_create_with_delegation: testedOp};
      txB.push(op).validate();

      return txB.build().operations[0];
    });

    expect(retVal).toStrictEqual({
      account_create_with_delegation: {
        fee: {amount: "1000", precision: 3, nai: "@@000000021"},
        delegation: {amount: "50000", precision: 6, nai: "@@000000037"},
        creator: "test_creator",
        new_account_name: "new_account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {}
        },
        memo_key: "STM5j1234567890",
        json_metadata: "",
        extensions: []
      }
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});