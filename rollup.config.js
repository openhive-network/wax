import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';

const commonConfiguration = (env, packEntire = false) => ([
  {
    input: `wasm/dist/lib/${env}.js`,
    output: {
      format: 'es',
      name: 'wax',
      file: `wasm/dist/bundle/${env}${packEntire ? '-full' : ''}.js`
    },
    plugins: [
      alias({
        entries: [
          { find: '@hive/beekeeper', replacement: `@hive/beekeeper/${env}` },
          { find: './build_wasm/wax.web.js', replacement: `build_wasm/wax.${env}.js` }
        ]
      }),
      replace({
        'process': null,
        'process.env': null,
        preventAssignment: true
      }),
      nodeResolve({
        preferBuiltins: env !== "web",
        browser: env === "web",
        modulePaths: [
          'wasm/dist/lib'
        ],
        resolveOnly: packEntire ? [] : [
          'build_wasm'
        ]
      }),
      commonjs()
    ]
  }, {
    input: `wasm/dist/lib/${env}.d.ts`,
    output: [
      { file: `wasm/dist/bundle/${env}${packEntire ? '-full' : ''}.d.ts`, format: "es" }
    ],
    plugins: [
      dts()
    ]
  }
]);

export default [
  ...commonConfiguration('node'),
  ...commonConfiguration('web'),
  ...commonConfiguration('web', true)
];
