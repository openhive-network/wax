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
            "881300000000000003535445454d0000",
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
            "e8030000000000000353424400000000e80300000000000003535445454d0000",
          ],
          [
            "hbd_interest_rate",
            "e803",
          ],
          [
            "key",
            "02472d6eb6d691b6de8b103b51ebdf4e128a523946d8cd03d6ded91b1497ee2e83",
          ],
          [
            "maximum_block_size",
            "e8030000",
          ],
          [
            "new_signing_key",
            "02cf69b1f999d133ebbe178a8b4bbf4da356b264dfdc843b1c740378bff8f65b33",
          ],
          [
            "url",
            "0f68747470733a2f2f686976652e696f",
          ]
        ]
      }
    });
  });

  test('Should be able to use WitnessSetPropertiesBuilder with url witness property', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.WitnessSetPropertiesBuilder, builder => {
        builder.setUrl('https://steemit.com/steem/@therealwolf/witness-application-therealwolf-updated');
      }, 'therealwolf', 'STM8kPZiPjyWBjmZVMEPW4Qh2BspKuvKMBjvh9dxpZL7Kv2MGBYzC');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'witness_set_properties_operation',
      value: {
        owner: 'therealwolf',
        props: [
          [
            "key",
            "03fc648d2ac16432f354acc1fe010a3c6567380e4939644deb7a74c6ebbe67da56",
          ],
          [
            "url",
            "4e68747470733a2f2f737465656d69742e636f6d2f737465656d2f407468657265616c776f6c662f7769746e6573732d6170706c69636174696f6e2d7468657265616c776f6c662d75706461746564",
          ]
        ]
      }
    });
  });

  test('Should be able to use WitnessSetPropertiesBuilder with budget and account fee witness properties', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.WitnessSetPropertiesBuilder, builder => {
        builder
          .setAccountCreationFee({ amount: '3000', precision: 3, nai: '@@000000021' })
          .setAccountSubsidyBudget(700);
      }, 'therealwolf', 'STM8kPZiPjyWBjmZVMEPW4Qh2BspKuvKMBjvh9dxpZL7Kv2MGBYzC');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'witness_set_properties_operation',
      value: {
        owner: 'therealwolf',
        props: [
          [
            "account_creation_fee",
            "b80b00000000000003535445454d0000",
          ],
          [
            "account_subsidy_budget",
            "bc020000",
          ],
          [
            "key",
            "03fc648d2ac16432f354acc1fe010a3c6567380e4939644deb7a74c6ebbe67da56"
          ]
        ]
      }
    });
  });

  test('Should be able to use WitnessSetPropertiesBuilder with deacy and budget witness properties', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.WitnessSetPropertiesBuilder, builder => {
        builder
          .setAccountSubsidyBudget(1)
          .setAccountSubsidyDecay(64);
      }, 'emrebeyler', 'STM5ShFW6UPxDRyjG4mVWYiwVWTzkmfL2k7zYoamWz2yJLpEkycju');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'witness_set_properties_operation',
      value: {
        owner: 'emrebeyler',
        props: [
          [
            "account_subsidy_budget",
            "01000000",
          ],
          [
            "account_subsidy_decay",
            "40000000",
          ],
          [
            "key",
            "0249202c30b95aec7506ab719fd602256922b9ca86cc31e01499c4c6339c7292a3"
          ]
        ]
      }
    });
  });

  test('Should be able to use WitnessSetPropertiesBuilder with hbd exchange rate witness property', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.WitnessSetPropertiesBuilder, builder => {
        builder
          .setHBDExchangeRate({ amount: '424', precision: 3, nai: '@@000000013' }, { amount: '1000', precision: 3, nai: '@@000000021' });
      }, 'ctrpch', 'STM5oxZMtLbjgnsZVY2XUi58wriYCF1KUNedCzut4ogNEA19GhbiU');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'witness_set_properties_operation',
      value: {
        owner: 'ctrpch',
        props: [
          [
            "hbd_exchange_rate",
            "a8010000000000000353424400000000e80300000000000003535445454d0000",
          ],
          [
            "key",
            "0279687479456e2f03ca19adab071ba333acb765f83402357e71f5cd8c49bee21b"
          ]
        ]
      }
    });
  });

  test('Should be able to use WitnessSetPropertiesBuilder with all the specific witness properties', async ({ waxTest }) => {
    const retVal = await waxTest(({ chain, wax }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.WitnessSetPropertiesBuilder, builder => {
        builder
          .setAccountCreationFee({ amount: '3000', precision: 3, nai: '@@000000021' })
          .setAccountSubsidyBudget(10000)
          .setAccountSubsidyDecay(3307750)
          .setHBDExchangeRate({ amount: '867', precision: 3, nai: '@@000000013' }, { amount: '1002', precision: 3, nai: '@@000000021' })
          .setHBDInterestRate(0)
          .setMaximumBlockSize(65536)
          .setNewSigningKey('STM7FGmbPEooM5xbME7F2WUG41zGAh6WPzvHMQvTfABEHKfyuGUu7')
          .setUrl('https://guiltyparties.com');
      }, 'guiltyparties', 'STM5oxZMtLbjgnsZVY2XUi58wriYCF1KUNedCzut4ogNEA19GhbiU');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations[0]).toEqual({
      type: 'witness_set_properties_operation',
      value: {
        owner: 'guiltyparties',
        props: [
          [
            "account_creation_fee",
            "b80b00000000000003535445454d0000",
          ],
          [
            "account_subsidy_budget",
            "10270000"
          ],
          [
            "account_subsidy_decay",
            "e6783200"
          ],
          [
            "hbd_exchange_rate",
            "63030000000000000353424400000000ea0300000000000003535445454d0000"
          ],
          [
            "hbd_interest_rate",
            "0000"
          ],
          [
            "key",
            "0279687479456e2f03ca19adab071ba333acb765f83402357e71f5cd8c49bee21b"
          ],
          [
            "maximum_block_size",
            "00000100"
          ],
          [
            "new_signing_key",
            "033695262a25cd5646f7875db0536db3f1b3439d7c86274ec56cce01d91ab6611b"
          ],
          [
            "url",
            "1968747470733a2f2f6775696c7479706172746965732e636f6d"
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

  test('Should be able to set alternative author in ArticleBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.setAlternativeAuthor('initminer');
      },
      'gtg',
      'Set alternative author',
      'Set alternative author',
      {},
      'set-alternative-author');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Set alternative author',
          json_metadata: `{"format":"markdown+html","app":"${app}","author":"initminer"}`,
          parent_author: "",
          parent_permlink: "",
          permlink: 'set-alternative-author',
          title: 'Set alternative author'
        }
      }
    ]);
  });

  test('Should be able to push links in ArticleBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.pushLinks('https://test.com', 'https://test2.com', 'http://test3.com');
      },
      'gtg',
      'Push links',
      'Push links',
      {},
      'push-links');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Push links',
          json_metadata: `{"format":"markdown+html","app":"${app}","links":["https://test.com","https://test2.com","http://test3.com"]}`,
          parent_author: "",
          parent_permlink: "",
          permlink: 'push-links',
          title: 'Push links'
        }
      }
    ]);
  });

  test('Should be able to set max accepted payout in ArticleBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.setMaxAcceptedPayout(chain.hive(100));
      },
      'gtg',
      'Set max accepted payout',
      'Set max accepted payout',
      {},
      'set-max-accepted-payout');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Set max accepted payout',
          json_metadata: `{"format":"markdown+html","app":"${app}"}`,
          parent_author: "",
          parent_permlink: "",
          permlink: 'set-max-accepted-payout',
          title: 'Set max accepted payout'
        }
      },
      {
        type: 'comment_options_operation',
        value: {
          allow_curation_rewards: true,
          allow_votes: true,
          author: 'gtg',
          max_accepted_payout: { amount: '100', nai: '@@000000021', precision: 3 },
          percent_hbd: 10000,
          permlink:'set-max-accepted-payout',
        }
      }
    ]);
  });

  test('Should be able to set allow curation rewards in ArticleBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.setAllowCurationRewards(false);
      },
      'gtg',
      'Set allow curation rewards',
      'Set allow curation rewards',
      {},
      'set-allow-curation-rewards');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Set allow curation rewards',
          json_metadata: `{"format":"markdown+html","app":"${app}"}`,
          parent_author: "",
          parent_permlink: "",
          permlink: 'set-allow-curation-rewards',
          title: 'Set allow curation rewards'
        }
      },
      {
        type: 'comment_options_operation',
        value: {
          allow_curation_rewards: false,
          allow_votes: true,
          author: 'gtg',
          max_accepted_payout: { amount: '1000000000', nai: '@@000000013', precision: 3 },
          percent_hbd: 10000,
          permlink:'set-allow-curation-rewards',
        }
      }
    ]);
  });

  test('Should be able to set allow votes in ArticleBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.setAllowVotes(false);
      },
      'gtg',
      'Set allow votes',
      'Set allow votes',
      {},
      'set-allow-votes');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Set allow votes',
          json_metadata: `{"format":"markdown+html","app":"${app}"}`,
          parent_author: "",
          parent_permlink: "",
          permlink: 'set-allow-votes',
          title: 'Set allow votes'
        }
      },
      {
        type: 'comment_options_operation',
        value: {
          allow_curation_rewards: true,
          allow_votes: false,
          author: 'gtg',
          max_accepted_payout: { amount: '1000000000', nai: '@@000000013', precision: 3 },
          percent_hbd: 10000,
          permlink:'set-allow-votes',
        }
      }
    ]);
  });

  test('Should be able to set format in ArticleBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.setFormat(wax.ECommentFormat.MARKDOWN);
      },
      'gtg',
      'Set format',
      'Set format',
      {},
      'set-format');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'Set format',
          json_metadata: `{"format":"markdown","app":"${app}"}`,
          parent_author: "",
          parent_permlink: "",
          permlink: 'set-format',
          title: 'Set format'
        }
      }
    ]);
  });

  test('Should be able to push and set multiple properites', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder
          .setAllowVotes(false)
          .pushImages('test.png')
          .pushLinks('https://test.com')
          .pushTags('spam')
          .setMaxAcceptedPayout(chain.hive(100))
          .setPercentHbd(20)
          .addBeneficiaries({ account: 'guest4test7', weight: 40 })
          .setDescription('Push links, images, tags, set allow votes, set max accepted payout, set percent HBD, add beneficiaries');
      },
      'gtg',
      'push and set multiple properites',
      'push and set multiple properites',
      {},
      'push-and-set-multiple-properites');

      return tx.toApi();
    });

    expect(JSON.parse(retVal).operations).toStrictEqual([
      {
        type: 'comment_operation',
        value: {
          author: 'gtg',
          body: 'push and set multiple properites',
          json_metadata: `{"format":"markdown+html","app":"${app}","image":["test.png"],"links":["https://test.com"],"tags":["spam"],"description":"Push links, images, tags, set allow votes, set max accepted payout, set percent HBD, add beneficiaries"}`,
          parent_author: "",
          parent_permlink: "",
          permlink: 'push-and-set-multiple-properites',
          title: 'push and set multiple properites'
        }
      },
      {
        type: 'comment_options_operation',
        value: {
          allow_curation_rewards: true,
          allow_votes: false,
          author: 'gtg',
          extensions: [
            {
              type: 'comment_payout_beneficiaries',
              value: {
                beneficiaries: [
                  {
                    account: 'guest4test7',
                    weight: 40
                  }
                ]
              }
            }
          ],
          max_accepted_payout: { amount: '100', nai: '@@000000021', precision: 3 },
          percent_hbd: 20,
          permlink:'push-and-set-multiple-properites',
        }
      }
    ]);
  });

  test('Should be able to retriev number of custom operations that will be push into the TransactionBuilder', async ({ waxTest }) => {
    const retVal = await waxTest(({ wax, chain }) => {
      const tx = new chain.TransactionBuilder('04c507a8c7fe5be96be64ce7c86855e1806cbde3', '2023-11-09T21:51:27');

      tx.useBuilder(wax.ArticleBuilder, builder => {
        builder.setDescription('build transaction');
      },
      'gtg',
      'build transaction',
      'build transaction',
      {},
      'build-transaction');

      return tx.build.length;
    });

    expect(retVal).toStrictEqual(2);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});

