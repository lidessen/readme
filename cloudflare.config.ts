import { defineConfig } from "cf/config";

// Static assets only: no application Worker or automatic domain changes.
export default defineConfig({
  worker: {
    name: "lidessen-readme",
    compatibilityDate: "2026-11-07",
    assets: {
      notFoundHandling: "404-page",
    },
  },
});
