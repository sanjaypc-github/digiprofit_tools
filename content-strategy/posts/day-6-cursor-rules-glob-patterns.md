---
FIELDS FOR SANITY STUDIO:
title: Cursor Rules Glob Patterns Explained (With Examples)
slug: cursor-rules-glob-patterns
excerpt: The most common reason a Cursor rule silently never fires is a glob pattern that doesn't match what you think it matches. Here's how the syntax actually works.
cluster: cursor-windsurf-rules
relatedTool: rules-file-generator
targetKeyword: cursor rules glob patterns
---

A Cursor `.mdc` rule with a `globs` field only auto-attaches when a matching file is in context — which means an incorrect glob doesn't produce an error, it just means the rule quietly never fires. This is, by a wide margin, the most common reason a rule someone wrote carefully doesn't seem to do anything.

## The two symbols that actually matter

Cursor's glob syntax is standard glob matching, and almost every mistake comes down to confusing two patterns that look similar but aren't:

- **`*`** matches any characters, but *not* across a directory separator — `src/*.tsx` matches `src/Button.tsx` but not `src/components/Button.tsx`
- **`**`** matches across directory boundaries — `src/**/*.tsx` matches both `src/Button.tsx` and `src/components/deeply/nested/Button.tsx`

If a rule is meant to apply repo-wide within a given file type but only seems to fire for files directly in one folder, this is almost always why: a single `*` where a `**` was needed.

## Common patterns by use case

```
globs: ["**/*.ts", "**/*.tsx"]        # every TypeScript file, anywhere
globs: ["src/api/**/*"]                # everything under one directory
globs: ["**/*.test.ts", "**/*.spec.ts"] # test files specifically, anywhere
globs: ["*.config.js"]                 # config files at the repo root only
```

`globs` takes an array, so a rule can match several patterns at once — you don't need separate rule files just because a rule should apply to both `.ts` and `.tsx` files.

## Test against real paths before you trust it

Because a wrong glob fails silently, the only reliable way to know a pattern works is to check it against actual file paths in your repo, not just read it and assume. If you open a file the rule is supposed to cover and it doesn't appear to be active, that's your signal to recheck the glob before assuming something else is wrong.

## Globs vs. the other two activation methods

`globs` is one of three ways a rule can activate, and it's worth being clear on when to reach for it instead of the alternatives:

- **`globs`** — automatic, based on which files are currently in context. Best for rules tied to a specific part of the codebase (an API layer, a test suite, a particular framework's files).
- **`alwaysApply: true`** — fires on every request regardless of files. Best for genuinely universal conventions that should never be skipped.
- **`description` alone, no globs, `alwaysApply: false`** — the agent decides contextually whether the rule seems relevant based on what's being asked, independent of which files are open. Best for guidance that's topical rather than file-specific — something like "how we handle database migrations," which might come up in a conversation before any migration file even exists yet.

Picking the wrong one of these three isn't a syntax error, so it won't show up as a validation failure — it just means the rule fires more often or less often than you actually wanted.

## A pattern that looks right but isn't

`src/**/*` with no file extension will match directories as well as files in some implementations, which can produce rules that seem to apply to things you didn't intend. If you only want files with a specific extension, say so explicitly (`src/**/*.ts`) rather than relying on a bare wildcard to only pick up what you expect.

## FAQ FIELD (add these as separate FAQ entries in Sanity, not body text)

**Why doesn't my rule fire even though the glob looks correct?**
Test it against a real file path in your repo rather than reading it — `*` vs `**` mistakes look nearly identical but match completely different sets of files.

**Can one rule have multiple glob patterns?**
Yes — `globs` takes an array, so a single rule can match several file types or directories without needing separate rule files.

**Should I use globs or alwaysApply for a rule I want everywhere?**
Use `alwaysApply: true` for genuinely universal rules — globs are for rules that should only activate for specific files, not as a workaround for "match everything."

## Build the glob correctly the first time

Since a wrong glob fails invisibly rather than throwing an error, it's easy to ship a rule that looks complete and simply never does anything. The [Cursor & Windsurf Rules Generator](/tools/rules-file-generator/) lets you set globs, `alwaysApply`, and a description from a form and validates that at least one of them is actually set — so a rule with no real activation signal can't make it out the door unnoticed.
