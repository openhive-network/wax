import type WaxModule from '../../lib/wax';
import type { MainModule, proto_protocol, protocol as protocolT, result as resultT } from '../../lib/wax';

declare global {
  var wax: typeof WaxModule;
  var provider: MainModule;
  var protocol: protocolT;
  var proto_protocol: proto_protocol;
  var transform: (result: resultT) => resultT & { value: 0 | 1 };
}
