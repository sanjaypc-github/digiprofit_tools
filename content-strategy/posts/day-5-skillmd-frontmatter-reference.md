---
FIELDS FOR SANITY STUDIO:
title: SKILL.md Frontmatter Reference: Every Field Explained
slug: skillmd-frontmatter-reference
excerpt: Six fields are standardized in a SKILL.md's YAML frontmatter, and one of them decides whether Claude ever uses the skill at all. Here's what each one actually does.
cluster: claude-skills
relatedTool: skillmd-generator
targetKeyword: skill.md frontmatter fields
---

A SKILL.md file's frontmatter looks simple — a short YAML block above some markdown — but each field in it does a specific, non-overlapping job. The Agent Skills standard defines exactly six fields: `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. Anything outside those keys fails validation, so it's worth knowing precisely what each one is for.

## The two fields every skill needs

**`name`** is a short identifier, lowercase and hyphen-separated, typically matching the directory the skill lives in and kept under about 40 characters. It's an identifier, not a description — Claude doesn't infer what a skill does from its name, so a clever or vague name does no useful work here. Keep it literal: `pdf-form-filler`, not `pdf-wizard`.

**`description`** is the field that matters most in the entire file. It's the only thing Claude reads to decide whether to use the skill for a given request — not the name, not the instructions in the body. A description needs to state both what the skill does and when it should be used, in language close to how someone would actually phrase the request. This field also does double duty: on any registry or listing page for the skill, it typically becomes the shown meta description too.

## Optional fields, and what each is actually for

**`license`** specifies how the skill is licensed for reuse — a standard SPDX identifier like `MIT` or `Apache-2.0`. Skip it for a private, internal-only skill; include it if you're publishing one others might copy or build on.

**`compatibility`** declares environment requirements the skill depends on: an intended product or platform, required system packages, whether it needs network access. This exists so a skill can be filtered out (or flagged) before it's ever invoked somewhere it can't actually run correctly.

**`allowed-tools`** pre-approves the specific tools a skill is permitted to use when it runs — a forward-looking, capability-based access control field, letting a skill declare up front "this needs Bash and Write" rather than requesting tool access implicitly through its instructions.

**`metadata`** is a structured catch-all for information that doesn't need to drive behavior but is useful to track: fields like `author`, `version`, `category`, and `last-updated` commonly live here. Unlike the other fields, `metadata` is a nested object, so it can hold as many sub-fields as you want without adding new top-level keys.

## The formatting rule that breaks the most files

The frontmatter block must start at byte 0 of the file with `---` and close with a matching `---`. Nothing — not a blank line, not a comment — can come before the opening fence. A file that starts with even a single leading newline before `---` will fail to parse as having frontmatter at all, and the entire file gets treated as plain markdown with no name or description recognized.

Inside the block, standard YAML rules apply, which is where a lot of real breakage happens: a `description` containing a colon followed by a space (`description: Fills forms: use for PDFs`) needs to be quoted, because YAML reads an unquoted colon-space as introducing a new key. The same goes for a description that starts or ends with a quote character, or contains an unescaped one in the middle.

## What a complete, correct block looks like

```yaml
---
name: pdf-form-filler
description: Fills PDF forms from structured field data and returns the completed file. Use when the user has a PDF form and a set of values to enter into it.
license: MIT
allowed-tools: Read, Write, Bash
metadata:
  author: your-name
  version: "1.0"
---
```

Everything after the closing `---` is markdown instructions — the body Claude follows once the `description` has already done its job of getting the skill selected in the first place.

## FAQ FIELD (add these as separate FAQ entries in Sanity, not body text)

**Which SKILL.md fields are actually required?**
Only `name` and `description` in practice — the others (`license`, `compatibility`, `allowed-tools`, `metadata`) are optional and situational.

**Can I add custom fields beyond the standard six?**
No — the spec allows only `name`, `description`, `license`, `allowed-tools`, `metadata`, and `compatibility`. Anything else fails validation.

**Does the name field affect whether Claude uses the skill?**
Barely — it's an identifier, not a matching signal. The `description` field does essentially all of the triggering work.

## Validate before you ship it

Because the failure modes here are almost all invisible until Claude quietly fails to trigger the skill, it's worth checking the frontmatter mechanically rather than by eye. The [SKILL.md Generator & Validator](/tools/skillmd-generator/) builds the `name`, `description`, and `license` fields for you and checks the YAML — including the exact colon-and-quote cases above — before it lets you download.
