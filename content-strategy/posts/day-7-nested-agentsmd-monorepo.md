---
FIELDS FOR SANITY STUDIO:
title: Nested AGENTS.md Files for Monorepos: A Practical Guide
slug: nested-agentsmd-monorepo
excerpt: OpenAI's main repository has 88 separate AGENTS.md files. Here's how nested AGENTS.md actually resolves in a monorepo, and when splitting yours makes sense.
cluster: agentsmd
relatedTool: agentsmd-generator
targetKeyword: nested agents.md monorepo
---

A single AGENTS.md at the repo root works fine until your repo isn't really one project — it's a `packages/api`, a `packages/web`, and a `packages/shared`, each with different conventions, different test commands, and different things an agent should and shouldn't touch. Nested AGENTS.md files solve exactly this, and coding agents that support AGENTS.md already know how to find them.

## How resolution actually works

The rule is simple: an agent reads the *nearest* AGENTS.md file in the directory tree, relative to whatever file it's currently editing. If you're editing something in `packages/api/src/`, and `packages/api/` has its own AGENTS.md, that file wins over the one at the repo root — the closest file to the point of work takes precedence, not the most general one.

This creates a natural hierarchy: put genuinely universal conventions (how the monorepo is structured, shared tooling, top-level commands) in the root file, and let each package override or add to that with its own file for anything package-specific. An agent working in `packages/web/` picks up `packages/web/AGENTS.md`; one working in `packages/shared/` picks up that package's file instead — each gets exactly the context relevant to what it's touching, not the entire monorepo's combined instructions at once.

One thing worth being precise about: explicit instructions in the chat or prompt itself still override anything in any AGENTS.md, nested or not. The file sets defaults; a direct instruction in the moment beats it.

## This isn't a theoretical pattern

This is already how large, real codebases are organized — OpenAI's main repository reportedly contains 88 separate AGENTS.md files across its subdirectories. That's not an edge case or an over-engineered setup; it's what naturally happens once a codebase is large enough that "one set of instructions for everything" stops being accurate for any single part of it.

## A practical structure

```
my-monorepo/
├── AGENTS.md              ← shared conventions, top-level commands
├── packages/
│   ├── api/
│   │   └── AGENTS.md      ← API-specific: framework, DB migration commands
│   ├── web/
│   │   └── AGENTS.md      ← frontend-specific: component conventions, build
│   └── shared/
│       └── AGENTS.md      ← shared-package rules: what's safe to change here
```

The root file doesn't need to enumerate everything in every package — that's what the nested files are for. Keep it to what's genuinely true across the whole repo: the package manager, the monorepo tool if you use one, and any convention that applies everywhere without exception.

## When to actually split one out

Splitting into a nested file makes sense once you notice yourself writing "in the API package, do X, but in the web package, do Y" inside a single root file — that's the file telling you it's trying to be two files. It's also worth a nested file when a package has its own build or test toolchain entirely separate from the rest of the repo, since "how to run tests" is exactly the kind of instruction that's wrong for an agent to inherit from the wrong context.

It's not worth splitting for a monorepo where every package genuinely shares the same conventions, language, and tooling — a nested file with nothing meaningfully different from the root just adds a file an agent has to read without adding real signal.

## Keep each file focused

The same length discipline that applies to a single-project AGENTS.md applies per-file here too — a nested file bloated with detail an agent doesn't need for that specific package defeats the purpose of splitting it out in the first place. Each file should earn its place by containing something genuinely different from what's already covered at the level above it.

## FAQ FIELD (add these as separate FAQ entries in Sanity, not body text)

**Which AGENTS.md wins if a package has one and the root does too?**
The nearest file to the code being edited wins — a package-level file overrides the root file for anything inside that package.

**Do I need a nested AGENTS.md in every package?**
No — only where a package's conventions genuinely differ from the root. A package with nothing special doesn't need its own file at all; it just inherits the root one.

**Does an explicit chat instruction override a nested AGENTS.md?**
Yes — direct instructions in the conversation take precedence over any AGENTS.md, nested or root.

## Build each one to the same standard

Whether it's a root file or a nested one three directories deep, the format and structure discipline is identical. The [AGENTS.md Generator](/tools/agentsmd-generator/) builds any single AGENTS.md — root or nested — section by section, so getting the format right doesn't get harder just because you're writing several of them across a monorepo instead of one.
