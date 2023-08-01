export * from '../build_wasm/wax';

import { MainModule } from '../build_wasm/wax';

declare function waxmodule(): Promise<MainModule>;

export default waxmodule;
