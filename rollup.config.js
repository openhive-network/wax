import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
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
      file: `wasm/dist/bundle/index${packEntire ? '-full' : ''}.js`
    },
    plugins: [
      alias({
        entries: packEntire ? [
          { find: '@hiveio/beekeeper', replacement: "@hiveio/beekeeper/web" }
        ] : []
      }),
      replace({
        'process.env.npm_package_name': `"${process.env.npm_package_name}"`,
        'process.env.npm_package_version': `"${process.env.npm_package_version}"`,
        'process': null,
        'process.versions': null,
        'process.argv': "[]",
        'process.versions.node': null,
        'process.env': null,
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
