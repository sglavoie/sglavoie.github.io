---
title: "From a plan to unattended agent runs: how I drive coding agents one session at a time"
date: "2026-10-09T16:20:00"
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
---

---

## Introduction

Coding agents got good enough, quickly enough, that the bottleneck in my day moved. It's no longer typing the code; it's making sure the code that gets typed is the code I wanted, and that it actually works. The first few weeks went the way I suspect they go for a lot of people: one long conversation per feature, a growing pile of context, and a moment near the end where the agent cheerfully announces it's done and I discover, ten minutes later, that _"done"_ meant _"the parts I remembered are done"_.

Trying to resume progress on large features led me to try different frameworks such as [Spec Kit](https://github.com/github/spec-kit) from GitHub, [OpenSpec](https://github.com/Fission-AI/openspec), the [Kiro IDE](https://kiro.dev/), standalone Claude skills and so on. I even built my own harness-agnostic spec-driven framework which I used for a while with (slow) success with GitHub Copilot CLI, Codex and Claude Code. That level of ceremony was right for less capable models, but the picture evolved: the models got better at producing what I wanted without being walked through every step, and I found I needed a different kind of help.

What I needed wasn't more guidance for the agent. It was less trust in it. Generated code reads fluently, compiles, and is sometimes wrong in ways that only show up later: a concurrency guard that guards nothing, a test that faithfully asserts the bug. **Fluency and correctness are uncorrelated**, and anyone who has reviewed enough agent output has caught that gap personally. Two problems kept coming back:

1. **Long conversations drift.** The further a session goes, the more the early decisions fade, and the agent starts re-solving problems it already solved, or quietly undoing them.
2. **"Done" was decided by the agent.** There was no external definition of done that the agent couldn't argue with, so every finished session still needed me to establish, from scratch, whether it was actually finished.

The second one matters more than it looks. When an agent writes the code, the review doesn't go away; it moves, and it gets harder, because I'm now checking work I didn't build the understanding for. Review is the scarce resource. Anything that makes the agent produce more code without making that code cheaper to verify just moves the bottleneck around.

What I ended up with is a small (well... not so small anymore) tool called `asl`, short for _agent session loop_. The idea is simple: write a plan, cut it into sessions that each fit comfortably in one fresh conversation, attach to every session a check that a program — not the agent — runs, and then let a runner go through the sessions one at a time while I do something else. This post walks through that pipeline, why each step exists, and what I learned building it.

## Why plans, not prompts

Most of the leverage happens before any code is written. A vague prompt to an agent yields a confident implementation of something adjacent to what you wanted; a precise plan yields something much closer. So the pipeline starts with a plain Markdown plan, and with a step whose entire job is to make that plan better before anything runs.

The bar I hold a plan to is that it should be _decision-complete_: every choice the implementer shouldn't be making on their own has already been made. The test I use is a slightly hostile question: **could two competent implementers follow this plan and end up with meaningfully different behaviour?** If the answer is yes, the plan is hiding a decision — about an API, a data format, an error case, a migration order — and the agent will happily make that decision for me, silently, somewhere in the middle of a diff.

It helps to separate facts from decisions. "Which callers use this function?" is something the agent can discover by reading the repository, and it should. "Which of those callers are we willing to break?" is a judgement call, and it stays with me. A good plan records the first kind as discovery and the second kind as an explicit decision.

The step that enforces this is a [Claude Code skill](https://docs.claude.com/en/docs/claude-code/skills) called `plan-iterate`. It reads the plan, assesses how complete it is (scope, interfaces, tests, risks), asks me targeted questions about the weakest areas, and edits my answers back into the file. With `--ideal`, it first does one research pass over the codebase and describes what the _unconstrained_ ideal version of the change would look like, then ranks the gaps between my plan and that ideal by impact, and asks me to adopt, defer or reject each one. Deferred items get written into the plan so the decision is recorded rather than forgotten.

This is the same instinct behind [systematic reviews]({{< ref "/posts/systematic-reviews" >}}): it's cheaper to catch a bad idea on paper than in a diff.

## The pipeline, step by step

Here is the whole flow, from a plan to a finished run:

![Flowchart of the pipeline. PLAN.md is refined by plan-iterate, then asl prepare runs session-split, session-expand, asl baseline and asl preflight. Red or yellow preflight findings go through plan-preflight-iterate and back to preflight; an all-green plan goes to asl run, which runs one session per fresh agent turn. Python runs each session's Verify checks: a failure triggers a repair turn with the failing evidence, a pass moves to the next pending session, and the run ends as all-complete. A blocked, unsafe or guard-violating turn, or an exhausted repair budget, pauses the run with a named reason.](/images/posts/0046_from_plan_to_unattended_agent_runs/pipeline.svg)

_[Mermaid source of this diagram](/files/posts/0046_from_plan_to_unattended_agent_runs/pipeline.txt)_

The steps in the middle used to be separate commands I had to remember to run in order. These days a single `asl prepare PLAN.md --cwd REPO_ROOT` runs split, validation, expansion, baseline and the readiness gate deterministically and, on success, prints the exact `asl run` command to use next.

### Splitting: where to cut

Splitting turns one plan into a directory: a `manifest.md` listing the sessions and their readiness state, plus one `session-<id>.md` per session. Each session has a scope, the files it's expected to touch, a handoff section the agent fills in when it's done, and a completion contract (more on that below).

Where to cut took me a while to get right. A good session has:

- **One primary outcome**, with evidence that can fail on its own. If I can't write a check that distinguishes "this session worked" from "this session didn't", it isn't a session yet.
- **A useful state if the later sessions never run.** If the run stops after session 3, sessions 1 to 3 should still leave the codebase in a coherent, reviewable state, not half of a refactor.
- **Room to work in one fresh context.** Context is a split criterion in its own right: the files involved, their size, the instructions that apply and the handoffs from earlier sessions all need to fit, with space left over for the agent to think. It's much cheaper to re-split before running than to discover forty minutes in that a session can't hold everything it needs.

Two anti-patterns I now avoid on purpose: splitting implementation from its tests (the test session ends up testing whatever the implementation happened to do), and a "cleanup later" session whose absence would leave the change unsafe. Sessions are ordered by dependency, not by whatever is easiest to edit first: shared contracts and scaffolding before their consumers, additions before removals.

### Expanding: the plan is a set of claims

Every path, function signature, command and test name in a plan is a _claim_ about the repository, and plans are often written against a mental model that's a few commits out of date. Expanding is where the agent reads the actual codebase and checks each of those claims: do these files exist, do these functions have the signatures the plan assumes, is this session secretly three sessions?

The rule that makes this useful is that **corrections go into the plan, not into the implementation.** Problems get written into a `## Contract Issues` section of the session rather than silently patched around. If the agent compensates for a stale fact while implementing, the only record of that decision is the diff, and the next session inherits the stale fact. A session that turns out to be too big can be re-split into child sessions with `session-resplit` while the rest of the plan is left untouched.

### Preflight: the gate

Preflight produces red, yellow and green findings, each with a machine-readable repair hint that names the failing file, the check that failed and the smallest repair. A red or yellow finding blocks the plan from becoming `loop-ready`, and `asl run` refuses to start on anything else. When there are findings, a companion skill, `plan-preflight-iterate`, walks through them with me as a short Q&A and reruns preflight until it's clean. Because each finding names its smallest repair, that pass only touches what broke.

Preflight also checks the contracts themselves: every expected file either exists or is explicitly marked as new, every command is available, and no placeholder or open decision survived into a session.

One design rule from this part spread to the whole tool: **keep authored state separate from derived state.** The plan, the sessions, the decisions and the handoffs are authored; the manifest's readiness flags and status tables are derived, and get rebuilt from the authored files. When the two disagree, the tool pauses rather than picking a winner. A readiness table can always be regenerated; a decision that got silently overwritten can't.

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

"Done when" is for humans (and for the agent to aim at). "Verify" is for the runner: a list of checks — commands to run, files that must exist, patterns that must appear in a file — that the Python runner executes after the agent says it's finished. If a check fails, the session isn't complete, no matter how convincing the agent's summary was. Commands are given as an argument list and run without a shell, so there's no quoting to get subtly wrong.

Writing these contracts taught me that a check is only as good as what it can _falsify_. A test suite that would also pass for a plausible wrong implementation isn't evidence of anything, whoever wrote the code. Agents make that old truth urgent, because they produce plausible wrong implementations at volume. So before I accept a contract, I try to describe one implementation that would be wrong but would still pass it. If that's easy, the contract needs a sharper check, or the session is claiming more than it can prove.

Three details make this more robust than it sounds:

- **Baselines.** Before the run, `asl baseline` executes every contract and records what it reports on the unchanged codebase, and preflight won't let a plan start without that evidence. A check can declare how it should behave before any work happens: a reproducer is _expected to fail_ (proving it actually reaches the thing being changed), while protected behaviour is _expected to pass_ throughout. A protected check that already fails is a broken contract, not a goal — and a reproducer that already passes means the session is either done or testing the wrong thing. Either way, better to know up front than to blame the session for a pre-existing red.
- **Every check backs a named claim, with a limit.** "The focused test passes" says nothing about the database, the deployed service or the code paths it doesn't exercise. Keeping that limit written next to the check stops a green session from quietly turning into "it works".
- **The split between judgement and enforcement.** The agent decides _how_ to implement a session. Python decides whether it's _done_. The skill the agent runs for each session, `session-run`, is under a hundred lines of instructions, and that's on purpose: when the runner launches it, Python already holds the plan lock and has checked readiness, and after the agent returns, Python runs the verification, syncs the progress journal and refreshes readiness. Nothing that matters is left for the model to remember.

That last point turned into a design rule for everything else: **anything that must happen is code; only things that require judgement go in a prompt.**

## What a run looks like

Starting a run looks like this:

```bash
asl run ~/.local/share/agent-plans/export-command/ --harness claude
```

The runner then loops:

1. Re-read the plan files from disk.
2. Pick the first pending session.
3. Start one agent turn, in a fresh context, running `/session-run` on the plan.
4. When the turn ends, run the session's Verify checks.
5. If they pass, mark the session complete and go back to step 1. If not, put the session back to pending and hand the failing evidence to a repair turn; when the repair budget runs out, stop with a reason.

Re-reading from disk on every turn matters more than it looks. The plan directory is the single source of truth, so I can edit a future session while a run is in progress, and the next turn picks up the change. Nothing about the plan lives only in the runner's memory.

### Fresh context, durable handoffs

Every session starts in a brand new conversation, loaded with only what it needs: the instructions that apply, the plan, its own session file and contract, and the handoffs from the sessions it depends on. That's the fix for drift: there's no long transcript for early decisions to fade out of.

It also means the handoff has to carry everything. When a session finishes, the agent fills in its handoff: the files it modified, the key decisions it made, anything blocking the next session, and notes such as why it reran a check. Two optional sections are worth singling out:

- **Discovered facts** record what implementation proved about the plan's assumptions ("the config loader already caches; no need for a second layer"), so the next session doesn't spend its context re-researching a settled question.
- **Open questions** hand forward what's still uncertain, named, instead of leaving it to be rediscovered.

My test for a handoff is blunt: if losing the transcript changes what the next session is allowed to do, the handoff is incomplete. Conversations are disposable; the plan directory is the memory.

### Pausing is a feature

Agents fail in loops more than in crashes: rereading the same files, rerunning the same green check, restating the same hypothesis as a "new" fix. Left alone, an unattended run will happily burn an hour that way. So a session that can't make progress doesn't keep trying; it pauses, and a pause is a durable state transition with a stable reason, not an abandoned conversation.

The vocabulary is deliberately small and fixed: `blocked` for a decision only I can make, `unsafe` when continuing could do damage, `verify-failed` when the contract didn't pass after repairs, `no-contract` or `malformed-contract` when there's nothing trustworthy to verify against, a guard violation, and so on. The agent isn't allowed to invent new reasons. Each pause records what blocked it and the evidence, so the next step is obvious. That makes "why did it stop?" a question with an answer, and it means a retry has to come with something new — a changed hypothesis, a fixed fixture, a decision — rather than the same attempt with more hope.

It took me a while to stop treating pauses as failures. **A necessary pause is the system working.** A run that pushes through an unresolved decision to keep its completion rate up is worse than one that stops and asks.

### The controls I use all the time

`--harness` picks the agent: Claude Code, Codex or Copilot CLI. The same plan runs on any of them, and I can switch mid-run for the remaining sessions with `asl control select-harness`. A few other controls I use all the time:

- **`asl control stop-after-current`** lets the current session finish and then exits cleanly, so the next `asl run` picks up where it stopped. It's the polite version of Ctrl-C.
- **`--max-sessions N`** runs at most `N` sessions and stops successfully. Useful when I want to look at the first session's output before trusting the rest.
- **Pauses with questions.** If an agent hits a decision it shouldn't make alone, the session pauses with `reason: blocked`. `asl questions PLAN_DIR` renders the questions, and `asl run PLAN_DIR --reply "..."` resumes the paused turn with my answer.
- **`--review-harness codex`** adds a final session where a _different_ agent reviews the finished work and writes its findings to a `final-review.md`.

### A second agent, reviewing cold

That last control deserves a little more space. The reviewer runs on a different harness from the implementer, isn't allowed to change any code, and reviews _cold_: from the plan, the contracts and the actual changes, not from the implementer's account of them. Its job is to find where the change violates the intent, the protected behaviour, the scope or the limits of its own evidence. Its output is structured, not "looks good": every finding has a severity, the files it points at, an explanation, what "fixed" means, and the checks that would prove it, and the run refuses a review whose summary line and findings don't agree.

Repairs for its findings are bounded too. Findings are grouped, each group gets a capped number of repair attempts, and the review-and-repair cycles themselves are capped, so a reviewer and an implementer can't ping-pong forever. The principle I hold myself to on top of that: a repair fixes the finding inside the reviewed boundary, and anything that would change the design goes back to the plan as a new session instead of being absorbed into the fix. The cap limits rework; it never lowers the bar for acceptance.

Having one model check another's work catches a surprising number of things, but I try not to over-read it. A different model brings different habits for finding failures, not independent evidence. What actually decides acceptance is still the checks, the reproducers and me reading the diff.

<!-- TODO(seb): an example of a review finding from a second harness that the first one missed. -->

When the run ends, it ends with an explicit reason: `all-complete`, `max-sessions` or `stopped` for the happy paths, or a named pause like a failing check or a guard violation. There is no "it just stopped". And "all-complete" still means _the contracts passed_, not _the change is correct_: it's the point where I go and read the diff, the handoffs and the review, not the point where I merge.

## Guardrails, briefly

Once a run is unattended, you need a way to steer it, and the most important distinction I ended up drawing is between _advice_ and _enforcement_. Telling an agent not to deploy is steering; making sure it can't reach the deploy credentials is a boundary. A prompt expresses intent, never authority.

- **Guidance is advice.** I can send a running session a note ("prefer the existing date helper over adding a dependency") and it's delivered into the conversation. It can shape implementation choices, but it can't change the session's scope or its completion contract.
- **Only a guard enforces.** `asl control guard add` can deny a command (matched as an exact argument prefix and enforced by a per-run `PATH` shim) or protect a path (compared against a snapshot taken at the start of the turn). A violation rejects the turn and pauses the run. It never rolls anything back, so I can always see exactly what the agent did.

A guard also reports, per harness, whether it is _active_, _degraded_ or _unsupported_. Not every agent CLI exposes the same hooks, and I'd rather have a guard say "I can't enforce this here" than quietly imply it did.

There's more to supervising a run than this, like a mailbox that lets a running agent ask questions without stopping, and a separate "overseer" that watches runs across projects. They all follow the same rule: an AI that can be argued into an action must never be the guard.

## When this is overkill

Most changes don't need any of this. A local, reversible edit with a test that already covers it needs a boundary, a check and a review — that's it. I reach for a full plan and an unattended run when a change spans several sessions' worth of work, when the order of the steps matters, or when I want the run to make progress while I'm doing something else. The pipeline exists so every decision has a home when a change is big enough to need one, not so every typo fix carries maximum ceremony.

A quick way to tell: before handing a task to an agent, can I state the observable outcome and one behaviour that must not change, bound the files involved, name a check that would fail for a plausible wrong implementation, and point to someone (usually me) who can actually absorb the diff? If one of those answers is "no" or "not sure", the right next step is usually a smaller precursor — reproduce the bug, inventory the callers, write the failing test — rather than the whole change.

## Lessons from four months of building it

`asl` started as a small loop in a script in early June 2026. Four months later it's about 180,000 lines of standard-library-only Python with about 270,000 lines of tests, built largely by running plans through the tool itself. A few things I'd tell myself at the start:

- **More tests than code is not a vanity metric.** When most of the code is written by agents, the tests are the specification, and they're what makes the next change safe. There is also a `reliability-stress` suite that reruns timing-sensitive scenarios under load and across time zones, because "it passed on my machine at 3 p.m." is not good enough for something that runs unattended overnight.
- **Make failures early and loud.** Every hour spent on preflight, baselines and repair hints has paid itself back many times over in runs that didn't die halfway.
- **Promote automation by maturity, not enthusiasm.** Almost every piece of `asl` went through the same ladder: do it by hand while watching, write it down as a checklist or skill, script the deterministic parts, and only then enforce it in the runner. Skipping a rung always produced something that failed in a way I didn't yet understand.
- **Turn each run failure into a control.** The best features came from runs that went wrong. Agents pausing the whole run for every small question became a live question-and-reply channel; answers that were accepted but never actually read by the agent became receipts proving the agent consumed them. Each one started as a reproducer from a real run and landed as its own reviewed change — never as a quick patch in the middle of the run that exposed it.
- **Write down the reason for every stop.** Every pause and every exit has a stable, named reason. That made the tool scriptable, and made it possible to build a supervisor on top of it at all.
- **Don't trust a harness to enforce what it can't.** Supporting three agent CLIs taught me that they differ a lot in what they can actually guarantee, and that the honest answer is to report capabilities instead of assuming them.
- **Be suspicious of feeling faster.** A [2025 randomized trial by METR](https://arxiv.org/abs/2507.09089) found experienced open-source maintainers were about 19% _slower_ with early-2025 AI tooling on their own repositories, while believing they'd been faster. That's not a verdict on today's tools, but it's a good reason to judge a workflow by what passes review rather than by how productive a session felt.
- **Standard library only has been worth it.** No dependency upgrades, no virtual environment to break, and the whole thing installs by symlinking a directory with GNU Stow, alongside the rest of [my dotfiles]({{< ref "/posts/managing-dotfiles-with-git-bare-repository" >}}).

<!-- TODO(seb): what broke along the way, and what held up better than expected. -->

## Conclusion

The biggest change wasn't any single feature; it was moving "done" out of the agent's hands. Once every session has a contract that a program checks, the rest follows naturally: sessions can be small and start fresh, runs can be unattended, pauses become information instead of mysteries, a second agent can review the first one's work, and I can spend my attention on the plan and the review instead of on babysitting a conversation.

If you work with coding agents a lot, my advice is to start there, and to start small. Pick one bounded task you'd normally do yourself in under an hour. Before handing it over, write down what "done" means and one check that would fail if the agent got it plausibly wrong. Then review the diff against that, not against the agent's summary. If it doesn't hold up, you've lost one session and gained a concrete reason; if it does, you have your first contract.

## Resources and references

### External links

- [Agent Skills - Claude Code docs](https://docs.claude.com/en/docs/claude-code/skills)
- [Hooks - Claude Code docs](https://docs.claude.com/en/docs/claude-code/hooks)
- [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity (METR)](https://arxiv.org/abs/2507.09089)
- [OWASP Secure Coding with AI Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.html)
- [GNU Stow](https://www.gnu.org/software/stow/)

### From this website

- [Systematic reviews]({{< ref "/posts/systematic-reviews" >}})
- [Git worktrees for a better parallel workflow]({{< ref "/posts/git-worktrees-for-a-better-parallel-workflow" >}})
- [Managing dotfiles with a Git bare repository]({{< ref "/posts/managing-dotfiles-with-git-bare-repository" >}})
