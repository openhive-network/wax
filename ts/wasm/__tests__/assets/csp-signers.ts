// Page script of csp.html: signs a transaction through @hiveio/wax-signers-beekeeper while the page
// is served with a Content-Security-Policy, then publishes the outcome in the body's data-result attribute.
// Libraries are imported dynamically so the violation listener is installed before any of them is evaluated.

export interface ICspSignersResult {
  error?: string;
  publicKey?: string;
  signatures?: string[];
  decrypted?: string;
  violations: string[];
  evalBlocked: boolean;
}

const violations: string[] = [];
document.addEventListener("securitypolicyviolation", event => {
  violations.push(`${event.violatedDirective}: ${event.blockedURI}`);
});

const signUnderCsp = async (): Promise<Omit<ICspSignersResult, "violations" | "evalBlocked">> => {
  const { createWaxFoundation } = await import("@hiveio/wax");
  const { default: createBeekeeper } = await import("@hiveio/beekeeper");
  const { default: BeekeeperProvider } = await import("@hiveio/wax-signers-beekeeper");

  // The same options @hiveio/wax-signers-external uses for its internal beekeeper
  const beekeeper = await createBeekeeper({ inMemory: true, unlockTimeout: 365 * 24 * 60 * 60 * 1000 });
  try {
    const session = beekeeper.createSession("csp.salt");
    const { wallet } = await session.createWallet("w0");
    const publicKey = await wallet.importKey("5JkFnXrLM2ap9t3AmAxBJvQHF7xSKtnTrCTginQCkhzU5S7ecPT");

    const base = await createWaxFoundation();
    const signer = BeekeeperProvider.for(base, wallet, publicKey);

    const tx = base.createTransactionFromJson({
      ref_block_num: 34559,
      ref_block_prefix: 1271006404,
      expiration: "2021-12-13T11:31:33",
      operations: [{ type: "vote_operation", value: { voter: "otom", author: "c0ff33a", permlink: "ewxhnjbj", weight: 2200 } }],
      extensions: [],
      signatures: []
    });
    await signer.signTransaction(tx);

    const decrypted = await signer.decryptData(await signer.encryptData("CSP control message", publicKey));

    return { publicKey, signatures: tx.transaction.signatures, decrypted };
  } finally {
    await beekeeper.delete();
  }
};

const isEvalBlocked = (): boolean => {
  try {
    new Function("return 1")();
    return false;
  } catch (error) {
    return error instanceof EvalError;
  }
};

const settle = async (): Promise<ICspSignersResult> => {
  let outcome: Omit<ICspSignersResult, "violations" | "evalBlocked">;
  try {
    outcome = await signUnderCsp();
  } catch (error) {
    outcome = { error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  }

  // Violation events are dispatched in a later task than the code that caused them
  await new Promise(resolve => setTimeout(resolve, 100));
  const libraryViolations = [ ...violations ];

  return { ...outcome, violations: libraryViolations, evalBlocked: isEvalBlocked() };
};

document.body.dataset.result = JSON.stringify(await settle());
