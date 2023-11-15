import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'wasm/dist/index.js',
  output: {
    dir: 'wasm/dist/bundle',
    format: 'es',
    name: 'wax'
  },
  plugins: [
    nodeResolve({ preferBuiltins: false, browser: true }),
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true
    }),
    commonjs()
  ]
};
