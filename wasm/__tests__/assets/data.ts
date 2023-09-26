import type WaxModule from '../../lib/wax';
import type { MainModule, protocol as protocolT, result as resultT } from '../../lib/wax';

declare global {
  var wax: typeof WaxModule;
  var provider: MainModule;
  var protocol: protocolT;
  var transform: (result: resultT) => resultT & { value: 0 | 1 };
}
