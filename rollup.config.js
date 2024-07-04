import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import nodePollyfills from 'rollup-plugin-polyfill-node';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';

const commonConfiguration = packEntire => ([
  {
    input: `wasm/dist/lib/index.js`,
    output: {
      format: 'es',
      name: 'wax',
      inlineDynamicImports: true,
      file: `wasm/dist/bundle/index${packEntire ? '-full' : ''}.js`
    },
    plugins: [
      alias({
        entries: packEntire ? [
          { find: '@hiveio/beekeeper', replacement: "@hiveio/beekeeper/web" }
        ] : []
      }),
      replace({
        delimiters: ['', ''],
        values: {
          'require("url").fileURLToPath(new URL("./",import.meta.url))': 'import.meta.url',
          'process.env.npm_package_name': `"${process.env.npm_package_name}"`,
          'process.env.npm_package_version': `"${process.env.npm_package_version}"`
          // WASM requires process.argv[1] argument to be set. We can mock it in web browser environment:
        //  ,'process.argv': '(typeof process=="object"&&typeof process.argv=="object"?process.argv:["",""])',
          //'process.env': null,
          //'process.versions.node': '((typeof window == "object") ? null : process.versions.node)'
          //, 'const{createRequire:createRequire}=await import("module")': 'const{createRequire:createRequire}=await import("../detailed/util/index.js")'
          , 'await import("module")': 'await import("node:module")'
        },
        preventAssignment: true
      }),
      nodeResolve({
        preferBuiltins: false,
        browser: true,
        modulePaths: [
          'wasm/dist/lib'
        ],
        resolveOnly: packEntire ? [] : [
          'build_wasm'
        ]
      }),
      nodePollyfills({
        include: ['process', 'module'],
        globals: {global: true, process: true, module: true}
      }),
      commonjs(),
      terser()
    ]
  }, {
    input: `wasm/dist/lib/index.d.ts`,
    output: [
      { file: `wasm/dist/bundle/index${packEntire ? '-full' : ''}.d.ts`, format: "es" }
    ],
    plugins: [
      dts()
    ]
  }
]);

export default [
  ...commonConfiguration(false),
  ...commonConfiguration(true)
];
