---
FIELDS FOR SANITY STUDIO (fill these into the form fields, not the body):
title: Migrating from .cursorrules to Cursor's .mdc Rules
slug: migrate-cursorrules-to-mdc
excerpt: .cursorrules is legacy now — Cursor reads .cursor/rules/*.mdc files instead, with per-file scoping the old format never had. Here's exactly how to move over.
cluster: cursor-windsurf-rules
relatedTool: rules-file-generator
targetKeyword: migrate cursorrules to mdc
---

If you still have a `.cursorrules` file sitting at your repo root, it still works today — but it's the legacy format, and Cursor has moved on. The current mechanism is a `.cursor/rules/` directory full of `.mdc` files, and it can do things a single `.cursorrules` file structurally can't: scope a rule to only certain files, or only pull it in when it's actually relevant.

## Why this migration is worth doing, not just optional

A single `.cursorrules` file is all-or-nothing — every rule in it applies to every request, regardless of what you're actually working on. That's fine for a five-line style guide. It gets messy once you have rules for your API layer, your test suite, and your frontend components all crammed into one file that fires on all of them at once, all the time.

`.mdc` rules fix this by attaching metadata to each rule file: which files it should auto-attach to, whether it should always apply, or whether Cursor should decide contextually. You get several small, targeted rule files instead of one growing monolith.

## The frontmatter you need to know

Every `.mdc` file needs a YAML frontmatter block with three fields Cursor actually reads:

```
---
description: Brief explanation of what this rule is for
globs: ["src/api/**/*"]
alwaysApply: false
---
Your rule content in plain markdown goes here.
```

- **description** — what Cursor shows itself when deciding if this rule is relevant to a request it can't match by file path alone (this is what lets a rule get pulled in by topic, not just by which files are open)
- **globs** — file patterns that auto-attach the rule the moment a matching file is in context
- **alwaysApply** — set `true` to make the rule fire on every request regardless of files or description

One easy-to-miss detail: a plain `.md` file dropped into `.cursor/rules/` with no frontmatter is silently ignored by the rules system. It has no `description`, no `globs`, and `alwaysApply` isn't set, so Cursor has no signal for when it should ever apply. If you're migrating an old rule and it doesn't seem to be firing, check this first — it's the single most common reason a migrated rule goes quiet.

## The actual migration steps

1. **Create the directory.** `.cursor/rules/` at your project root, if it doesn't already exist.
2. **Split your `.cursorrules` file by topic**, not by copying it wholesale into one big `.mdc` file. If your old file mixed "always use TypeScript strict mode" with "API handlers should use async/await and Mangum," those are two different rules with two different scopes — one probably wants `alwaysApply: true`, the other wants `globs: ["src/api/**/*"]`.
3. **Write the frontmatter for each split-out rule**, choosing the narrowest scope that's actually correct. A rule that should only ever matter for test files doesn't need `alwaysApply: true` — give it `globs: ["**/*.test.ts", "**/*.spec.ts"]` instead, so it doesn't add noise to every unrelated request.
4. **Test each glob against real file paths in your repo** before you trust it. Cursor's glob matching is strict, and a pattern that looks right can silently fail to match anything.
5. **Leave the old `.cursorrules` file in place until you've verified the new rules fire correctly**, then delete it. It's not a breaking change to have both during the transition — Cursor just also reads the legacy file if it's still there.

## What doesn't carry over cleanly

Not everything in an old `.cursorrules` file maps neatly to a single `.mdc` file. If your file had genuinely universal, always-relevant guidance (project structure, general conventions that apply no matter what file is open), that's a good candidate to keep as `AGENTS.md` instead of a Cursor-specific `.mdc` rule — AGENTS.md is read by more than just Cursor, so project-wide guidance placed there works whether someone's using Cursor, Codex, or another agent entirely. Save `.mdc`'s glob-scoping for genuinely file-specific rules where that scoping actually earns its keep.

## FAQ FIELD (add these as separate FAQ entries in Sanity, not body text)

**Do I need to delete .cursorrules right away?**
No — Cursor still reads it if it's present, so you can migrate incrementally and delete it once you've verified the replacement `.mdc` rules actually fire.

**Can a project use both .cursorrules and .mdc rules at once?**
Yes, temporarily, during migration. Long-term it's worth fully moving to `.mdc` since it's the actively maintained format and the only one with per-file scoping.

**What happens if I forget the frontmatter entirely?**
The file is treated as a plain markdown file with no activation signal and is ignored by the rules system — it won't error, it just never applies.

## Skip the hand-formatting

Getting the YAML right — the exact quoting, the glob array syntax, remembering that a rule with no `alwaysApply`, no `globs`, and no real `description` will just never fire — is exactly the kind of thing worth generating instead of typing from memory. The [Cursor & Windsurf Rules Generator](/tools/rules-file-generator/) builds a correctly formatted `.mdc` file (or the legacy format, or a Windsurf `.windsurfrules` file) from a form, and won't let you download one that's missing the piece that makes it actually apply.
