/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack5: true, // Enabled by default - just to be sure - follow this guide if using webpack <5 - https://bobbyhadz.com/blog/module-not-found-cant-resolve-fs#module-not-found-cant-resolve-fs-error-in-nextjs
  webpack: (config, { isServer }) => {
    if (!isServer) // Prevents client bundles from including node specific packages required for WASM loading in wax
      config.resolve.fallback = {
        fs: false,
        path: false,
        module: false
      };

    return config;
  }
};

export default nextConfig;
