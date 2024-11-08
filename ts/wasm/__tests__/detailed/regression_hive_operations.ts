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
  vote,
  withdraw_vesting,
  witness_block_approve,
  witness_set_properties,
  witness_update
} from "../../dist/bundle/index-full";

let browser!: ChromiumBrowser;

test.describe('Wax transaction hive operations regression tests', () => {
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
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: vote = {
        voter: "alice",
        author: "bob",
        permlink: "example-post",
        weight: 10000
      };

      const op: operation = { vote: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      vote: {
        author: "bob",
        permlink: "example-post",
        voter: "alice",
        weight: 10000
      }
    });
  });

  test('Witness Update Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: witness_update = {
        fee: {
          amount: "0",
          precision: 3,
          nai: "@@000000021"
        },
        url: "https://alice.example.com",
        owner: "alice",
        props: {
          hbd_interest_rate: 1000,
          maximum_block_size: 65536,
          account_creation_fee: {
            amount: "100000",
            precision: 3,
            nai: "@@000000021"
          },
        },
        block_signing_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh"
      };

      const op: operation = { witness_update: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      witness_update: {
        fee: {
          amount: "0",
          precision: 3,
          nai: "@@000000021"
        },
        url: "https://alice.example.com",
        owner: "alice",
        props: {
          hbd_interest_rate: 1000,
          maximum_block_size: 65536,
          account_creation_fee: {
            amount: "100000",
            precision: 3,
            nai: "@@000000021"
          },
        },
        block_signing_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh"
      }
    });
  });

  test('Witness Set Properties Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: witness_set_properties = {
          owner: "example-witness",
          props: {
              maximum_block_size: "00000100",
              account_creation_fee: "88130000000000002320bcbe",
              url: "0f68747470733a2f2f686976652e696f",
              key: "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83"
          },
          extensions: []
      };

      const op: operation = { witness_set_properties: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      witness_set_properties: {
        owner: "example-witness",
        props: {
          maximum_block_size: "00000100",
          account_creation_fee: "88130000000000002320bcbe",
          url: "0f68747470733a2f2f686976652e696f",
          key: "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83"
        },
        extensions: []
      }
    });
  });

  test('Witness Block Aprove Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const tx = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const protoMessage: witness_block_approve = {
          witness: "test-witness",
          block_id: "123456789"
      };

      const op: operation = { witness_block_approve: protoMessage }

      tx.pushOperation(op).validate();

      return tx.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      witness_block_approve: {
        witness: "test-witness",
        block_id: "123456789"
      }
      });
  });

  test('Withdraw Vesting Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: withdraw_vesting = {
        account: "user123",
        vesting_shares: {
          amount: "100000000",
          precision: 6,
          nai: "@@000000037"
        }
      };

      const op: operation = { withdraw_vesting: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      withdraw_vesting: {
        account: "user123",
        vesting_shares: {
          amount: "100000000",
          nai: "@@000000037",
          precision: 6
        }
      }
    });
  });

  test('Update Proposal Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: update_proposal = {
        proposal_id: '123456789',
        creator: "creator-account",
        daily_pay: {
          amount: '100000',
          precision: 3,
          nai: '@@000000013'
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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      update_proposal: {
        proposal_id: '123456789',
        creator: "creator-account",
        daily_pay: {
          amount: '100000',
          precision: 3,
          nai: '@@000000013'
        },
        subject: 'Updated Proposal Subject',
        permlink: 'updated-proposal-permlink',
        extensions: [{
          update_proposal_end_date: {
            end_date: '2024-01-01T00:00:00'
          }
        }]
      }
    });
  });

  test('Update Proposal Votes Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: update_proposal_votes = {
        voter: "some-user",
        proposal_ids: ['1001', '1002'],
        approve: true,
        extensions: []
      };

      const op: operation = { update_proposal_votes: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      update_proposal_votes: {
        voter: "some-user",
        proposal_ids: ['1001', '1002'],
        approve: true,
        extensions: []
      }
    });
  });

  test('Transfer Operation Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: transfer = {
        from_account: "alice",
        to_account: "bob",
        amount: {
          amount: "100000",
          precision: 3,
          nai: "@@000000021"
        },
        memo: "Here's your payment"
      };

      const op: operation = { transfer: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      transfer: {
        from_account: "alice",
        to_account: "bob",
        amount: {
          amount: "100000",
          precision: 3,
          nai: "@@000000021"
        },
        memo: "Here's your payment"
      }
    });
  });

  test('Transfer To Vesting Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: transfer_to_vesting = {
        from_account: "sender-account",
        to_account: "receiver-account",
        amount: {
          amount: "1000",
          precision: 3,
          nai: "@@000000021"
        }
      };

      const op: operation = { transfer_to_vesting: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      transfer_to_vesting: {
        from_account: "sender-account",
        to_account: "receiver-account",
        amount: {
          amount: "1000",
          precision: 3,
          nai: "@@000000021"
        }
      }
    });
  });

  test('Transfer To Savings Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      transfer_to_savings: {
        from_account: "alice",
        to_account: "bob",
        amount: {
          amount: "1000",
          precision: 3,
          nai: "@@000000013"
        },
        memo: "Saving for future"
      }
    });
  });

  test('Transfer From Savings Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
    const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      transfer_from_savings: {
        from_account: "alice",
        request_id: 12345,
        to_account: "bob",
        amount: {
          amount: "1000",
          precision: 3,
          nai: "@@000000021"
        },
        memo: "Rent payment"
      }
    });
  });

  test('Transaction Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      return txB.transaction;
    });

    expect(retVal).toStrictEqual({
      ref_block_num: 51109,
      ref_block_prefix: 2785934438,
      expiration: "2023-08-01T15:38:48",
      operations: [],
      extensions: [],
      signatures: []
    });
  });

  test('Set Withdraw Vesting Route Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: set_withdraw_vesting_route = {
        from_account: "from-user",
        to_account: "to-user",
        percent: 50,
        auto_vest: true
      };

      const op: operation = { set_withdraw_vesting_route: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      set_withdraw_vesting_route: {
        from_account: "from-user",
        to_account: "to-user",
        percent: 50,
        auto_vest: true
      }
    });
  });

  test('Request Account Recovery Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: request_account_recovery = {
        recovery_account: "recovery-user",
        account_to_recover: "compromised-user",
        new_owner_authority: {
          weight_threshold: 1,
          account_auths: { "intermediary": 1 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        extensions: []
      };

      const op: operation = { request_account_recovery: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      request_account_recovery: {
        recovery_account: "recovery-user",
        account_to_recover: "compromised-user",
        new_owner_authority: {
          weight_threshold: 1,
          account_auths: { "intermediary": 1 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        extensions: []
      }
    });
  });

  test('Remove Proposal Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: remove_proposal = {
        proposal_owner: "user123",
        proposal_ids: ['101', '202'],
        extensions: []
      };

      const op: operation = { remove_proposal: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      remove_proposal: {
        proposal_owner: "user123",
        proposal_ids: ['101', '202'],
        extensions: []
      }
    });
  });

  test('Recurrent Transfer Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      recurrent_transfer: {
        from_account: "sender",
        to_account: "receiver",
        amount: { amount: "1000", precision: 3, nai: "@@000000021" },
        memo: "Monthly subscription",
        recurrence: 720,
        executions: 12,
        extensions: [
          { recurrent_transfer_pair_id: { pair_id: 1 } }
        ]
      }
    });
  });

  test('Recover Account Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: recover_account = {
        account_to_recover: "example-account",
        new_owner_authority: {
          weight_threshold: 1,
          account_auths: { "intermediary": 1 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        recent_owner_authority: {
          weight_threshold: 1,
          account_auths: { "gtg": 1 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        extensions: []
      };

      const op: operation = { recover_account: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      recover_account: {
        account_to_recover: "example-account",
        new_owner_authority: {
          weight_threshold: 1,
          account_auths: { "intermediary": 1 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        recent_owner_authority: {
          weight_threshold: 1,
          account_auths: { "gtg": 1 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        extensions: []
      }
    });
  });

  test('POW Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: pow = {
        work: {
          work: "000000002c131fe666ffc53cd4ac3c1bd4c80298294f7980ea5ffff510d0d472",
          input: "9401eda213a342333f08b5cb78a63e001a94bf3b9b4e4010361dc2ac091d2291",
          worker: "STM56h3LYjBgwFNucK4BNWwzV9S9odoQgtBTo8tW7HSBWQr6B85fG",
          signature: "1fcd252a535a25dfff6bf8207c2c81c27ace3658bc894046cb24c5e01ba13dad76661ece701471f49c8c11b4eabeb586544876495e8e7d6d62e86931a68aa97a67"
        },
        nonce: "2679032206",
        props: {
          hbd_interest_rate: 1000,
          maximum_block_size: 131072,
          account_creation_fee: {
            nai: "@@000000021",
            amount: "1",
            precision: 3
          }
        },
        block_id: "003e9e6a776ccd3c72e6f1d3dc42f8cd5ee7d4bf",
        worker_account: "some-account"
      };

      const op: operation = { pow: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      pow: {
        work: {
          work: "000000002c131fe666ffc53cd4ac3c1bd4c80298294f7980ea5ffff510d0d472",
          input: "9401eda213a342333f08b5cb78a63e001a94bf3b9b4e4010361dc2ac091d2291",
          worker: "STM56h3LYjBgwFNucK4BNWwzV9S9odoQgtBTo8tW7HSBWQr6B85fG",
          signature: "1fcd252a535a25dfff6bf8207c2c81c27ace3658bc894046cb24c5e01ba13dad76661ece701471f49c8c11b4eabeb586544876495e8e7d6d62e86931a68aa97a67"
        },
        nonce: "2679032206",
        props: {
          hbd_interest_rate: 1000,
          maximum_block_size: 131072,
          account_creation_fee: {
            nai: "@@000000021",
            amount: "1",
            precision: 3
          }
        },
        block_id: "003e9e6a776ccd3c72e6f1d3dc42f8cd5ee7d4bf",
        worker_account: "some-account"
      }
    });
  });

  test('POW2 Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: pow2 = {
        work: {
          pow2: {
            input: {
              worker_account: "example-worker",
              prev_block: "0000000000000000",
              nonce: '123456789'
            },
            pow_summary: 0
          }
        },
        new_owner_key: 'STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r',
        props: {
          account_creation_fee: {
            amount: "3000",
            precision: 3,
            nai: "@@000000021"
          },
          maximum_block_size: 65536,
          hbd_interest_rate: 1000
        }
      };

      const op: operation = { pow2: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      pow2: {
        work: {
          pow2: {
            input: {
              worker_account: "example-worker",
              prev_block: "0000000000000000",
              nonce: '123456789'
            },
            pow_summary: 0
          }
        },
        new_owner_key: 'STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r',
        props: {
          account_creation_fee: {
            amount: "3000",
            precision: 3,
            nai: "@@000000021"
          },
          maximum_block_size: 65536,
          hbd_interest_rate: 1000
        }
      }
    });
  });

  test('Limit Order Create Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
     const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      limit_order_create: {
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
      }
    });
  });

  test('Limit Order Create 2 Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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

      const op: operation = { limit_order_create2 : testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      limit_order_create2: {
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
      }
    });
  });

  test('Limit Order Cancel Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: limit_order_cancel = {
          owner: "user123",
          orderid: 456
      };

      const op: operation = { limit_order_cancel: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      limit_order_cancel: {
        owner: "user123", orderid: 456
      }
    });
  });

  test('Feed Publish Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: feed_publish = {
        publisher: "example-witness",
        exchange_rate: {
          base: {
            amount: "0345",
            precision: 3,
            nai: "@@000000013"
          },
          quote: {
            amount: "1000",
            precision: 3,
            nai: "@@000000021"
          }
        }
      };

      const op: operation = { feed_publish: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      feed_publish: {
        publisher: "example-witness",
        exchange_rate: {
          base: {
            amount: "0345",
            precision: 3,
            nai: "@@000000013"
          },
          quote: {
            amount: "1000",
            precision: 3,
            nai: "@@000000021"
          }
        }
      }
    });
  });

  test('Escrow Transfer Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      escrow_transfer: {
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
      }
    });
  });

  test('Escrow Release Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      escrow_release: {
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
      }
    });
  });

  test('Escrow Dispute Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: escrow_dispute = {
        from_account: "alice",
        to_account: "bob",
        agent: "charlie",
        who: "alice",
        escrow_id: 101
      };

      const op: operation = { escrow_dispute: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      escrow_dispute: {
        from_account: "alice",
        to_account: "bob",
        agent: "charlie",
        who: "alice",
        escrow_id: 101
      }
    });
  });

  test('Escrow Approve Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: escrow_approve = {
        from_account: "sender",
        to_account: "receiver",
        agent: "escrow-agent",
        who: "receiver",
        escrow_id: 123456,
        approve: true
      };

      const op: operation = { escrow_approve: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      escrow_approve: {
        from_account: "sender",
        to_account: "receiver",
        agent: "escrow-agent",
        who: "receiver",
        escrow_id: 123456,
        approve: true
      }
    });
  });

  test('Delete Comment Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: delete_comment = {
        author: "example-user",
        permlink: "example_post"
      };

      const op: operation = { delete_comment: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      delete_comment: {
        author: "example-user",
        permlink: "example_post"
      }
    });
  });

  test('Delegate Vesting Shares Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: delegate_vesting_shares = {
        delegator: "user1",
        delegatee: "user2",
        vesting_shares: {
          amount: "1000",
          precision: 6,
          nai: "@@000000037"
        }
      };

      const op: operation = { delegate_vesting_shares: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      delegate_vesting_shares: {
        delegator: "user1",
        delegatee: "user2",
        vesting_shares: {
          amount: "1000",
          precision: 6,
          nai: "@@000000037"
        }
      }
    });
  });

  test('Decline Voting Rights Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: decline_voting_rights = {
        account: "example-user",
        decline: true
      };

      const op: operation = { decline_voting_rights: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      decline_voting_rights: {
        account: "example-user",
        decline: true
      }
    });
  });

  test('Custom Operation Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: custom = {
        required_auths: ["user1", "user2"],
        id: 123,
        data: "7598a1d3e8cdf938"
      };

      const op: operation = { custom: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      custom: {
        required_auths: ["user1", "user2"],
        id: 123,
        data: "7598a1d3e8cdf938"
      }
    });
  });

  test('Custom JSON Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: custom_json = {
        required_auths: [],
        required_posting_auths: ["example-user"],
        id: "follow",
        json: "{\"follower\":\"example_user\",\"following\":\"target_user\",\"action\":\"follow\"}"
      };

      const op: operation = { custom_json: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      custom_json: {
        required_auths: [],
        required_posting_auths: ["example-user"],
        id: "follow",
        json: "{\"follower\":\"example_user\",\"following\":\"target_user\",\"action\":\"follow\"}"
      }
    });
  });

  test('Create Proposal Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: create_proposal = {
        creator: "alice",
        receiver: "bob",
        start_date: "2023-09-01T00:00:00",
        end_date: "2023-12-01T00:00:00",
        daily_pay: {
          amount: "100000",
          precision: 3,
          nai: "@@000000013"
        },
        subject: "Development Proposal",
        permlink: "dev-proposal",
        extensions: []
      };

      const op: operation = { create_proposal: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      create_proposal: {
        creator: "alice",
        receiver: "bob",
        start_date: "2023-09-01T00:00:00",
        end_date: "2023-12-01T00:00:00",
        daily_pay: {
          amount: "100000",
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
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: create_claimed_account = {
        creator: "alice",
        new_account_name: "bob",
        owner: {
          weight_threshold: 1,
          account_auths: { "account1": 1 },
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: { "account2": 1 },
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: { "account3": 1 },
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        memo_key: "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r",
        json_metadata: "",
        extensions: []
      };

      const op: operation = { create_claimed_account: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      create_claimed_account: {
        creator: "alice",
        new_account_name: "bob",
        owner: {
          weight_threshold: 1,
          account_auths: { "account1": 1 },
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: { "account2": 1 },
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: { "account3": 1 },
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        memo_key: "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r",
        json_metadata: "",
        extensions: []
      }
    });
  });

  test('Convert Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: convert = {
        owner: "alice",
        requestid: 123,
        amount: {
          amount: "1000000",
          precision: 3,
          nai: "@@000000013"
        }
      };

      const op: operation = { convert: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      convert: {
        owner: "alice",
        requestid: 123,
        amount: {
          amount: "1000000",
          precision: 3,
          nai: "@@000000013"
        }
      }
    });
  });

  test('Comment Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      comment: {
        parent_author: "",
        parent_permlink: "travel",
        author: "user123",
        permlink: "my-first-post",
        title: "My First Post",
        body: "Hello, this is my first post on the platform!",
        json_metadata: '{"app":"peakd/2023.2.3","format":"markdown","tags":["introduction","firstpost"]}'
      }
    });
  });

  test('Comment Options Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: comment_options = {
        author: "example-author",
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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      comment_options: {
        author: "example-author",
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
      }
    });
  });

  test('Collateralized Convert Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: collateralized_convert = {
        owner: "example-user",
        requestid: 12345,
        amount: {
          amount: "100000",
          precision: 3,
          nai: "@@000000021"
        }
      };

      const op: operation = { collateralized_convert: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      collateralized_convert: {
        owner: "example-user",
        requestid: 12345,
        amount: {
          amount: "100000",
          precision: 3,
          nai: "@@000000021"
        }
      }
    });
  });

  test('Claim Reward Balance Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: claim_reward_balance = {
        account: "alice",
        reward_hive: { amount: "100000", precision: 3, nai: "@@000000021" },
        reward_hbd: { amount: "50000", precision: 3, nai: "@@000000013" },
        reward_vests: { amount: "200000", precision: 6, nai: "@@000000037" }
      };

      const op: operation = { claim_reward_balance: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      claim_reward_balance: {
        account: "alice",
        reward_hive: { amount: "100000", precision: 3, nai: "@@000000021" },
        reward_hbd: { amount: "50000", precision: 3, nai: "@@000000013" },
        reward_vests: { amount: "200000", precision: 6, nai: "@@000000037" }
      }
    });
  });

  test('Claim Account Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

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
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      claim_account: {
        creator: "user123",
        fee: {
          amount: "1000",
          precision: 3,
          nai: "@@000000021"
        },
        extensions: []
      }
    });
  });

  test('Change Recovery Account Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: change_recovery_account = {
        account_to_recover: "example-user",
        new_recovery_account: "new-recovery",
        extensions: []
      };

      const op: operation = { change_recovery_account: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      change_recovery_account: {
        account_to_recover: "example-user",
        new_recovery_account: "new-recovery",
        extensions: []
      }
    });
  });

  test('Cancel Transfer From Savings Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: cancel_transfer_from_savings = {
        from_account: "alice",
        request_id: 1234
      };

      const op: operation = { cancel_transfer_from_savings: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      cancel_transfer_from_savings: {
        from_account: "alice",
        request_id: 1234
      }
    });
  });

  test('Account Witness Vote Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_witness_vote = {
        account: "user123",
        witness: "witness456",
        approve: true
      };

      const op: operation = { account_witness_vote: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
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
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_witness_proxy = {
        account: "user1",
        proxy: "user2"
      };

      const op: operation = { account_witness_proxy: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      account_witness_proxy: {
        account: "user1",
        proxy: "user2"
      }
    });
  });

  test('Account Update2 Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_update2 = {
        account: "example-account",
        owner: {
          weight_threshold: 1,
          account_auths: {"account-name-1": 1},
          key_auths: {"STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1}
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {"STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1}
        },
        posting: {
          weight_threshold: 2,
          account_auths: {"account-name-2": 1},
          key_auths: {"STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1, "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1}
        },
        memo_key: "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r",
        json_metadata: "{}",
        posting_json_metadata: "{}",
        extensions: []
      };

      const op: operation = {account_update2: testedOp};
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      account_update2: {
        account: "example-account",
        owner: {
          weight_threshold: 1,
          account_auths: {"account-name-1": 1},
          key_auths: {"STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1}
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: {"STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1}
        },
        posting: {
          weight_threshold: 2,
          account_auths: {"account-name-2": 1},
          key_auths: {"STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1, "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1}
        },
        memo_key: "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r",
        json_metadata: "{}",
        posting_json_metadata: "{}",
        extensions: []
      }
    });
  });

  test('Account Update Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_update = {
        account: "example-user",
        owner: {
          weight_threshold: 1,
          account_auths: { "account-name1": 1, "account-name2": 2 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1, "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 2 }
        },
        active: {
          weight_threshold: 1,
          account_auths: { "another-account1": 1, "another-account2": 2 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1, "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 2 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: { "posting-account1": 3, "posting-account2": 4 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 3, "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 4 }
        },
        memo_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh",
        json_metadata: "{}"
      };

      const op: operation = { account_update: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      account_update: {
        account: "example-user",
        owner: {
          weight_threshold: 1,
          account_auths: { "account-name1": 1, "account-name2": 2 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1, "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 2 }
        },
        active: {
          weight_threshold: 1,
          account_auths: { "another-account1": 1, "another-account2": 2 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1, "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 2 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: { "posting-account1": 3, "posting-account2": 4 },
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 3, "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 4 }
        },
        memo_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh",
        json_metadata: "{}"
      }
    });
  });

  test('Account Create Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_create = {
        fee: {
          amount: "3",
          precision: 3,
          nai: "@@000000021"
        },
        creator: "existing-account",
        new_account_name: "new-account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        memo_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh",
        json_metadata: "{}"
      };

      const op: operation = { account_create: testedOp };
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      account_create: {
        fee: {
          amount: "3",
          precision: 3,
          nai: "@@000000021"
        },
        creator: "existing-account",
        new_account_name: "new-account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh": 1 }
        },
        memo_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh",
        json_metadata: "{}"
      }
    });
  });

  test('Account Creation with Delegation Test', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain }) => {
      const txB = chain.createTransactionWithTaPoS("04c1c7a566fc0da66aee465714acee7346b48ac2", "2023-08-01T15:38:48");

      const testedOp: account_create_with_delegation = {
        fee: {amount: "1000", precision: 3, nai: "@@000000021"},
        delegation: {amount: "50000", precision: 6, nai: "@@000000037"},
        creator: "test-creator",
        new_account_name: "new-account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        memo_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh",
        json_metadata: "",
        extensions: []
      };

      const op: operation = {account_create_with_delegation: testedOp};
      txB.pushOperation(op).validate();

      return txB.transaction.operations[0];
    });

    expect(retVal).toStrictEqual({
      account_create_with_delegation: {
        fee: {amount: "1000", precision: 3, nai: "@@000000021"},
        delegation: {amount: "50000", precision: 6, nai: "@@000000037"},
        creator: "test-creator",
        new_account_name: "new-account",
        owner: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        active: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        posting: {
          weight_threshold: 1,
          account_auths: {},
          key_auths: { "STM7zRaYjSZQ3k6UiZ81rxbZtigDhUTuGP4zVZr7NvoCapbuCgN6r": 1 }
        },
        memo_key: "STM5CTaWTCA8DWRjXGy2XNL4otzEZQkQjowxL3f8yToTi8KM6PrFh",
        json_metadata: "",
        extensions: []
      }
    });
  });

  test.afterAll(async () => {
    await browser.close();
  });
});