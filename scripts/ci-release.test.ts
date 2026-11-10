import { expect, test } from "bun:test";
import { assertProductionBuild, assertPublicAsset } from "./ci-release.ts";

const sha = "8cfd5f485af4b39405ef2a3a9b40f2bb4f8ffd3e";
const env = { WORKERS_CI: "1", WORKERS_CI_BRANCH: "main", WORKERS_CI_COMMIT_SHA: sha };

test("production guard only accepts the exact main build commit", () => {
  expect(assertProductionBuild(env, `${sha}\n`)).toBe(sha);
  for (const changed of [
    { ...env, WORKERS_CI: undefined },
    { ...env, WORKERS_CI_BRANCH: "codex/workers-static-assets" },
    { ...env, WORKERS_CI_COMMIT_SHA: "main" },
    { ...env, WORKERS_CI_COMMIT_SHA: "0".repeat(40) },
  ]) expect(() => assertProductionBuild(changed, sha)).toThrow();
});

test("asset audit rejects source, private paths, drafts, maps, and recognizable secrets", () => {
  for (const path of [".env", ".git/config", ".agents/skills/example.md", "posts/_draft/index.html", "index.js.map", "package.json", "build.ts", "AGENTS.md"]) {
    expect(() => assertPublicAsset(path)).toThrow();
  }
  for (const text of ["-----BEGIN PRIVATE KEY-----", "/Users/example/private/file", `ghp_${"x".repeat(36)}`]) {
    expect(() => assertPublicAsset("index.html", text)).toThrow();
  }
  for (const path of ["index.html", "agents.md", "skills/example/index.html", "main.js", "fonts/site.woff2"]) {
    expect(() => assertPublicAsset(path, "Public content")).not.toThrow();
  }
});

import { mkdir, mkdtemp, readFile, rename, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { auditRelease } from "./ci-release.ts";

test("release audit verifies actual files and fails closed on packaging changes", async () => {
  const root = await mkdtemp(join(tmpdir(), "readme-ci-audit-"));
  const worker = join(root, ".cloudflare/output/v0/workers/default");
  try {
    await mkdir(join(root, "blog"), { recursive: true });
    await mkdir(worker, { recursive: true });
    await writeFile(join(root, ".cloudflare/output/v0/config.json"), JSON.stringify({ buildContext: { isPreview: false } }));
    const config = { name: "lidessen-readme", compatibilityDate: "2026-11-07", assets: { notFoundHandling: "404-page" } };
    await writeFile(join(worker, "worker.config.json"), JSON.stringify(config));
    const paths = ["index.html", "404.html", "about/index.html", "thoughts/index.html", "skills/index.html"];
    for (const dir of [join(root, "dist"), join(worker, "assets")]) {
      for (const path of paths) {
        const target = join(dir, path);
        await mkdir(join(target, ".."), { recursive: true });
        await writeFile(target, "Public content");
      }
    }
    expect(await auditRelease(root)).toBe(5);
    await mkdir(join(root, ".cloudflare/output/v0/containers"));
    await expect(auditRelease(root)).rejects.toThrow("Additional build output resources");
    await rm(join(root, ".cloudflare/output/v0/containers"), { recursive: true });
    await rename(join(worker, "assets"), join(worker, "assets-original"));
    await symlink(join(worker, "assets-original"), join(worker, "assets"));
    await expect(auditRelease(root)).rejects.toThrow("Symlink");
    await rm(join(worker, "assets"));
    await rename(join(worker, "assets-original"), join(worker, "assets"));
    await writeFile(join(worker, "assets/index.html"), "Changed");
    await expect(auditRelease(root)).rejects.toThrow("differs from dist");
    await writeFile(join(worker, "assets/index.html"), await readFile(join(root, "dist/index.html")));
    await writeFile(join(worker, "worker.config.json"), JSON.stringify({ ...config, bindings: [] }));
    await expect(auditRelease(root)).rejects.toThrow("Unexpected Worker configuration");
    await writeFile(join(worker, "worker.config.json"), JSON.stringify(config));
    await writeFile(join(worker, "index.js"), "export default {};");
    await expect(auditRelease(root)).rejects.toThrow("Worker modules");
    await rm(join(worker, "index.js"));
    await symlink(join(root, "dist/index.html"), join(worker, "assets/link.html"));
    await expect(auditRelease(root)).rejects.toThrow("Symlink");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
