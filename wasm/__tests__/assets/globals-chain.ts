import beekeeperFactory, { type IBeekeeperInstance } from '@hive/beekeeper/web';
import {
  createWaxFoundation, createHiveChain, IWaxBaseInterface, IHiveChainInterface, BroadcastTransactionRequest,
  FollowOperationBuilder, ResourceCreditsOperationBuilder, CommunityOperationBuilder,
  type BroadcastTransactionRequest as BroadcastTransactionRequestT, type ResourceCreditsOperationBuilder as ResourceCreditsOperationBuilderT,
  type CommunityOperationBuilder as CommunityOperationBuilderT, type FollowOperationBuilder as FollowOperationBuilderT
} from '../../dist/bundle/web-full.js';

declare global {
  var WaxTests: {
    bk: () => Promise<IBeekeeperInstance>;
    wx: () => Promise<IWaxBaseInterface>;
    chain: () => Promise<IHiveChainInterface>;
  };
  var BroadcastTransactionRequest: typeof BroadcastTransactionRequestT;
  var ResourceCreditsOperationBuilder: typeof ResourceCreditsOperationBuilderT;
  var CommunityOperationBuilder: typeof CommunityOperationBuilderT;
  var FollowOperationBuilder: typeof FollowOperationBuilderT;
}

// Prevent bundling and rewriting
const isWeb = new Function("try{return this===window}catch{return false}");
// cached WASM factories
const factories = {
  bk: undefined as IBeekeeperInstance | undefined,
  wx: undefined as IWaxBaseInterface | undefined,
  chain: undefined as IHiveChainInterface | undefined
};

globalThis.WaxTests = {
  bk: async() => {
    if(factories.bk) return factories.bk;

    if(isWeb())
      return factories.bk = await beekeeperFactory();

    const node = await import("@hive/beekeeper/node");
    return factories.bk = await node.default();
  },
  wx: async() => {
    if(factories.wx) return factories.wx;

    if(isWeb())
      return factories.wx = await createWaxFoundation();

    const node = await import("../../dist/lib/node.js");
    return factories.wx = await node.createWaxFoundation();
  },
  chain: async() => {
    if(factories.chain) return factories.chain;

    if(isWeb())
      return factories.chain = await createHiveChain();

    const node = await import("../../dist/lib/node.js");
    return factories.chain = await node.createHiveChain();
  }
};

globalThis.BroadcastTransactionRequest = BroadcastTransactionRequest;
globalThis.FollowOperationBuilder = FollowOperationBuilder;
globalThis.ResourceCreditsOperationBuilder = ResourceCreditsOperationBuilder;
globalThis.CommunityOperationBuilder = CommunityOperationBuilder;

export {};
