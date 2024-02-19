import beekeeperFactory, { type IBeekeeperInstance } from '@hive/beekeeper/web';
import {
  createWaxFoundation, createHiveChain, IWaxBaseInterface, IHiveChainInterface, BroadcastTransactionRequest,
  FollowOperationBuilder, ResourceCreditsOperationBuilder, CommunityOperationBuilder,
  type BroadcastTransactionRequest as BroadcastTransactionRequestT, type ResourceCreditsOperationBuilder as ResourceCreditsOperationBuilderT,
  type CommunityOperationBuilder as CommunityOperationBuilderT, type FollowOperationBuilder as FollowOperationBuilderT
} from '../../dist/bundle/web-full.js';

declare global {
  var bk: IBeekeeperInstance;
  var wx: IWaxBaseInterface;
  var chain: IHiveChainInterface;
  var BroadcastTransactionRequest: typeof BroadcastTransactionRequestT;
  var ResourceCreditsOperationBuilder: typeof ResourceCreditsOperationBuilderT;
  var CommunityOperationBuilder: typeof CommunityOperationBuilderT;
  var FollowOperationBuilder: typeof FollowOperationBuilderT;
  var waxScriptLoaded: boolean;
}

// Prevent bundling and rewriting
const isWeb = new Function("try{return this===window}catch{return false}");

globalThis.waxScriptLoaded = false;
globalThis.bk = isWeb() ? await beekeeperFactory() :  await (await import("@hive/beekeeper/node")).default();
globalThis.wx = isWeb() ? await createWaxFoundation() :  await (await import("../../dist/lib/node.js")).createWaxFoundation();
globalThis.chain = isWeb() ? await createHiveChain() :  await (await import("../../dist/lib/node.js")).createHiveChain();
globalThis.BroadcastTransactionRequest = BroadcastTransactionRequest;
globalThis.FollowOperationBuilder = FollowOperationBuilder;
globalThis.ResourceCreditsOperationBuilder = ResourceCreditsOperationBuilder;
globalThis.CommunityOperationBuilder = CommunityOperationBuilder;
globalThis.waxScriptLoaded = true; // Setting this to true indicates that the website is ready to be tested

export {};
