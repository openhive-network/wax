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
        delimiters: ['', ''],
        values: {
          // Generated Emscripten WASM code contains fs, which is not actually used by our code, so remove it to prevent client bundler errors:
          'fs.readFileSync(filename,binary?undefined:"utf8")': null,
          'fs.readFile(filename,binary?undefined:"utf8",(err,data)=>{if(err)onerror(err);else onload(binary?data.buffer:data)})': null,
          'fs.readSync(fd,buf)': '0', // fallback - readSync returns the number of bytesRead
          // Instead of fs we need crypto module in Node.js environment later for SSL initRandomDevice code - ensure proper module is imported:
          'var fs=require("fs")': 'var node_crypto=await import("crypto")',
          'require("crypto")': 'node_crypto',
          // 'module' dependency is redundant in our environment - use 'await import' instead:
          'const{createRequire:createRequire}=await import("module");': '',
          'var require=createRequire(import.meta.url);': '',
          'var nodePath=require("path")': 'var nodePath=await import("path")',
          // new URL("./") throws - use import.meta.url instead:
          'require("url").fileURLToPath(new URL("./",import.meta.url))': 'import.meta.url',
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
