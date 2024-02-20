import { ChromiumBrowser, ConsoleMessage, chromium } from 'playwright';
import { expect } from '@playwright/test';

import { DEFAULT_STORAGE_ROOT } from "@hive/beekeeper/node";
import fs from "fs";

import { test } from '../assets/jest-helper';

import { initminerAccountApi, naiAsset, serialization_sensitive_transaction, serialization_sensitive_transaction_proto, transfer_operation, vote_operation } from "../assets/data.protocol";
import { WaxFormattable } from '../../dist/lib/node';

let browser!: ChromiumBrowser;

test.describe('Wax object interface formatters tests', () => {
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

    await page.goto("http://localhost:8080/wasm/__tests__/assets/test-chain.html", { waitUntil: "load" });
    await page.waitForFunction(() => waxScriptLoaded); // Wait until async scripts load
  });

  test('Should be able to format numbers using default formatters from hive chain interface', async({ dual }) => {
    const retVal = await dual(() => {
      return [
        chain.formatter.formatNumber(76543212345678, 3, "en-US"),
        chain.formatter.formatNumber(76543212345678, 2, "en-US"),
        chain.formatter.formatNumber(76543212345678, 0, "en-US"),
        chain.formatter.formatNumber(76543212345678, undefined, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), 3, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), 2, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), 0, "en-US"),
        chain.formatter.formatNumber(BigInt(76543212345678), undefined, "en-US"),
        chain.formatter.formatNumber("76543212345678", 3, "en-US"),
        chain.formatter.formatNumber("76543212345678", 2, "en-US"),
        chain.formatter.formatNumber("76543212345678", 0, "en-US"),
        chain.formatter.formatNumber("76543212345678", undefined, "en-US"),
        chain.formatter.formatNumber("765432123.4567", 3, "en-US"),
        chain.formatter.formatNumber("765432123.4567", 2, "en-US"),
        chain.formatter.formatNumber("765432123.4567", 0, "en-US"),
        chain.formatter.formatNumber("765432123.4567", undefined, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", 3, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", 2, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", 0, "en-US"),
        chain.formatter.formatNumber("-76543212.3456", undefined, "en-US"),
        chain.formatter.formatNumber("0.3456",         3, "en-US"),
        chain.formatter.formatNumber("0.3456",         2, "en-US"),
        chain.formatter.formatNumber("0.3456",         0, "en-US"),
        chain.formatter.formatNumber("0.3456",         undefined, "en-US"),
        chain.formatter.formatNumber("0.1",            3, "en-US"),
        chain.formatter.formatNumber("0.1",            2, "en-US"),
        chain.formatter.formatNumber("0.1",            0, "en-US"),
        chain.formatter.formatNumber("0.1",            undefined, "en-US"),
        chain.formatter.formatNumber("0",              3, "en-US"),
        chain.formatter.formatNumber("0",              2, "en-US"),
        chain.formatter.formatNumber("0",              0, "en-US"),
        chain.formatter.formatNumber("0",              undefined, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       3, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       2, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       0, "en-US"),
        chain.formatter.formatNumber(Number.NaN,       undefined, "en-US")
      ];
    });

    expect(retVal).toStrictEqual([
      "76,543,212,345,678.000",
      "76,543,212,345,678.00",
      "76,543,212,345,678",
      "76,543,212,345,678",
      "76,543,212,345,678.000",
      "76,543,212,345,678.00",
      "76,543,212,345,678",
      "76,543,212,345,678",
      "76,543,212,345,678.000",
      "76,543,212,345,678.00",
      "76,543,212,345,678",
      "76,543,212,345,678",
      "765,432,123.456",
      "765,432,123.45",
      "765,432,123",
      "765,432,123.4567",
      "-76,543,212.345",
      "-76,543,212.34",
      "-76,543,212",
      "-76,543,212.3456",
      "0.345",
      "0.34",
      "0",
      "0.3456",
      "0.100",
      "0.10",
      "0",
      "0.1",
      "0.000",
      "0.00",
      "0",
      "0",
      "0.000",
      "0.00",
      "0",
      "0"
    ]);
  });

  test('Should be able to format asset using default formatters from hive chain interface', async({ dual }) => {
    const retVal = await dual((naiAsset) => {
      return chain.waxify`Amount: ${naiAsset}`;
    }, naiAsset);

    expect(retVal).toBe("Amount: 300.000 HIVE");
  });

  test('Should be able to format asset using default formatters from hive chain interface nad keep the original object immutable', async({ dual }) => {
    const retVal = await dual((naiAsset) => {
      const inputObject = { naiAsset };

      return {
        input: inputObject,
        output: chain.formatter.format(inputObject)
      };
    }, naiAsset);

    expect(retVal.input).toStrictEqual({ naiAsset });
    expect(retVal.output).toStrictEqual({ naiAsset: "300.000 HIVE" });
  });

  test('Should be able to format transaction using default formatters from hive chain interface', async({ dual }) => {
    const retVal = await dual((serialization_sensitive_transaction) => {
      const tx = JSON.parse(serialization_sensitive_transaction);

      return chain.waxify`Tx: #${tx}`;
    }, serialization_sensitive_transaction);

    expect(retVal).toBe("Tx: #3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to format protobuf transaction using default formatters from hive chain interface', async({ dual }) => {
    const retVal = await dual((serialization_sensitive_transaction_proto) => {
      return chain.waxify`Tx: #${serialization_sensitive_transaction_proto}`;
    }, serialization_sensitive_transaction_proto);

    expect(retVal).toBe("Tx: #3725c81634f152011e2043eb7119911b953d4267");
  });

  test('Should be able to extend formatter with custom options from hive chain interface', async({ dual }) => {
    const retVal = await dual((serialization_sensitive_transaction) => {
      const tx = JSON.parse(serialization_sensitive_transaction);

      const formatter = chain.formatter.extend({ transaction: { displayAsId: false } });

      return formatter.format(tx);
    }, serialization_sensitive_transaction);

    expect(
      retVal
    ).toStrictEqual({
      ref_block_num: 1959,
      ref_block_prefix: 3625727107,
      expiration: "2023-11-09T22:01:24",
      operations: [
        {
          type: "transfer_operation",
          value: {
            from: "oneplus7",
            to: "kryptogames",
            amount: "300.000 HIVE", // !! Amount formatted
            memo: "Roll under 50 4d434bd943616"
          }
        }
      ],
      extensions: []
    });
  });

  test('Should be able to retrieve account from the API and format it using default formatter from the hive chain interface', async({ dual }) => {
    const retVal = await dual(async() => {
      const response = await chain.api.database_api.find_accounts({ accounts: [ "initminer" ] });

      return chain.formatter.extend({ asset: { appendTokenName: true, formatAmount: true, locales: "en-US" } }).format(response.accounts[0]);
    });

    expect(
      retVal
    ).toEqual(initminerAccountApi);
  });

  test('Should be able to format values using custom formatters extended from hive chain interface', () => {
    class MyFormatters {
      myFunction(value) {
        return value.toString();
      }

      @WaxFormattable()
      myCustomProp({ source }) {
        return this.myFunction(source.myCustomProp);
      }
    }

    const formatter = chain.formatter.extend(MyFormatters);
    const data = {
      myCustomProp: 12542
    };

    expect(
      formatter.waxify`MyData: ${data}`
    ).toBe("MyData: 12542");
  });

  test('Should be able to match values on properties using custom formatters extended from hive chain interface', () => {
    class OperationsFormatter {
      @WaxFormattable({ matchProperty: "type", matchValue: "transfer_operation" })
      public transferOperationFormatter({ source }): string {
        return `${source.value.from} transferred ${chain.waxify`${source.value.amount!}`} to ${source.value.to}`;
      }

      @WaxFormattable({ matchProperty: "type", matchValue: "vote_operation" })
      public voteOperationFormatter({ source }): string {
        return `${source.value.voter} voted on @${source.value.author}/${source.value.permlink}`;
      }
    }

    const formatter = chain.formatter.extend(OperationsFormatter);

    const ops = [ transfer_operation, vote_operation ];

    expect(
      formatter.format(ops)
    ).toStrictEqual([
      "oneplus7 transferred 300.000 HIVE to kryptogames",
      "otom voted on @c0ff33a/ewxhnjbj"
    ]);
  });

  test.afterAll(async () => {
    await browser.close();
  });
});
