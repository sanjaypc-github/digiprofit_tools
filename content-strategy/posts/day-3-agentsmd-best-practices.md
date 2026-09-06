---
FIELDS FOR SANITY STUDIO:
title: AGENTS.md Best Practices: What to Include (and Leave Out)
slug: agentsmd-best-practices
excerpt: A study of 2,500+ repositories found AGENTS.md files over 150 lines actually hurt agent performance. Here's what to put in yours instead, and what to cut.
cluster: agentsmd
relatedTool: agentsmd-generator
targetKeyword: agents.md best practices
---

The AGENTS.md spec doesn't require anything — it's an open format described simply as "a README for agents," with no mandatory fields or sections. That freedom is exactly why so many AGENTS.md files end up either nearly empty or badly bloated. Neither extreme helps.

## The finding that should change how you write one

A study analyzing more than 2,500 repositories found that AGENTS.md files longer than 150 lines showed diminishing returns — and could increase inference costs by 20-23% without any corresponding improvement in agent task performance. The technical maximum some tools enforce is 32 KiB, but that's a ceiling, not a target. Treat 150 lines as the real budget, not a suggestion.

This matters because the instinct when writing documentation is usually "more context is better." For AGENTS.md specifically, the research says the opposite past a certain point — you're paying in tokens and inference cost for guidance the agent isn't actually using better.

## Sections worth including

There's no required structure, but the sections that consistently show up across well-regarded AGENTS.md files, roughly in the order most repos use:

- **Project overview** — what the project is, primary language and framework, with versions where it matters
- **Setup / build commands** — exact commands with real flags (`pnpm install`, `pnpm test`, `pnpm build`), not vague descriptions like "install dependencies with your package manager"
- **Code style** — only the conventions that differ from language defaults; an agent already knows idiomatic TypeScript, it doesn't know your team prefers no semicolons
- **Testing instructions** — how to run the full suite, how to run a single test, and what should be mocked versus hit for real
- **Security considerations** — secrets handling, files the agent should never read or commit
- **Commit / PR guidelines** — branch naming, commit message format, merge strategy

Not every project needs every section. A single-developer side project probably doesn't need PR guidelines. Include what actually changes agent behavior for your repo, and stop there.

## Write it by hand, not with an LLM

This is counterintuitive for a file whose whole purpose is instructing an LLM, but the same research found that LLM-generated AGENTS.md files reduced task success in 5 of 8 tested settings compared to hand-written ones. The likely reason: an LLM generating documentation about your codebase tends to produce plausible-sounding generic advice, not the specific, non-obvious conventions an agent actually needs and wouldn't guess on its own. Write it yourself, even briefly — you know what's actually tripped up an agent in your repo before; a generator doesn't.

## Pair every "don't" with a "do"

Prohibition-only guidance consistently underperforms guidance that pairs a "don't" with a concrete alternative. "Don't instantiate HTTP clients directly" tells an agent what to avoid but not what to do instead, so it either guesses or falls back to the thing you just told it not to do out of habit. "Don't instantiate HTTP clients directly — use the shared `apiClient` from `lib/http`, which has retry middleware already configured" gives it both the constraint and the resolution in one line.

## Concrete examples beat descriptions

A real code snippet from your codebase showing your actual style outperforms several sentences describing that style in the abstract. If your API handlers follow a specific pattern — async/await, a particular error-wrapping convention — showing one real example (with its file path) is worth more than paragraphs of prose trying to describe it.

## Nested files for anything that isn't universal

If a piece of guidance only applies to one part of a larger repo — a specific package's build quirks, a subdirectory with different conventions — that's a signal it belongs in a nested `AGENTS.md` inside that subdirectory, not in the root file where it adds length without being relevant most of the time an agent reads it.

## FAQ FIELD (add these as separate FAQ entries in Sanity, not body text)

**Is there a required section every AGENTS.md must have?**
No — the spec has no required fields at all. Include only sections that would actually change how an agent behaves in your specific repo.

**Should I use an LLM to write my first draft?**
Be cautious — research found LLM-generated AGENTS.md files reduced task success in most tested settings compared to hand-written ones. A short, hand-written file beats a long generated one.

**What if my repo genuinely needs more than 150 lines?**
Consider splitting into nested AGENTS.md files per subdirectory instead of one long root file — each stays focused and short, and an agent only reads what's relevant to what it's editing.

## Generate the structure, write the substance

The structure and formatting — correct headings, a body that stays inside a sane length, sections that don't repeat each other — is worth generating so you can spend your actual effort on the one thing research says matters most: writing project-specific guidance yourself. The [AGENTS.md Generator](/tools/agentsmd-generator/) builds the file section by section from a form, so the formatting is never what goes wrong.
