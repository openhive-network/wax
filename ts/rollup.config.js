import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';
import path from 'node:path';

export default [
  // Generate .JS bundles for each environment
  {
    input: 'wasm/dist/lib/detailed/index.js',
    output: {
      format: 'es',
      file: 'wasm/dist/bundle/detailed/index.js'
    },
    plugins: [
      copy({
        targets: [
          {
            src: [
              'wasm/lib/build_wasm/wax.common.wasm',
              'wasm/lib/build_wasm/wax.node.js',
              'wasm/lib/build_wasm/wax.web.js'
            ],
            dest: 'wasm/dist/bundle'
          }
        ]
      }),
      replace({
        delimiters: ['', ''],
        values: {
          // Hardcode package name and version for later use in the code:
          'process.env.npm_package_name': `"${process.env.npm_package_name}"`,
          'process.env.npm_package_version': `"${process.env.npm_package_version}"`
        },
        preventAssignment: true
      }),
      nodeResolve({ // This will bundle all of our not crucial sub-dependencies, like class-validator and class-transformer
        preferBuiltins: false,
        browser: false
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
  },
  {
    input: 'wasm/dist/lib/index.js',
    output: {
      format: 'es',
      file: 'wasm/dist/bundle/web.js'
    },
    external: [
      './wax.web.js',
      './detailed/index.js'
    ],
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          'wasm/lib/wax_module.js': './wax.web.js'
        },
        preventAssignment: true
      })
    ]
  },
  {
    input: 'wasm/dist/lib/index.js',
    output: {
      format: 'es',
      file: 'wasm/dist/bundle/node.js'
    },
    external: [
      './wax.node.js',
      './detailed/index.js'
    ],
    plugins: [
      replace({
        delimiters: ['', ''],
        values: {
          'wasm/lib/wax_module.js': './wax.node.js'
        },
        preventAssignment: true
      })
    ]
  },
  // Type declarations are common for all environments
  {
    input: `wasm/dist/lib/index.d.ts`,
    output: [
      { file: `wasm/dist/bundle/index.d.ts`, format: "es" }
    ],
    plugins: [
      dts()
    ]
  }
];
