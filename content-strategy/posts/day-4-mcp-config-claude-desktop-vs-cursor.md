---
FIELDS FOR SANITY STUDIO:
title: Claude Desktop vs Claude Code vs Cursor: MCP Config Differences
slug: mcp-config-claude-desktop-vs-cursor
excerpt: The mcpServers JSON format is identical everywhere — what differs is where the file lives, and whether your editor supports project-scoped servers at all.
cluster: mcp-servers
relatedTool: mcp-manifest-generator
targetKeyword: mcp config claude desktop vs cursor
---

The good news first: the actual JSON format for configuring an MCP server — the `mcpServers` object, with `command`, `args`, and `env` — is identical across Claude Desktop, Claude Code, and Cursor. A working server entry can usually be copy-pasted between them without changing a single field. What differs is where that JSON lives, and how many places it can live at once.

## File locations

**Claude Desktop** reads one global config file, no project-level option:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Cursor** supports two locations at once:
- Global: `~/.cursor/mcp.json`
- Project-level: `.cursor/mcp.json` at your project root

**Claude Code** (the CLI) also supports two scopes:
- User-scoped: `~/.claude.json`
- Project-scoped: `./.mcp.json`

## Why the scope difference actually matters

Claude Desktop being global-only means every server you configure is available in every conversation, everywhere, all the time. That's simple, but it means a server you only need for one specific project — say, one that talks to that project's local database — is either configured globally and visible everywhere, or not configured at all.

Cursor and Claude Code's project-scoped configs solve this properly: a `.cursor/mcp.json` or `.mcp.json` committed to a specific repo only activates for people working in that repo. Servers relevant to one codebase don't leak into every other conversation you have.

Cursor's project-level config goes one step further with workspace variables — you can reference `${workspaceFolder}` inside the config so paths resolve relative to wherever the project actually is on a given machine, instead of hardcoding an absolute path that only works on your computer.

## What this means practically

If you're building an MCP server config to share with a team, the practical takeaway is: put it in the project-scoped location (`.cursor/mcp.json` or `.mcp.json`) and commit it to the repo, rather than telling everyone to paste something into their global Claude Desktop config by hand. Anyone who clones the repo and opens it in a supporting editor gets the server automatically scoped to that project — no manual per-person setup, and no risk of it silently applying to unrelated work.

If you're on Claude Desktop specifically and need project-like isolation, there isn't a built-in equivalent — the practical workaround is naming servers clearly enough (`myproject-database` rather than just `database`) so multiple project-specific servers coexisting in one global config stay distinguishable.

## One config, multiple clients

Because the `mcpServers` shape is shared, a common real-world setup is: write the config once, then place a copy (or a symlink) wherever each tool expects it. Just remember the scope difference isn't just about file path — a project-scoped Cursor config genuinely only loads for that project, while anything in Claude Desktop's single file is global no matter what you name it or where you got the idea to put it there.

## FAQ FIELD (add these as separate FAQ entries in Sanity, not body text)

**Can I copy an MCP server config from Claude Desktop straight into Cursor?**
Yes — the `mcpServers` JSON shape is identical, so a working entry can usually be pasted as-is into whichever config file the target client expects.

**Does Claude Desktop support project-scoped servers at all?**
No — it only reads one global config file. If you need per-project isolation, Cursor or Claude Code are the options that support it.

**What does ${workspaceFolder} do in a Cursor config?**
It's a workspace variable that resolves to the current project's actual path at runtime, so a project-scoped config works on any machine without hardcoding an absolute path.

## Get the shape right once, reuse everywhere

Since the format is shared across all three clients, getting the JSON structure correct once means it's correct wherever you paste it. The [MCP Server Manifest Generator](/tools/mcp-manifest-generator/) builds that shared `mcpServers` entry from a form, so you can generate it once and drop it into whichever config file your specific client and scope actually need.
