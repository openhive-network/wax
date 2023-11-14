import type beekeeperFactoryT from '@hive/beekeeper';
import type { IBeekeeperInstance } from '@hive/beekeeper';
import type WaxModule from '../../lib';
import type {
  MainModule, proto_protocol, protocol as protocolT, result as resultT,
  createWaxFoundation as createBaseT, createHiveChain as createHiveChainT,
  IWaxBaseInterface, IHiveChainInterface
} from '../../lib';

declare global {
  var wax: typeof WaxModule;
  var bk: IBeekeeperInstance;
  var wx: IWaxBaseInterface;
  var chain: IHiveChainInterface;
  var createWaxFoundation: typeof createBaseT;
  var beekeeperFactory: typeof beekeeperFactoryT;
  var createHiveChain: typeof createHiveChainT;
  var provider: MainModule;
  var protocol: protocolT;
  var proto_protocol: proto_protocol;
  var transform: (result: resultT) => resultT & { value: 0 | 1 };
}
