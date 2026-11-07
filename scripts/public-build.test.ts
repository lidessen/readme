import { afterEach, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertPublicSkillsOnly } from "./public-build.ts";

const directories: string[] = [];
async function fixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "readme-public-build-"));
  directories.push(root);
  return root;
}
afterEach(async () => {
  await Promise.all(directories.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

test("allows the public skills directory", async () => {
  const root = await fixture();
  await mkdir(join(root, "skills"));
  await expect(assertPublicSkillsOnly(root)).resolves.toBeUndefined();
});

test("rejects project-local skills before building", async () => {
  const root = await fixture();
  await mkdir(join(root, ".agents/skills/private"), { recursive: true });
  await expect(assertPublicSkillsOnly(root)).rejects.toThrow("Refusing to build");
});

test("rejects even a dangling project-skills symlink", async () => {
  const root = await fixture();
  await mkdir(join(root, ".agents"));
  await symlink(join(root, "missing"), join(root, ".agents/skills"));
  await expect(assertPublicSkillsOnly(root)).rejects.toThrow("Refusing to build");
});
