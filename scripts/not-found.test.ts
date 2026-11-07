import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { notFoundPage, writeNotFoundPage } from "./not-found.ts";

test("writes the reviewed static 404 page", async () => {
  const directory = await mkdtemp(join(tmpdir(), "readme-404-"));
  try {
    await writeNotFoundPage(directory);
    expect(await readFile(join(directory, "404.html"), "utf8")).toBe(notFoundPage);
    expect(notFoundPage).toContain('<a href="/">返回首页</a>');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
