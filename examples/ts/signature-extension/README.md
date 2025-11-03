# signature-extension

Important changes to make parcel work:

- Add `@parcel/transformer-raw` to your `.parcelrc` config to handle wasm files:

```diff
{
  "extends": "@parcel/config-default",
  "transformers": {
+    "*.wasm": ["@parcel/transformer-raw"]
  }
}
```

This example presents different ways of implementing 3rd party apps authorization using wax

To test this example:

1. Install keychain/PeakVault extension
2. Configure wallets by adding an alternative node specific to mirrornet instance having chainID: 4200000000000000000000000000000000000000000000000000000000000000 and API endpoint: https://api.fake.openhive.network
3. Import `keychainsigner` posting key to your wallet (it is printed on the page)
4. Install dependencies: `pnpm install`
5. Run parcel: `pnpm test:manual`
6. Goto [http://localhost:1234](http://localhost:1234), sign the transaction and check logs
