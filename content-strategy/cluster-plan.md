# ManifestKit Blog Content Cluster Plan

Hub-and-spoke topic architecture for the future `/blog/` section, designed so every
post interlinks with the site's 5 existing tools and comparison guide — not just
with other blog posts. 13 posts total (1 pillar + 12 spokes), ~20,600 words.

**Methodology note**: 6 representative WebSearch queries confirmed real demand and
surfaced actual competitor framing for the 5 highest-priority topics. The remaining
topics were grouped using the SERP-overlap skill's own sanctioned shortcut (same
head-term + same intent → assume same cluster) rather than exhaustive pairwise
SERP checks (~40+ searches). Three borderline pairs are flagged below for a
spot-check before finalizing word counts — see `cluster-plan.json`.

## Pillar (expand the existing guide, don't create a new page)

| | |
|---|---|
| **Action** | Broaden `/guides/skillmd-vs-mcp-vs-agentsmd/` — add CLAUDE.md and Cursor/Windsurf rules coverage, a table of contents, and links to all 12 spokes below |
| **Title** | AI Agent Config Files Compared: SKILL.md, AGENTS.md, CLAUDE.md, MCP & Cursor Rules |
| **Why not a new page** | A live WebSearch for "cursorrules vs agents.md vs claude.md" returned 8+ dedicated competing articles — this exact 3-4-way comparison is a hot, contested query. Expanding our existing page (which already has schema + some authority) beats creating a second, cannibalizing page. |
| **Target word count** | ~3,000 (up from ~600 today) |

## Publish order (priority 1 = do first)

| # | Post | Cluster | Ties to tool | Why this priority |
|---|------|---------|--------------|---------------------|
| 1 | *(Pillar expansion)* | — | All 5 tools | Cheapest win — editing an existing indexed page, becomes the hub for everything else |
| 2 | Why Your Claude Skill Isn't Triggering | Claude Skills | SKILL.md generator | 8 independent articles confirm this is a widely-searched, unresolved pain point |
| 3 | Migrating from .cursorrules to .mdc Rules | Cursor & Windsurf | Rules generator | Timely — .cursorrules is confirmed legacy/deprecated, real migration need right now |
| 4 | MCP Server Config Not Working? | MCP Servers | MCP manifest generator | Most common MCP onboarding failure per multiple setup guides |
| 5 | AGENTS.md Best Practices | AGENTS.md | AGENTS.md generator | Backed by a citable data point (GitHub's 2,500-repo study: >150 lines underperforms) |
| 6 | Claude Desktop vs Code vs Cursor: MCP Config | MCP Servers | MCP manifest generator | |
| 7 | SKILL.md Frontmatter Reference | Claude Skills | SKILL.md generator | |
| 8 | Cursor Rules Glob Patterns Explained | Cursor & Windsurf | Rules generator | |
| 9 | Nested AGENTS.md for Monorepos | AGENTS.md | AGENTS.md generator | |
| 10 | MCP Server Security Checklist | MCP Servers | MCP manifest generator | |
| 11 | Claude Skills vs Custom Instructions | Claude Skills | SKILL.md generator | |
| 12 | AGENTS.md vs README.md | AGENTS.md | AGENTS.md generator | |
| 13 | Windsurf Rules vs Cursor Rules | Cursor & Windsurf | Rules generator | |

## Cluster structure

```
                         [1b] SKILL.md frontmatter
                        /
        [1a] Skill not triggering
                        \
                         [1c] Skills vs custom instructions
                              \
                               \
[4c] Windsurf vs Cursor  ---  [Claude Skills]
       |                                        \
[Cursor & Windsurf] ------------- PILLAR ------------- [MCP Servers]
       |                    (guide, expanded)                |
[4a] Migrate .cursorrules                          [2a] MCP config JSON errors
       |                                                      |
[4b] Cursor glob patterns              [AGENTS.md]  [2b] Desktop vs Code vs Cursor
                                       /        \              |
                          [3a] Best practices    [3c] vs README.md   [2c] Security checklist
                                       \
                                    [3b] Nested monorepo
```

(Open `cluster-map.html` in a browser for the interactive version — hover any node
to see its linked posts highlighted.)

## Internal linking rules applied

- **Pillar ↔ every spoke**: mandatory, both directions (24 links)
- **Sibling mesh within each cluster**: every post links to both other posts in its cluster (24 links) — satisfies "2-3 sibling links per spoke" without over-linking
- **2 genuine cross-cluster bridges** (not forced): the cursorrules-migration post ↔ AGENTS.md-vs-README (both about "where does this config go"), and the MCP-desktop-vs-cursor post ↔ Skills-vs-custom-instructions (both about "which Claude surface reads what")
- **Every spoke links to its cluster's existing tool page** (e.g., every Claude Skills post links to the SKILL.md generator) — this is the piece beyond the standard skill spec, since the goal here is tool traffic, not just blog-to-blog authority
- **Pillar links to all 5 existing tools**, not just the 4 cluster tool-pages, since it's the whole site's hub, not just the blog's

Result: zero orphan pages, every spoke reachable from the pillar in one click, every
spoke reachable from its tool's page in reverse via the "related tools"/nav links
that already exist on every tool page.

## Anti-thin-content check

Every post above ties to either a confirmed real pain point (activation failures,
config errors, a deprecated format) or a genuine comparison a developer would
actually search before choosing a tool — none are keyword permutations of each
other (e.g., "AGENTS.md best practices" and "AGENTS.md vs README" answer different
questions, not the same one reworded).

## Next steps

1. Verify the 3 borderline pairs in `cluster-plan.json` → `borderline_pairs_to_verify` with a quick SERP spot-check before writing those specific posts
2. Set up the Sanity schema (`post` type: title, slug, excerpt, body, publishedAt, tags, `relatedTool` reference) to match this structure
3. Build `/blog/` index + `/blog/[slug]/` page template (Article + BreadcrumbList JSON-LD, same E-E-A-T pattern as the rest of the site)
4. Write posts in the priority order above — pillar expansion first
