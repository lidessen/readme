import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { buildSite } from "meowpress/build";
import site from "./site.config.ts";

const siteDirectory = import.meta.dir;
const repositoryRoot = resolve(siteDirectory, "..");
const stagedContent = resolve(siteDirectory, "content");

async function copyMarkdownTree(from: string, to: string): Promise<void> {
  await mkdir(to, { recursive: true });
  const entries = await readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.name === "assets") continue;
    const source = join(from, entry.name);
    const target = join(to, entry.name);
    if (entry.isDirectory()) {
      await copyMarkdownTree(source, target);
      continue;
    }
    if (/\.(md|mdx)$/i.test(entry.name)) {
      await cp(source, target);
    }
  }
}

async function stageContent(): Promise<void> {
  await rm(stagedContent, { recursive: true, force: true });
  await copyMarkdownTree(join(repositoryRoot, "blog"), join(stagedContent, "posts"));
  await copyMarkdownTree(join(repositoryRoot, "notes"), join(stagedContent, "thoughts"));
  await cp(join(repositoryRoot, "blog", "assets"), join(stagedContent, "assets"), {
    recursive: true,
  });
}

await stageContent();
await buildSite(site);
