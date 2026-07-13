import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cloudflare({
      viteEnvironment: { name: "ssr" },
      // Workers AI has no local simulation — the plugin proxies remote-only
      // bindings through a session that requires wrangler auth. CI runners
      // have no Cloudflare credentials, so skip the remote session there
      // (the AI binding is stubbed; nothing in e2e invokes it).
      remoteBindings: !process.env.CI,
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
