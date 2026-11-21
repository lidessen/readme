#!/usr/bin/env python3
"""Validate relative links and heading anchors in the principles index.

Checks every relative Markdown link in PRINCIPLES-INDEX.md (and in any other
Markdown files passed as arguments) for:

  * target existence -- detects missing, moved, or renamed sources;
  * heading anchor resolution for .md targets -- detects renamed headings;
  * fragment-only links resolving inside the linking file itself.

External URLs (http/https/mailto) are counted but never fetched. The script
never generates or rewrites index entries and does not judge their meaning;
entry curation is done by a maintainer reading the sources. Exit status is 1
when any problem is found, 0 otherwise.

Usage:
    python3 skills/principles-index/scripts/check_index.py [file.md ...]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from urllib.parse import unquote

SKILL_DIR = Path(__file__).resolve().parents[1]
REPO_ROOT = Path(__file__).resolve().parents[3]
DEFAULT_FILES = [
    REPO_ROOT / "PRINCIPLES-INDEX.md",
    SKILL_DIR / "SKILL.md",
]

BT = chr(96)
LINK_RE = re.compile(r"(?<!!)\[[^\[\]]*\]\(([^)\s]*)\)")
CODESPAN_RE = re.compile(BT + "([^" + BT + "]*)" + BT)
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\([^)]*\)")
LABEL_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*$")
FENCE_RE = re.compile("^(?:" + BT * 3 + "|~~~)")
EXTERNAL_RE = re.compile(r"^(?:https?://|mailto:)", re.IGNORECASE)


def strip_markdown(text):
    """Reduce a heading to its rendered text (code spans and link labels)."""
    text = CODESPAN_RE.sub(r"\1", text)
    text = IMAGE_RE.sub(r"\1", text)
    text = LABEL_RE.sub(r"\1", text)
    return text


def github_slug(heading):
    """GitHub-style heading slug: lowercase, drop punctuation, spaces to '-'.

    Unicode letters and digits (including CJK) are kept; underscores and
    hyphens are kept; every other character is dropped.
    """
    slug = []
    for char in strip_markdown(heading).lower():
        if char == " ":
            slug.append("-")
        elif char.isalnum() or char in "_-":
            slug.append(char)
    return "".join(slug)


def heading_slugs(md_text):
    """Slugs of all ATX headings in a Markdown document, ignoring code fences."""
    slugs = set()
    in_fence = False
    for line in md_text.splitlines():
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        match = HEADING_RE.match(line)
        if match:
            slugs.add(github_slug(match.group(2)))
    return slugs


def check_markdown(path):
    """Return a list of problem strings for one Markdown file."""
    problems = []
    path = Path(path)
    if not path.exists():
        return ["missing file: " + str(path)]
    text = path.read_text(encoding="utf-8")
    base = path.parent
    links = 0
    anchors = 0
    external = 0
    in_fence = False
    for lineno, line in enumerate(text.splitlines(), start=1):
        if FENCE_RE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        for match in LINK_RE.finditer(line):
            target = match.group(1)
            where = str(path) + ":" + str(lineno)
            if not target or target.startswith("<"):
                problems.append(where + ": unsupported empty link")
                continue
            if EXTERNAL_RE.match(target):
                external += 1
                continue
            links += 1
            raw_path, _, fragment = target.partition("#")
            if EXTERNAL_RE.match(raw_path):
                external += 1
                continue
            resolved = base / unquote(raw_path) if raw_path else path
            if not resolved.exists():
                problems.append(
                    where + ": link target missing: " + target
                    + " (source moved, renamed or deleted?)"
                )
                continue
            if fragment and resolved.suffix == ".md":
                anchors += 1
                frag = unquote(fragment)
                target_slugs = heading_slugs(resolved.read_text(encoding="utf-8"))
                if frag not in target_slugs:
                    problems.append(
                        where + ": anchor " + frag + " not found in "
                        + str(resolved) + " (heading renamed?)"
                    )
    print(
        "checked " + str(path) + ": " + str(links) + " relative links ("
        + str(anchors) + " anchors), " + str(external) + " external links skipped"
    )
    return problems


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "files",
        nargs="*",
        type=Path,
        help="Markdown files to check (default: PRINCIPLES-INDEX.md and SKILL.md)",
    )
    args = parser.parse_args(argv)
    files = args.files or DEFAULT_FILES
    problems = []
    for path in files:
        problems.extend(check_markdown(path))
    if problems:
        print("")
        print(str(len(problems)) + " problem(s):")
        for problem in problems:
            print("FAIL " + problem)
        return 1
    print("")
    print("All links and anchors valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())