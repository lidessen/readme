import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildSite, meowSite } from "meowpress/build";
import site from "../site.config.ts";

test("builds a themed 404 and stable dates without publishing drafts or project skills", async () => {
  const root = await mkdtemp(join(tmpdir(), "readme-site-output-"));
  const output = join(root, "dist");
  try {
    for (const path of ["content/posts", "content/thoughts", "skills/public-example", ".agents/skills/private-example"]) {
      await mkdir(join(root, path), { recursive: true });
    }
    await writeFile(join(root, "content/posts/_draft.md"), "# Unpublished draft\n\nDRAFT_FIXTURE_DO_NOT_PUBLISH\n");
    await writeFile(join(root, "content/thoughts/note.md"), "---\ntitle: Public note\ndate: 2026-09-03\n---\n\nPUBLIC_NOTE_FIXTURE\n");
    await writeFile(join(root, "skills/public-example/SKILL.md"), "---\nname: public-example\ndescription: A public fixture.\n---\n\n# Public example\n\nPUBLIC_SKILL_FIXTURE\n");
    await writeFile(join(root, ".agents/skills/private-example/SKILL.md"), "---\nname: private-example\ndescription: A private fixture.\n---\n\n# Private example\n\nPRIVATE_SKILL_FIXTURE_DO_NOT_PUBLISH\n");
    expect(site.includeProjectSkills).toBe(false);
    await buildSite(meowSite({
      ...site,
      content: join(root, "content"),
      skillsDirectory: root,
      outputDirectory: output,
      fonts: [],
      site: { ...site.site, images: {} },
    }));
    const files = await readdir(output, { recursive: true });
    const home = await readFile(join(output, "index.html"), "utf8");
    const englishHome = await readFile(join(output, "en/index.html"), "utf8");
    const notFound = await readFile(join(output, "404.html"), "utf8");
    const englishNotFound = await readFile(join(output, "en/404.html"), "utf8");
    expect(home).toContain("PUBLIC_NOTE_FIXTURE");
    expect(home).toContain("2026 周四");
    expect(home).not.toContain("2026, 周四");
    expect(files).toContain("skills/public-example/index.html");
    expect(files.some((path) => /private-example|_draft/.test(path))).toBe(false);
    expect(notFound).toContain("页面未找到");
    expect(notFound).toContain("返回首页");
    expect(notFound).toMatch(/<base href=["']?\/["']?>/);
    expect(notFound).toMatch(/<link[^>]+stylesheet/);
    // Chinese source tree with an English tree: the switch links across, the English tree has
    // its own chrome, and an original without a translation is listed with its language marked.
    expect(home).toContain('href="/en/"');
    expect(englishHome).toContain("2026 Thu");
    expect(englishHome).toContain('lang="zh"');
    expect(englishNotFound).toContain("Page not found");
    expect(englishNotFound).toContain("Back to home");
    expect(files).toContain("en/thoughts/index.html");
    expect(files).toContain("translations.json");
    // The English tree publishes the skills section with its own chrome and links inside it.
    expect(files).toContain("en/skills/index.html");
    expect(files).toContain("en/skills/public-example/index.html");
    const englishSkills = await readFile(join(output, "en/skills/index.html"), "utf8");
    expect(englishSkills).toContain('href="/en/skills/public-example/"');
    expect(englishSkills).not.toContain('href="/skills/public-example/"');
    for (const path of files.filter((path) => /\.(html|txt|md)$/.test(path))) {
      const text = await readFile(join(output, path), "utf8");
      expect(text).not.toContain("DRAFT_FIXTURE_DO_NOT_PUBLISH");
      expect(text).not.toContain("PRIVATE_SKILL_FIXTURE_DO_NOT_PUBLISH");
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
