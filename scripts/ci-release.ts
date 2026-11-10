import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const workerName = "lidessen-readme";
const outputRoot = ".cloudflare/output/v0";
const allowedExtensions = new Set([
  ".html", ".css", ".js", ".json", ".xml", ".txt", ".md", ".svg", ".png",
  ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".woff", ".woff2", ".ttf", ".otf",
]);
const textExtensions = new Set([".html", ".css", ".js", ".json", ".xml", ".txt", ".md", ".svg"]);

export function assertProductionBuild(env: NodeJS.ProcessEnv, head: string): string {
  const commit = env.WORKERS_CI_COMMIT_SHA;
  if (env.WORKERS_CI !== "1" || env.WORKERS_CI_BRANCH !== "main") {
    throw new Error("Production deployment requires a Workers Builds run on main.");
  }
  if (!commit || !/^[0-9a-f]{40}$/.test(commit) || commit !== head.trim()) {
    throw new Error("Build commit must match the checked-out Git commit.");
  }
  return commit;
}

export function assertPublicAsset(path: string, text?: string): void {
  const segments = path.split("/");
  if (segments.some((part) => part.startsWith(".") || part.startsWith("_")) ||
      !allowedExtensions.has(extname(path).toLowerCase()) ||
      /(^|\/)(?:node_modules|package\.json|bun\.lock|AGENTS\.md)(\/|$)/.test(path)) {
    throw new Error(`Unexpected public asset: ${path}`);
  }
  // This is a leak detector, not a replacement for reviewing content before merging.
  if (text && /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----|\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[A-Z0-9]{16})\b|\/Users\/[\w.-]+\//.test(text)) {
    throw new Error(`Potential private data in public asset: ${path}`);
  }
}

async function assertNoSymlinkPath(root: string, relativePath: string): Promise<void> {
  let path = root;
  for (const part of ["", ...relativePath.split("/")]) {
    path = join(path, part);
    if ((await lstat(path)).isSymbolicLink()) {
      throw new Error(`Symlink is not allowed in deployment output: ${relativePath}`);
    }
  }
}

async function files(root: string, prefix = ""): Promise<string[]> {
  if ((await lstat(join(root, prefix))).isSymbolicLink()) {
    throw new Error(`Symlink is not allowed in deployment output: ${prefix || root}`);
  }
  const entries = await readdir(join(root, prefix), { withFileTypes: true });
  const result: string[] = [];
  for (const entry of entries) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    const info = await lstat(join(root, path));
    if (info.isSymbolicLink()) throw new Error(`Symlink is not allowed in deployment output: ${path}`);
    if (info.isDirectory()) result.push(...await files(root, path));
    else if (info.isFile()) result.push(path);
    else throw new Error(`Unexpected deployment file type: ${path}`);
  }
  return result.sort();
}

export async function auditRelease(root: string): Promise<number> {
  for (const path of ["dist", "blog", `${outputRoot}/config.json`,
    `${outputRoot}/workers/default/worker.config.json`, `${outputRoot}/workers/default/assets`]) {
    await assertNoSymlinkPath(root, path);
  }
  const output = join(root, outputRoot);
  if ((await readdir(output)).sort().join() !== "config.json,workers") {
    throw new Error("Additional build output resources are not allowed.");
  }
  const outputConfig = JSON.parse(await readFile(join(output, "config.json"), "utf8"));
  if (JSON.stringify(outputConfig) !== JSON.stringify({ buildContext: { isPreview: false } })) {
    throw new Error("Unexpected build output configuration.");
  }
  const workers = await readdir(join(output, "workers"));
  if (workers.length !== 1 || workers[0] !== "default") throw new Error("Only one static Worker may be published.");
  const worker = join(output, "workers/default");
  const entries = (await readdir(worker)).sort();
  if (JSON.stringify(entries) !== JSON.stringify(["assets", "worker.config.json"])) {
    throw new Error("Worker modules or additional deployment files are not allowed.");
  }
  const config = JSON.parse(await readFile(join(worker, "worker.config.json"), "utf8"));
  if (Object.keys(config).sort().join() !== "assets,compatibilityDate,name" ||
      config.name !== workerName || config.compatibilityDate !== "2026-11-07" ||
      JSON.stringify(config.assets) !== JSON.stringify({ notFoundHandling: "404-page" })) {
    throw new Error("Unexpected Worker configuration: review bindings, routes, or runtime changes before publishing.");
  }
  const dist = join(root, "dist");
  const assets = join(worker, "assets");
  const sourceFiles = await files(dist);
  const assetFiles = await files(assets);
  if (JSON.stringify(sourceFiles) !== JSON.stringify(assetFiles)) throw new Error("Deployment assets differ from dist.");
  for (const required of ["index.html", "404.html", "about/index.html", "thoughts/index.html", "skills/index.html"]) {
    if (!sourceFiles.includes(required)) throw new Error(`Missing required page: ${required}`);
  }
  const drafts = (await files(join(root, "blog")))
    .filter((path) => /(^|\/)_[^/]+\.mdx?$/.test(path))
    .map((path) => path.split("/").at(-1)!.replace(/^_/, "").replace(/\.mdx?$/, ""));
  for (const path of assetFiles) {
    assertPublicAsset(path);
    if (path.startsWith("posts/") && path.split("/").some((part) => drafts.includes(part))) {
      throw new Error(`Draft was included in public output: ${path}`);
    }
    const contents = await readFile(join(assets, path));
    const source = await readFile(join(dist, path));
    if (!contents.equals(source)) throw new Error(`Deployment content differs from dist: ${path}`);
    if (textExtensions.has(extname(path).toLowerCase())) assertPublicAsset(path, contents.toString("utf8"));
    console.log(`${createHash("sha256").update(contents).digest("hex")}  ${path}`);
  }
  return assetFiles.length;
}

if (import.meta.main) {
  if (process.argv[2] === "guard") {
    const head = Bun.spawnSync(["git", "rev-parse", "HEAD"], { cwd: process.cwd() });
    if (head.exitCode !== 0) throw new Error("Cannot verify Git HEAD.");
    const commit = assertProductionBuild(process.env, head.stdout.toString());
    console.log(`Production build verified: ${commit}`);
  } else if (process.argv[2] === "audit") {
    const count = await auditRelease(process.cwd());
    console.log(`Audited ${count} static assets; deployment bytes match dist.`);
  } else {
    throw new Error("Expected guard or audit.");
  }
}
