---
FIELDS FOR SANITY STUDIO:
title: MCP Server Config Not Working? Common JSON Mistakes
slug: mcp-server-config-json-errors
excerpt: A trailing comma Claude silently ignores, a relative path, an unescaped Windows backslash — here's what actually breaks an MCP config, and how to find it fast.
cluster: mcp-servers
relatedTool: mcp-manifest-generator
targetKeyword: mcp server config json error
---

You added a server to your MCP config, restarted the app, and it's just... not there. No error dialog, no obvious failure — the server you configured simply doesn't show up. This is the most common MCP complaint, and it almost always comes down to one of a small, specific set of mistakes.

## JSON syntax mistakes Claude won't tell you about

JSON is unforgiving about commas and brackets, and the client doesn't always surface a clear parse error when something's off. A trailing comma after the last entry in an object — the kind of thing that's harmless in JavaScript — is invalid JSON and can cause the whole config, or just the malformed section, to get silently skipped.

Before anything else, run your config through a JSON validator (or `jq .` on your config file from a terminal). If it errors, you've found your problem in ten seconds instead of an hour of restarting the app.

## Paths: absolute, not relative

Configs should use absolute paths, not relative ones like `./my-server` or `~/Desktop`. The process that launches your MCP server doesn't necessarily run from the directory you expect, so a relative path that works when you test the command manually in your terminal can fail silently when the client launches it.

On Windows specifically, a single backslash in a JSON string is an escape character — `C:\Users\you\server.js` is invalid JSON because `\U` and `\s` aren't valid escape sequences. Use forward slashes (`C:/Users/you/server.js`) or doubled backslashes (`C:\\Users\\you\\server.js`) instead.

## "It's configured but not connecting" — check these next

If the JSON itself is valid and the paths are right, the next place to look is whether the client actually picked up the change:

- **A full restart, not just closing the window.** Closing a chat window or reloading a tab doesn't necessarily reload the MCP config — quit the application entirely and reopen it.
- **Run the server's command manually in a terminal first.** Copy the exact `command` and `args` from your config and run it yourself. If it crashes or errors on its own, the client isn't the problem — fix the server startup first, then put it back in the config.
- **Check the logs.** Claude Desktop writes MCP logs to `~/Library/Logs/Claude` on macOS and `%APPDATA%\Claude\logs` on Windows — the `mcp.log` file specifically will usually show you why a server failed to start, which is far more useful than guessing.
- **Look for a status indicator in the client's settings panel.** A "running" or connected indicator next to the server name confirms it actually launched — if it's absent, the client never got the process up in the first place.

## A structural mistake that's easy to make by hand

Beyond syntax, there's a structural error worth calling out separately: nesting a new server outside the `mcpServers` object, or copy-pasting an example that assumes it's the *only* entry when you're actually adding a second or third server to an existing config. The shape has to stay exactly:

```
{
  "mcpServers": {
    "your-server-name": {
      "command": "...",
      "args": ["..."],
      "env": { "KEY": "value" }
    }
  }
}
```

`env` in particular needs to be an object of key-value pairs, not an array — a config with `"env": ["API_KEY=xyz"]` looks plausible if you're used to `.env` file syntax, but it's the wrong shape entirely and will be ignored or throw a parse error depending on the client.

## Merge, don't replace

If you're adding a server to a config that already has others, the failure mode isn't always a broken new entry — sometimes it's an accidentally deleted existing one, because a copy-pasted example assumed an empty file. Always add your new server as an additional key inside the existing `mcpServers` object, and diff your change before saving if you're editing by hand.

## FAQ FIELD (add these as separate FAQ entries in Sanity, not body text)

**Why does my server show as configured but never actually connects?**
Check the logs first (`mcp.log`), then run the exact `command`/`args` from your config manually in a terminal — if it crashes standalone, the config isn't the issue, the server itself is.

**Do I need to restart my computer after editing the config?**
No — a full quit-and-reopen of the client application is enough. Closing a window or reloading a tab usually isn't.

**Is it safe to have multiple servers in one mcpServers object?**
Yes, that's the expected shape — each server is just another key inside `mcpServers`. The risk is only in editing carelessly and dropping an existing entry while adding a new one.

## Generate it instead of typing it

Every mistake above is avoidable by not hand-typing the JSON in the first place. The [MCP Server Manifest Generator](/tools/mcp-manifest-generator/) builds a correctly nested `mcpServers` entry from a form — command, arguments, and environment variables — and validates it before you download, so the structural mistakes above simply can't happen.
