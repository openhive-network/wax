import { expect } from '@playwright/test';
import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';

import { test } from '../assets/jest-helper';

import { DEFAULT_STORAGE_ROOT } from '@hiveio/beekeeper/node';
import fs from 'fs';

let browser!: ChromiumBrowser;

const app = `${process.env.npm_package_name}/${process.env.npm_package_version}`;

test.describe('Wax operation factories tests', () => {
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

    await page.goto('http://localhost:8080/wasm/__tests__/assets/test.html', { waitUntil: 'load' });
  });

  test('Should be able to initialize useBuilder on WitnessSetPropertiesBuilder with basic witness_set_properties_operation', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.WitnessSetPropertiesBuilder, builder => {
        builder
          .setNewSigningKey('STM6TqSJaS1aRj6p6yZEo5xicX7bvLhrfdVqi5ToNrKxHU3FRBEdW')
          .setAccountCreationFee(5000)
          .setAccountSubsidyBudget(1000)
          .setAccountSubsidyDecay(1000)
          .setHBDExchangeRate(1000, 1000)
          .setHBDInterestRate(1000)
          .setMaximumBlockSize(1000)
          .setUrl('https://hive.io');
      }, 'gtg', 'STM5RqVBAVNp5ufMCetQtvLGLJo7unX9nyCBMMrTXRWQ9i1Zzzizh');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'witness_set_properties_operation',
      value: {
        owner: 'gtg',
        props: [
          [
            "account_creation_fee",
            "88130000000000002320bcbe",
          ],
          [
            "account_subsidy_budget",
            "e8030000",
          ],
          [
            "account_subsidy_decay",
            "e8030000",
          ],
          [
            "hbd_exchange_rate",
            "e8030000000000000320bcbee8030000000000002320bcbe",
          ],
          [
            "hbd_interest_rate",
            "e803",
          ],
          [
            "key",
            "3553544d355271564241564e703575664d4365745174764c474c4a6f37756e58396e7943424d4d7254585257513969315a7a7a697a68",
          ],
          [
            "maximum_block_size",
            "e8030000",
          ],
          [
            "new_signing_key",
            "3553544d365471534a61533161526a367036795a456f35786963583762764c6872666456716935546f4e724b78485533465242456457",
          ],
          [
            "url",
            "0f68747470733a2f2f686976652e696f",
          ]
        ]
      }
    });
  });

  test('Should be able to initialize useBuilder on RecurrentTransferBuilder with basic recurrent_transfer_operation', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.RecurrentTransferBuilder, () => {}, 'alice', 'bob', { amount: '100', precision: 3, nai: '@@000000013' }, 'thanks for the service');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'recurrent_transfer_operation',
      value: {
        amount: {
          amount: '100',
          nai: '@@000000013',
          precision: 3
        },
        executions: 2,
        from: 'alice',
        memo: 'thanks for the service',
        recurrence: 24,
        to: 'bob'
      }
    });
  });

  test('Should be able to add base recurrent_transfer_pair_id extension using RecurrentTransferPairIdBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.RecurrentTransferPairIdBuilder, () => {}, 'alice', 'bob', 12345, { amount: '100', nai: '@@000000021', precision: 3 }, 'monthly subscription', 24, 2);

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'recurrent_transfer_operation',
      value: {
        amount: {
          amount: '100',
          nai: '@@000000021',
          precision: 3
        },
        executions: 2,
        extensions: [{
          type: 'recurrent_transfer_pair_id',
          value: {
            pair_id: 12345
          }
        }],
        from: 'alice',
        memo: 'monthly subscription',
        recurrence: 24,
        to: 'bob'
      }
    });
  });

  test('Properly initialized API should allow generation of a removal operation', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.RecurrentTransferPairIdBuilder, builder => {
        builder.generateRemoval();
      }, 'grace', 'henry', 24680, { amount: '0', precision: 3, nai: '@@000000021' });

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'recurrent_transfer_operation',
      value: {
        from: 'grace',
        to: 'henry',
        amount: { amount: '0', precision: 3, nai: '@@000000021' },
        memo: '',
        recurrence: 24,
        executions: 2,
        extensions: [ { type: 'recurrent_transfer_pair_id', value: { pair_id: 24680 } } ]
      }
    });
  });

  test('Should initialize update proposal builder with mandatory fields only', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.UpdateProposalBuilder, () => {}, '123', 'alice', { amount: '1000', precision: 3, nai: '@@000000013' }, 'Improve UI Design', 'improve-ui');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'update_proposal_operation',
      value: {
        creator: 'alice',
        daily_pay: { amount: '1000', nai: '@@000000013', precision: 3 },
        permlink: 'improve-ui',
        proposal_id: '123',
        subject: 'Improve UI Design'
      }
    });
  });

  test('Should add endDate in update proposal builder when provided', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.UpdateProposalBuilder, () => {}, '123', 'alice', { amount: '1000', precision: 3, nai: '@@000000013' }, 'Improve UI Design', 'improve-ui', '2023-03-14');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'update_proposal_operation',
      value: {
        creator: 'alice',
        daily_pay: { amount: '1000', nai: '@@000000013', precision: 3 },
        extensions: [{
          type: 'update_proposal_end_date',
          value: {
            end_date: '2023-03-14T00:00:00'
          }
        }],
        permlink: 'improve-ui',
        proposal_id: '123',
        subject: 'Improve UI Design'
      }
    });
  });

  test('Should handle edge case in update proposal builder where endDate is given as timestamp', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.UpdateProposalBuilder, () => {}, '123', 'alice', { amount: '1000', precision: 3, nai: '@@000000013' }, 'Improve UI Design', 'improve-ui', 1678917600000);

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'update_proposal_operation',
      value: {
        creator: 'alice',
        daily_pay: { amount: '1000', nai: '@@000000013', precision: 3 },
        extensions: [{
          type: 'update_proposal_end_date',
          value: {
            end_date: '2023-03-15T22:00:00'
          }
        }],
        permlink: 'improve-ui',
        proposal_id: '123',
        subject: 'Improve UI Design'
      }
    });
  });

  test('Should add extensions using RecurrentTransferPairIdBuilder and convert to legacy api', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.RecurrentTransferPairIdBuilder, builder => {
        builder.generateRemoval();
      }, 'alice', 'bob', 50, { amount: '0', precision: 3, nai: '@@000000021' }, 'monthly subscription', 24, 2);

      console.log(JSON.stringify((tx as any).target));

      return tx.toLegacyApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual([
      'recurrent_transfer',
      {
        amount: '0.000 HIVE',
        executions: 2,
        extensions: [{
          type: 'recurrent_transfer_pair_id',
          value: {
            pair_id: 50
          }
        }],
        from: 'alice',
        memo: 'monthly subscription',
        recurrence: 24,
        to: 'bob'
      }
    ]);
  });

  test('Should be able to convert transaction to legacy api wih endDate property', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.UpdateProposalBuilder, () => {}, '123', 'alice', { amount: '1000', precision: 3, nai: '@@000000013' }, 'Improve UI Design', 'improve-ui', '2023-03-14');

      return tx.toLegacyApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual([
      'update_proposal',
      {
        creator: 'alice',
        daily_pay: '1.000 HBD',
        extensions: [[
          'update_proposal_end_date',
          {
            end_date: '2023-03-14T00:00:00'
          }
        ]],
        permlink: 'improve-ui',
        proposal_id: 123,
        subject: 'Improve UI Design'
      }
    ]);
  });

  test('Should be able to convert transaction for post with beneficiares to legacy api', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ReplyBuilder, builder => {
        builder.addBeneficiaries({ account: 'guest4test7', weight: 40 })
        .pushTags("spam")
        .setDescription("Post with beneficiaries");
      },
        'guest4test',
        'spam',
        'gtg',
        'Post with beneficiaries',
        {},
        'post-with-beneficiaries',
        'Post with beneficiares');

        return tx.toLegacyApi();
    });

    expect(JSON.parse(retVal)).toStrictEqual({
      ref_block_num: 1960,
      ref_block_prefix: 3915120327,
      expiration: "2023-11-09T21:51:27",
      operations: [
        [
          "comment",
          {
            parent_author: "guest4test",
            parent_permlink: "spam",
            author: "gtg",
            permlink: "post-with-beneficiaries",
            title: "Post with beneficiares",
            body: "Post with beneficiaries",
            json_metadata: `{"format":"markdown+html","app":"${app}","tags":["spam"],"description":"Post with beneficiaries"}`
          }
        ],
        [
          "comment_options",
          {
            author: "gtg",
            permlink: "post-with-beneficiaries",
            max_accepted_payout: "1000000.000 HBD",
            percent_hbd: 10000,
            allow_votes: true,
            allow_curation_rewards: true,
            extensions: [
              [ "comment_payout_beneficiaries", { beneficiaries: [ { account: "guest4test7", weight: 40 } ] } ]
            ]
          }
        ]
      ],
      extensions: [],
      signatures: []
    });
  });

  test('Should be able to set percent HBD in ReplyBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ReplyBuilder, builder => {
        builder.setPercentHbd(20)
          .pushTags("spam")
          .setDescription("Set percent");
      },
      'guest4test',
      'spam',
      'gtg',
      'Set percent',
      {},
      'set-percent',
      'set-percent');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Set percent',
          json_metadata: `{"format":"markdown+html","app":"${app}","tags":["spam"],"description":"Set percent"}`,
          parent_author: 'guest4test',
          parent_permlink: 'spam',
          permlink: 'set-percent',
          title: 'set-percent',
        }
      },
      {
        type: 'comment_options_operation',
        value: {
          allow_curation_rewards: true,
          allow_votes: true,
          author: 'gtg',
          max_accepted_payout: { amount: '1000000000', nai: '@@000000013', precision: 3 },
          percent_hbd: 20,
          permlink:'set-percent',
        }
      }
    ]);
  });

  test('Should be able to push images in ReplyBuiler', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ReplyBuilder, builder => {
        builder.pushImages('test2.png')
          .pushTags("spam")
          .pushImages("test.png")
          .setDescription("Push Images");
      },
      'guest4test',
      'spam',
      'gtg',
      'Push images',
      {},
      'push-images',
      'push-images');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Push images',
          json_metadata: `{"format":"markdown+html","app":"${app}","image":["test2.png","test.png"],"tags":["spam"],"description":"Push Images"}`,
          parent_author: 'guest4test',
          parent_permlink: 'spam',
          permlink: 'push-images',
          title: 'push-images',
        }
      }
    ]);
  });

  test('Should be able to set category in ArticleBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.setCategory('test-category')
          .pushTags("spam")
          .setDescription("Post with category");
      },
      'gtg',
      'Post with category',
      'Post with category',
      {},
      'post-with-category');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Post with category',
          json_metadata: `{"format":"markdown+html","app":"${app}","tags":["spam"],"description":"Post with category"}`,
          parent_author: "",
          parent_permlink: "test-category",
          permlink: 'post-with-category',
          title: 'Post with category'
        }
      }
    ]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});

