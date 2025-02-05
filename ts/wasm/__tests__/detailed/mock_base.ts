import { expect } from '@playwright/test';

import { test } from '../assets/jest-helper';
import { createServer } from '../assets/proxy-mock-server';
import { JsonRpcMock } from '../assets/api-mock';
import jsonRpcMock from '../assets/mock/jsonRpcMock';
import steem from '../assets/mock/data/steem';
import data4nonexistingAccount from "../assets/mock/data/data4nonexistingaccount";

let closeServer: () => Promise<void>;

test.describe('Wax base mock tests', () => {
  test.beforeAll(async () => {
    closeServer = await createServer(new JsonRpcMock(jsonRpcMock), 'localhost', 8000);
  });

  test('Should be able to find account based on mock interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }) => {
      const foundAccount = await chain.api.database_api.find_accounts({ accounts: ['steem'] });

      return foundAccount;
    });

    expect(retVal).toStrictEqual(steem.result);
  });

  test('Should be able to find NONEXISTING account based on mock interface', async ({ waxTest }) => {
    const retVal = await waxTest(async({ chain }, accountData) => {
      const foundAccount = await chain.api.database_api.find_accounts({ accounts: ['0steem'] }); /// Intentionally use invalid name in Hive

      console.log(JSON.stringify(foundAccount));

      return JSON.stringify(foundAccount) === JSON.stringify(accountData.result);
    }, data4nonexistingAccount);

    expect(retVal).toBe(true);
  });

  test.afterAll(async () => {
    await closeServer();
  });
});
