import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

const commonConfiguration = packEntire => ([
    {
    input: `wasm/dist/lib/index.js`,
    output: {
      format: 'es',
      name: 'wax',
      file: `wasm/dist/bundle/index${packEntire ? '-full' : ''}.js`
    },
    plugins: [
      alias({
        entries: packEntire ? [
          { find: '@hiveio/beekeeper', replacement: "@hiveio/beekeeper/web" }
        ] : []
      }),
      copy(
        { targets: [{ src: 'wasm/build_wasm/wax.common.wasm', dest: 'wasm/dist/bundle' } ]}
      ),
      replace({
        delimiters: ['', ''],
        values: {
          // Equivalent and Supported by Node.js >=20.11 - replacing this results in less imports during runtime
          'require("url").fileURLToPath(new URL("./",import.meta.url))': 'import.meta.dirname',
          // Hardcode package name and version for later use in the code:
          'process.env.npm_package_name': `"${process.env.npm_package_name}"`,
          'process.env.npm_package_version': `"${process.env.npm_package_version}"`,
          // WASM requires process.argv[1] argument to be set. We can mock it in web browser environment:
          'process.argv': '(typeof process=="object"&&typeof process.argv=="object"?process.argv:["",""])',
          // Keeping process.env in the code will cause errors in the browser environment - remove it:
          'process.env': null
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
      commonjs(),
      terser({
        format: {
          inline_script: false,
          comments: false,
          max_line_len: 100
        }
      })
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
