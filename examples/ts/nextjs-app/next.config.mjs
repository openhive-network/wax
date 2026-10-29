/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    rules: {
      // wax loads wax.common.wasm by URL; by default Turbopack compiles a .wasm file as a WebAssembly module
      "*.wasm": { type: "asset" }
    }
  }
};

export default nextConfig;
