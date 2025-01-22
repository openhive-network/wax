# nextjs-app

Created by command: `npx create-next-app@latest nextjs-app`

[pages/index.tsx](pages/index.tsx) file was modified

Changes made in order for React + Next.js app to work:

```diff
const nextConfig = {
  reactStrictMode: true,
+  webpack: (config, { isServer }) => {
+    if (!isServer) // Prevents client bundles from including node specific packages required for WASM loading in wax
+      config.resolve.fallback = {
+        fs: false,
+        path: false,
+        module: false
+      };
+
+    return config;
+  }
};

export default nextConfig;
```

As you can see, we had to extend webpack configuration, ensuring `fs`, `path` and `module` dependencies are omitted from bundling as code importing them will be unreachable on the client-web-side
