import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const commonConfiguration = (env, merge = {}) => ({
  input: `wasm/dist/${env}.js`,
  output: {
    format: 'es',
    name: 'wax',
    ...(merge.output || {})
  },
  plugins: [
    replace({
      'process': null,
      'process.env': null,
      preventAssignment: true
    }),
    nodeResolve({ preferBuiltins: env !== "web", browser: env === "web" }),
    commonjs(),
    ...(merge.plugins || [])
  ]
});

export default [
  commonConfiguration('node', { output: { file: 'wasm/dist/bundle/node.js' } }),
  commonConfiguration('web', { output: { dir: 'wasm/dist/bundle' }, plugins: [
    typescript({
      rollupCommonJSResolveHack: false,
      clean: true
    }) // We only need one typescript documentation, as it is the same as for node
    ]
  })
];
