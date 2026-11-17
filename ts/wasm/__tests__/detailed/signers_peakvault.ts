import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

import { test } from "../assets/jest-helper";

const SIGNATURE = "1f936a9963b3b065e25d40d69fb93cff077e539e7e2eb383537717589830f9a4a949882a448e5ba7c48c5b016caed7260d75f6cf8a8f3adba506b7c2f3a54cba7e";

interface IPeakVaultSigning {
  /** Arguments `window.peakvault.requestSignTx` was called with */
  account: string;
  passedTransaction: any;
  role: string;
  /** `JSON.parse(tx.toLegacyApi())` of the transaction before signing */
  legacy: any;
  sigDigest: string;
  /** Digest of the transaction rebuilt from what Peak Vault received */
  passedSigDigest: string;
  signatures: string[];
}

/** Signs `transactionJson` through PeakVaultProvider in the page, with `window.peakvault` stubbed to record its call */
const signWithStubbedPeakVault = (page: Page, transactionJson: object): Promise<IPeakVaultSigning> =>
  page.evaluate(async ({ transactionJson, signature }) => {
    const { createWaxFoundation } = await import("@hiveio/wax");
    const { default: PeakVaultProvider } = await import("@hiveio/wax-signers-peakvault");

    const base = await createWaxFoundation();
    const tx = base.createTransactionFromJson(transactionJson);
    const legacy = JSON.parse(tx.toLegacyApi());
    const sigDigest = tx.sigDigest;

    let call: { account: string; passedTransaction: any; role: string } | undefined;
    (window as any).peakvault = {
      requestSignTx: async (account: string, passedTransaction: any, role: string) => {
        call = { account, passedTransaction, role };
        return { success: true, result: { signatures: [signature] } };
      }
    };

    await PeakVaultProvider.for("alice", "active").signTransaction(tx);

    return {
      ...call!,
      legacy,
      sigDigest,
      passedSigDigest: base.createTransactionFromLegacyJson(call!.passedTransaction).sigDigest,
      signatures: tx.transaction.signatures
    };
  }, { transactionJson, signature: SIGNATURE });

const tapos = { ref_block_num: 34559, ref_block_prefix: 1271006404, expiration: "2021-12-13T11:31:33", extensions: [], signatures: [] };

test.describe("Peak Vault signer", () => {
  test("Should pass the 64-bit integer fields to Peak Vault as strings", async ({ page }) => {
    const result = await signWithStubbedPeakVault(page, {
      ...tapos,
      operations: [
        { type: "update_proposal_votes_operation", value: { voter: "alice", proposal_ids: ["3", "7"], approve: true, extensions: [] } },
        { type: "remove_proposal_operation", value: { proposal_owner: "alice", proposal_ids: ["2"], extensions: [] } },
        { type: "update_proposal_operation", value: { proposal_id: "5", creator: "alice", daily_pay: { amount: "1000", precision: 3, nai: "@@000000013" }, subject: "subject", permlink: "permlink", extensions: [] } },
        { type: "transfer_operation", value: { from: "alice", to: "bob", amount: { amount: "1500", precision: 3, nai: "@@000000021" }, memo: "memo" } }
      ]
    });

    // wax's legacy JSON writes the small ids as numbers, which Peak Vault rejects
    expect(result.legacy.operations[0][1].proposal_ids).toStrictEqual([3, 7]);

    const expected = structuredClone(result.legacy);
    expected.operations[0][1].proposal_ids = ["3", "7"];
    expected.operations[1][1].proposal_ids = ["2"];
    expected.operations[2][1].proposal_id = "5";

    expect(result.passedTransaction).toStrictEqual(expected);
    expect(result.account).toBe("alice");
    expect(result.role).toBe("active");
    expect(result.passedSigDigest).toBe(result.sigDigest);
    expect(result.signatures).toStrictEqual([SIGNATURE]);
  });

  test("Should pass a transaction without 64-bit integer fields to Peak Vault unchanged", async ({ page }) => {
    const result = await signWithStubbedPeakVault(page, {
      ...tapos,
      operations: [
        { type: "vote_operation", value: { voter: "otom", author: "c0ff33a", permlink: "ewxhnjbj", weight: 2200 } },
        { type: "transfer_operation", value: { from: "alice", to: "bob", amount: { amount: "1500", precision: 3, nai: "@@000000021" }, memo: "memo" } }
      ]
    });

    expect(result.passedTransaction).toStrictEqual(result.legacy);
    expect(result.passedSigDigest).toBe(result.sigDigest);
    expect(result.signatures).toStrictEqual([SIGNATURE]);
  });
});
