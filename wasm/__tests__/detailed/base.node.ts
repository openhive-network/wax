import { test, expect } from '@playwright/test';

import WaxModule from '../../lib/node';

test.describe('WASM Base tests for Node.js', () => {
  test('Should have global module', async () => {
    expect(typeof WaxModule).toBe('function');
  });

  test('Should be able to create instance of protocol', async () => {
    const provider = await WaxModule();
    new provider.protocol();
  });

  test('Should be able to create instance of proto protocol', async () => {
    const provider = await WaxModule();
    new provider.proto_protocol();
  });
});
