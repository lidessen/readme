#!/usr/bin/env python3
"""Tests for check_index.py.

Run from anywhere inside the repository:
    python3 skills/principles-index/tests/test_check_index.py
"""

import sys
import tempfile
import unittest
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parents[1] / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

import check_index  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[3]


class SlugTest(unittest.TestCase):
    def test_github_slug_matches_known_repo_anchors(self):
        # Anchors already used by this repository's own cross-links.
        cases = [
            ("Git 自动发布", "git-自动发布"),
            ("Cloudflare Workers Static Assets", "cloudflare-workers-static-assets"),
            ("从 GitHub 安装", "从-github-安装"),
            ("Pack", "pack"),
            ("内容", "内容"),
            ("语言", "语言"),
            ("先认识项目，再定本地做法", "先认识项目再定本地做法"),
            ("四项使用关系", "四项使用关系"),
            ("表达（expression）", "表达expression"),
        ]
        for heading, expected in cases:
            self.assertEqual(check_index.github_slug(heading), expected)

    def test_github_slug_strips_code_spans_and_keeps_hyphens(self):
        bt = chr(96)
        heading = "风格样本：" + bt + "notes/" + bt
        self.assertEqual(check_index.github_slug(heading), "风格样本notes")

    def test_readme_own_anchors_resolve(self):
        # Calibration: every anchor GitHub renders for README.md must be found.
        slugs = check_index.heading_slugs(
            (REPO_ROOT / "README.md").read_text(encoding="utf-8")
        )
        for anchor in ("站点", "语言", "git-自动发布", "按任务选择技能", "从-github-安装", "pack"):
            self.assertIn(anchor, slugs)


class CheckMarkdownTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        doc = self.root / "doc.md"
        doc.write_text("# Title\n\n## Real Heading\n\nbody\n", encoding="utf-8")
        self.doc = doc

    def tearDown(self):
        self.tmp.cleanup()

    def write_index(self, content):
        index = self.root / "index.md"
        index.write_text(content, encoding="utf-8")
        return index

    def test_valid_links_pass(self):
        index = self.write_index(
            "## Own Heading\n\n[doc](doc.md) [heading](doc.md#real-heading) "
            "[self](#own-heading) [ext](https://example.com/a)\n"
        )
        self.assertEqual(check_index.check_markdown(index), [])

    def test_missing_file_is_reported(self):
        index = self.write_index("[gone](missing.md)\n")
        problems = check_index.check_markdown(index)
        self.assertEqual(len(problems), 1)
        self.assertIn("link target missing", problems[0])

    def test_missing_anchor_is_reported(self):
        index = self.write_index("[stale](doc.md#renamed-heading)\n")
        problems = check_index.check_markdown(index)
        self.assertEqual(len(problems), 1)
        self.assertIn("anchor renamed-heading not found", problems[0])

    def test_non_markdown_target_needs_no_anchor(self):
        asset = self.root / "asset.png"
        asset.write_bytes(b"png")
        index = self.write_index("[img](asset.png)\n")
        self.assertEqual(check_index.check_markdown(index), [])

    def test_missing_file_argument(self):
        problems = check_index.check_markdown(self.root / "nope.md")
        self.assertEqual(len(problems), 1)
        self.assertIn("missing file", problems[0])


class RepoIntegrationTest(unittest.TestCase):
    def test_principles_index_and_skill_md_are_valid(self):
        for path in (
            REPO_ROOT / "PRINCIPLES-INDEX.md",
            Path(__file__).resolve().parents[1] / "SKILL.md",
        ):
            self.assertEqual(check_index.check_markdown(path), [], str(path))


if __name__ == "__main__":
    unittest.main(verbosity=2)