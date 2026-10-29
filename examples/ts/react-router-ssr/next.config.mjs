/** @type {import('next').NextConfig} */
const nextConfig = {
  // The tests open the dev server as 127.0.0.1, which Next.js 16 treats as a cross-origin dev client
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      // wax loads wax.common.wasm by URL; by default Turbopack compiles a .wasm file as a WebAssembly module
      "*.wasm": { type: "asset" }
    }
  }
};

export default nextConfig;
