#!/usr/bin/env python3

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "content" / "posts"
TOC_MARKER = "[TOC]"
H1_PATTERN = re.compile(r"^(#)(\s+.*)$")
FENCE_PATTERN = re.compile(r"^([`~]{3,})(.*)$")


def in_front_matter(lines: list[str]) -> tuple[int, bool]:
    if not lines:
        return 0, False
    if lines[0].strip() != "---":
        return 0, False

    for idx in range(1, len(lines)):
        if lines[idx].strip() in {"---", "..."}:
            return idx + 1, True

    return 0, False


def clean_file(path: Path) -> bool:
    original = path.read_text()
    lines = original.splitlines(keepends=True)
    start_idx, has_front_matter = in_front_matter(lines)

    cleaned: list[str] = []
    in_fence = False
    fence_char = ""
    fence_length = 0

    for idx, line in enumerate(lines):
        if has_front_matter and idx < start_idx:
            cleaned.append(line)
            continue

        stripped = line.strip()
        fence_match = FENCE_PATTERN.match(line.lstrip())
        if fence_match:
            marker = fence_match.group(1)
            marker_char = marker[0]
            marker_length = len(marker)

            if not in_fence:
                in_fence = True
                fence_char = marker_char
                fence_length = marker_length
            elif marker_char == fence_char and marker_length >= fence_length:
                in_fence = False
                fence_char = ""
                fence_length = 0

            cleaned.append(line)
            continue

        if not in_fence and stripped == TOC_MARKER:
            continue

        if not in_fence:
            heading_match = H1_PATTERN.match(line)
            if heading_match:
                line = f"##{heading_match.group(2)}"
                if not line.endswith("\n"):
                    line += "\n"

        cleaned.append(line)

    updated = "".join(cleaned)
    if updated == original:
        return False

    path.write_text(updated)
    return True


def main() -> int:
    changed = []
    for path in sorted(POSTS_DIR.glob("*.md")):
        if clean_file(path):
            changed.append(path)

    for path in changed:
        print(path.relative_to(ROOT))

    print(f"changed_files={len(changed)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
