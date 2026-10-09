---
title: "Feature fixture: every post feature on one page"
date: "2020-01-01T12:00:00"
lastmod: "2020-06-01T12:00:00"
slug: feature-fixture
draft: true
author: Sébastien Lavoie
ai_assistance: drafted
summary: A draft that uses every feature of a post, to look at after changing the templates, styles or scripts.
description: A draft that uses every feature of a post, to look at after changing the templates, styles or scripts. Never published.
tags:
  - tools
categories:
  - tools
---

This draft is never published. It puts every feature of a post on one page, so a change to the templates, styles or scripts can be checked in one place: run `hugo server -D` and open `/posts/feature-fixture/`. `scripts/check-fixture.py` checks that each feature's markup is still on the page, in the drafts build of `scripts/check-site.sh`. It's dated in 2020, so the note on older posts shows too, and it's marked `ai_assistance: drafted`, so the note and label on AI assistance show as well.

## Text and links

A footnote reference shows its note on hover or focus[^1], and so does a second one[^2]. A link to [another post](/posts/git-worktrees-for-a-better-parallel-workflow/) previews it, and a link to [a section of a post](/posts/aliases-also-known-as-terminal-users-best-friends/#some-aliases-that-i-find-useful) names the section too. A link to [a section of this post](#code-blocks) is left alone, as are [external links](https://gohugo.io/).

Selecting text and pressing `c` copies a link to that passage.

{{< filler 8 >}}

## Callouts

> [!NOTE]
> A note, with `inline code` and a [link](/archives/).

> [!TIP] A tip with its own title
> Tips can be titled.

> [!IMPORTANT]
> Something important.

> [!WARNING]
> A warning.

> [!CAUTION]
> A caution.

> A plain blockquote stays a blockquote.

{{< filler 6 >}}

## Code blocks

A shell block with prompts: the copy button copies only the commands.

```bash
$ git worktree add ../hotfix main
Preparing worktree (checking out 'main')
$ cd ../hotfix
```

A titled block with highlighted lines:

```go {title="main.go" hl_lines="3-4"}
package main

import "fmt"

func main() {
	fmt.Println("hello")
}
```

A block that wraps its long lines from the start:

```python {wrap=true}
message = "This line is long enough to run past the edge of the column on most screens, so it shows what wrapping does to it."
```

A block that scrolls sideways, which readers can wrap with its button:

```javascript
const line = "This line is long enough to run past the edge of the column on most screens, so the Wrap button appears for it.";
```

A tall block, collapsed until expanded:

```text
line 1
line 2
line 3
line 4
line 5
line 6
line 7
line 8
line 9
line 10
line 11
line 12
line 13
line 14
line 15
line 16
line 17
line 18
line 19
line 20
line 21
line 22
line 23
line 24
line 25
line 26
line 27
line 28
line 29
line 30
line 31
line 32
line 33
line 34
line 35
line 36
line 37
line 38
line 39
line 40
```

{{< filler 6 >}}

## Tables and images

A table of three rows or more sorts by its column headers:

| Tool | Kind   | Stars |
| ---- | ------ | ----: |
| tmux | Shell  |    35 |
| fzf  | Search |    70 |
| i3   | WM     |     9 |

An image shown smaller than its size, which opens full size on click, served as WebP:

![The i3 window manager with dark and light windows](/images/posts/0022_guided-tour-i3/demo_dark_light_background_thick_border.png)

### A third-level heading

{{< filler 6 >}}

#### A fourth-level heading

{{< filler 6 >}}

[^1]: The first note, with a [link](/topics/).
[^2]: The second note.
