import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

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
          { src: ['wasm/lib/build_wasm/wax.common.wasm', 'wasm/lib/build_wasm/wax.common.d.ts', 'wasm/lib/build_wasm/wax.*.js'], dest: 'wasm/dist/bundle/build_wasm' },
          { src: ['wasm/lib/build_wasm/wax.common.d.ts'], dest: 'wasm/dist/lib/build_wasm' }
        ]
      }),
      replace({
        values: {
          // Make sure we do not include `process` in the code:
          'process': null,
          'process.env': null,
          'process.env.REFLECT_METADATA_USE_MAP_POLYFILL': null, // Bundled dependency - reflect-metadata - uses this - we do not need it
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
      commonjs()
    ]
  },
  {
    input: 'wasm/dist/lib/index.js',
    output: {
      format: 'es',
      file: 'wasm/dist/bundle/web.js'
    },
    external: [
      './build_wasm/wax.web.js',
      './detailed/index.js'
    ],
    plugins: [
      replace({
        delimiters: ['[\'"]', '[\'"]'],
        values: {
          './build_wasm/wax.common.js': '"./build_wasm/wax.web.js"'
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
      './build_wasm/wax.node.js',
      './detailed/index.js'
    ],
    plugins: [
      replace({
        delimiters: ['[\'"]', '[\'"]'],
        values: {
          './build_wasm/wax.common.js': '"./build_wasm/wax.node.js"'
        },
        preventAssignment: true
      })
    ]
  },
  {
    input: 'wasm/dist/lib/vite.js',
    output: {
      format: 'es',
      file: 'wasm/dist/bundle/vite.js'
    },
    external: [
      './build_wasm/wax.web.js',
      './detailed/index.js',
      './build_wasm/wax.common.wasm?url'
    ],
    plugins: [
      replace({
        delimiters: ['[\'"]', '[\'"]'],
        values: {
          './build_wasm/wax.common.js': '"./build_wasm/wax.web.js"',
          "./build_wasm/wax.common.wasm' + '?url": "'./build_wasm/wax.common.wasm?url'"
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
