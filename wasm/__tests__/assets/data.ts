import type beekeeperFactoryT from '@hive/beekeeper';
import type { IBeekeeperInstance } from '@hive/beekeeper';
import type WaxModule from '../../dist/lib/wax_module';
import type {
  createWaxFoundation as createBaseT, createHiveChain as createHiveChainT,
  IWaxBaseInterface, IHiveChainInterface, BroadcastTransactionRequest as BroadcastTransactionRequestT,
  FollowOperationBuilder as FollowOperationBuilderT, ResourceCreditsOperationBuilder as ResourceCreditsOperationBuilderT,
  CommunityOperationBuilder as CommunityOperationBuilderT
} from '../../dist/lib/web';
import type {
  MainModule, proto_protocol, protocol as protocolT, result as resultT
} from '../../dist/lib/build_wasm/wax.web';

declare global {
  var wax: typeof WaxModule;
  var bk: IBeekeeperInstance;
  var wx: IWaxBaseInterface;
  var chain: IHiveChainInterface;
  var createWaxFoundation: typeof createBaseT;
  var beekeeperFactory: typeof beekeeperFactoryT;
  var createHiveChain: typeof createHiveChainT;
  var BroadcastTransactionRequest: typeof BroadcastTransactionRequestT;
  var ResourceCreditsOperationBuilder: typeof ResourceCreditsOperationBuilderT;
  var CommunityOperationBuilder: typeof CommunityOperationBuilderT;
  var FollowOperationBuilder: typeof FollowOperationBuilderT;
  var provider: MainModule;
  var protocol: protocolT;
  var proto_protocol: proto_protocol;
  var transform: (result: resultT) => resultT & { value: 0 | 1 };
}
