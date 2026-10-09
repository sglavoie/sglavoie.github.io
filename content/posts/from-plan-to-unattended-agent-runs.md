---
title: "From a plan to unattended agent runs: how I drive coding agents one session at a time"
date: "2026-10-09T09:00:00"
slug: from-plan-to-unattended-agent-runs
author: Sébastien Lavoie
ai_assistance: drafted
summary: "Long conversations with a coding agent drift, and \"done\" too often means \"the agent said so\". This is the pipeline I built to turn a plan into small sessions with checks the agent can't talk its way around — a continuation of the same instinct behind [systematic reviews](/posts/systematic-reviews/) and [parallel work with Git worktrees](/posts/git-worktrees-for-a-better-parallel-workflow/)."
description: "Long conversations with a coding agent drift, and done too often means the agent said so. This is the pipeline I built to turn a plan into small sessions with checks the agent can't talk its way around."
categories:
  - workflow
tags:
  - ai
  - agents
  - automation
  - claude-code
  - productivity
  - python
draft: true
---

---

## Introduction

Coding agents got good enough, quickly enough, that the bottleneck in my day moved. It's no longer typing the code; it's making sure the code that gets typed is the code I wanted, and that it actually works. The first few weeks went the way I suspect they go for a lot of people: one long conversation per feature, a growing pile of context, and a moment near the end where the agent cheerfully announces it's done and I discover, ten minutes later, that _"done"_ meant _"the parts I remembered are done"_.

Trying to resume progress on large features led me to try different frameworks such as [Spec Kit](https://github.com/github/spec-kit) from GitHub, [OpenSpec](https://github.com/Fission-AI/openspec), the [Kiro IDE](https://kiro.dev/), standalone Claude skills and so on. I even built my own harness-agnostic spec-driven framework which I have used for a while with (slow) success with GitHub Copilot CLI, Codex and Claude Code. The level of ceremony was right for less-capable models, but the picture evolved, and I found I no longer needed the same type of assistance, as the AI was getting better at producing the desired output without being guided in a precise manner.

Two problems kept coming back:

1. **Long conversations drift.** The further a session goes, the more the early decisions fade, and the agent starts re-solving problems it already solved, or quietly undoing them.
2. **"Done" was decided by the agent.** There was no external definition of done that the agent couldn't argue with.

What I ended up with is a small (well... not so small anymore) tool called `asl`, short for _agent session loop_. The idea is simple: write a plan, cut it into sessions that each fit comfortably in one conversation, attach to every session a check that a program — not the agent — runs, and then let a runner go through the sessions one at a time while I do something else. This post walks through that pipeline, why each step exists, and what I learned building it.

## Why plans, not prompts

Most of the leverage happens before any code is written. A vague prompt to an agent yields a confident implementation of something adjacent to what you wanted; a precise plan yields something much closer. So the pipeline starts with a plain Markdown plan, and with a step whose entire job is to make that plan better before anything runs.

That step is a [Claude Code skill](https://docs.claude.com/en/docs/claude-code/skills) called `plan-iterate`. It reads the plan, assesses how complete it is (scope, interfaces, tests, risks), asks me targeted questions about the weakest areas, and edits my answers back into the file. With `--ideal`, it first does one research pass over the codebase and describes what the _unconstrained_ ideal version of the change would look like, then ranks the gaps between my plan and that ideal by impact, and asks me to adopt, defer or reject each one. Deferred items get written into the plan so the decision is recorded rather than forgotten.

This is the same instinct behind [systematic reviews]({{< ref "/posts/systematic-reviews" >}}): it's cheaper to catch a bad idea on paper than in a diff.

## The pipeline, step by step

Here is the whole flow, from a plan to a finished run:

```text
PLAN.md
  │  plan-iterate (--ideal)     refine the plan with Q&A
  ▼
  │  session-split              cut into session-01.md, session-02.md, ... + manifest.md
  ▼
  │  session-expand             check every claim against the real codebase
  ▼
  │  asl baseline               record what the checks report before any change
  ▼
  │  asl preflight              gate: is this plan "loop-ready"?
  ▼
  │  asl run                    one session per agent turn, verified by Python
  ▼
done (or paused, with a reason)
```

The steps in the middle used to be separate commands I had to remember to run in order. These days a single `asl prepare PLAN.md --cwd REPO_ROOT` runs split, validation, expansion, baseline and the readiness gate deterministically and, on success, prints the exact `asl run` command to use next.

A few things worth calling out:

- **Splitting** turns one plan into a directory: a `manifest.md` listing the sessions and their readiness state, plus one `session-<id>.md` per session. Each session has a scope, the files it's expected to touch, a handoff section the agent fills in when it's done, and a completion contract (more on that below).
- **Expanding** is where the agent reads the actual codebase and checks the plan against it: do these files exist, do these functions have the signatures the plan assumes, is this session secretly three sessions? Problems get written into a `## Contract Issues` section of the session rather than silently patched. A session that's still too big can be re-split into child sessions.
- **Preflight** is the gate. It produces red, yellow and green findings, each with a machine-readable repair hint. A red or yellow finding blocks the plan from becoming `loop-ready`, and `asl run` refuses to start on anything else. When there are findings, a companion skill, `plan-preflight-iterate`, walks through them with me as a short Q&A and reruns preflight until it's clean.

The point of all this ceremony is to move failures earlier. A missing file discovered during preflight costs a few seconds; the same missing file discovered forty minutes into a run costs a confused agent, a half-finished session and a messy diff.

## Completion contracts: who decides what "done" means

This is the part I'd keep if I had to throw everything else away.

Every session file ends with a block like this:

````markdown
## Completion Contract

### Done when

- The `export` command writes one JSON file per project.
- Existing CLI tests still pass.

### Verify

```json
{
  "session": "02",
  "checks": [
    {
      "name": "unit-suite",
      "type": "command",
      "argv": ["python3", "-m", "unittest", "-q"],
      "timeout_seconds": 180
    }
  ]
}
```
````

"Done when" is for humans (and for the agent to aim at). "Verify" is for the runner: a list of checks — commands to run, files that must exist, patterns that must appear in a file — that the Python runner executes after the agent says it's finished. If a check fails, the session isn't complete, no matter how convincing the agent's summary was.

Two details make this more robust than it sounds:

- **Baselines.** Before the run, `asl baseline` executes every contract and records what it reports on the unchanged codebase. Preflight uses that evidence: a check that already fails before any work starts is a broken contract, not a goal, and it's better to know that up front.
- **The split between judgement and enforcement.** The agent decides _how_ to implement a session. Python decides whether it's _done_. The skill the agent runs for each session, `session-run`, is under a hundred lines of instructions, and that's on purpose: when the runner launches it, Python already holds the plan lock and has checked readiness, and after the agent returns, Python runs the verification, syncs the progress journal and refreshes readiness. Nothing that matters is left for the model to remember.

That second point turned into a design rule for everything else: **anything that must happen is code; only things that require judgement go in a prompt.**

## What a run looks like

Starting a run looks like this:

```bash
asl run ~/.local/share/agent-plans/export-command/ --harness claude
```

The runner then loops:

1. Re-read the plan files from disk.
2. Pick the first pending session.
3. Start one agent turn running `/session-run` on the plan.
4. When the turn ends, run the session's Verify checks.
5. If they pass, mark the session complete and go back to step 1. If not, stop with a reason.

Re-reading from disk on every turn matters more than it looks. The plan directory is the single source of truth, so I can edit a future session while a run is in progress, and the next turn picks up the change. Nothing about the plan lives only in the runner's memory.

`--harness` picks the agent: Claude Code, Codex or Copilot CLI. The same plan runs on any of them, and I can switch mid-run for the remaining sessions with `asl control select-harness`. A few other controls I use all the time:

- **`asl control stop-after-current`** lets the current session finish and then exits cleanly, so the next `asl run` picks up where it stopped. It's the polite version of Ctrl-C.
- **`--max-sessions N`** runs at most `N` sessions and stops successfully. Useful when I want to look at the first session's output before trusting the rest.
- **Pauses with questions.** If an agent hits a decision it shouldn't make alone, the session pauses with `reason: blocked`. `asl questions PLAN_DIR` renders the questions, and `asl run PLAN_DIR --reply "..."` resumes the paused turn with my answer.
- **`--review-harness codex`** adds a final session where a _different_ agent critiques the finished work and writes its findings to a `final-review.md`. Repairs for its findings are capped, so a reviewer and an implementer can't ping-pong forever. Having one model check another's work catches a surprising number of things.

<!-- TODO(seb): an example of a review finding from a second harness that the first one missed. -->

When the run ends, it ends with an explicit reason: `all-complete`, `max-sessions` or `stopped` for the happy paths, or a named pause like a failing check or a guard violation. There is no "it just stopped".

## Guardrails, briefly

Once a run is unattended, you need a way to steer it, and the most important distinction I ended up drawing is between _advice_ and _enforcement_.

- **Guidance is advice.** I can send a running session a note ("prefer the existing date helper over adding a dependency") and it's delivered into the conversation. It can shape implementation choices, but it can't change the session's scope or its completion contract.
- **Only a guard enforces.** `asl control guard add` can deny a command (matched as an exact argument prefix and enforced by a per-run `PATH` shim) or protect a path (compared against a snapshot taken at the start of the turn). A violation rejects the turn and pauses the run. It never rolls anything back, so I can always see exactly what the agent did.

A guard also reports, per harness, whether it is _active_, _degraded_ or _unsupported_. Not every agent CLI exposes the same hooks, and I'd rather have a guard say "I can't enforce this here" than quietly imply it did.

There's much more to supervising a run than this — the mailbox that lets a running agent ask questions without stopping, and a separate "overseer" whose rule is that an AI that can be argued into an action must never be the guard. That's a post of its own.

## Lessons from four months of building it

`asl` started as a small loop in a script in early June 2026. Four months later it's about 180,000 lines of standard-library-only Python with about 270,000 lines of tests, built largely by running plans through the tool itself. A few things I'd tell myself at the start:

- **More tests than code is not a vanity metric.** When most of the code is written by agents, the tests are the specification, and they're what makes the next change safe. There is also a `reliability-stress` suite that reruns timing-sensitive scenarios under load and across time zones, because "it passed on my machine at 3 p.m." is not good enough for something that runs unattended overnight.
- **Make failures early and loud.** Every hour spent on preflight, baselines and repair hints has paid itself back many times over in runs that didn't die halfway.
- **Write down the reason for every stop.** Every pause and every exit has a stable, named reason. That made the tool scriptable, and made it possible to build a supervisor on top of it at all.
- **Don't trust a harness to enforce what it can't.** Supporting three agent CLIs taught me that they differ a lot in what they can actually guarantee, and that the honest answer is to report capabilities instead of assuming them.
- **Standard library only has been worth it.** No dependency upgrades, no virtual environment to break, and the whole thing installs by symlinking a directory with GNU Stow, alongside the rest of [my dotfiles]({{< ref "/posts/managing-dotfiles-with-git-bare-repository" >}}).

<!-- TODO(seb): what broke along the way, and what held up better than expected. -->

## Conclusion

The biggest change wasn't any single feature; it was moving "done" out of the agent's hands. Once every session has a contract that a program checks, the rest follows naturally: sessions can be small, runs can be unattended, a second agent can review the first one's work, and I can spend my attention on the plan instead of on babysitting a conversation. If you work with coding agents a lot, my advice is to start there — even a single shell command that has to pass before you accept a change goes a long way.

In the next post I'll look at the other half: how to supervise a run that's going on without you, and why the thing doing the supervising should never be the guard.

## Resources and references

### External links

- [Agent Skills - Claude Code docs](https://docs.claude.com/en/docs/claude-code/skills)
- [Hooks - Claude Code docs](https://docs.claude.com/en/docs/claude-code/hooks)
- [GNU Stow](https://www.gnu.org/software/stow/)

### From this website

- [Systematic reviews]({{< ref "/posts/systematic-reviews" >}})
- [Git worktrees for a better parallel workflow]({{< ref "/posts/git-worktrees-for-a-better-parallel-workflow" >}})
- [Managing dotfiles with a Git bare repository]({{< ref "/posts/managing-dotfiles-with-git-bare-repository" >}})
