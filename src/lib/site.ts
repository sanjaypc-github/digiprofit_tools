export const SITE = {
  name: 'ManifestKit',
  domain: 'digiprofit.online',
  origin: 'https://digiprofit.online',
  tagline: 'Free generators for the config files AI agents read.',
  author: 'The ManifestKit Team',
  gaMeasurementId: 'G-D6WBZ1F705',
  sanity: {
    projectId: '1ki5g9e2',
    dataset: 'production',
    apiVersion: '2026-09-06',
  },
} as const;

export const CLUSTERS: Record<string, { name: string; toolSlug: string }> = {
  'claude-skills': { name: 'Claude Skills', toolSlug: 'skillmd-generator' },
  'mcp-servers': { name: 'MCP Servers', toolSlug: 'mcp-manifest-generator' },
  agentsmd: { name: 'AGENTS.md', toolSlug: 'agentsmd-generator' },
  'cursor-windsurf-rules': { name: 'Cursor & Windsurf Rules', toolSlug: 'rules-file-generator' },
};

export interface ToolMeta {
  slug: string;
  title: string;
  shortTitle: string;
  blurb: string;
}

export const TOOLS: ToolMeta[] = [
  {
    slug: 'skillmd-generator',
    title: 'SKILL.md Generator & Validator',
    shortTitle: 'SKILL.md Generator',
    blurb: 'Build a valid Claude Skill file with working frontmatter.',
  },
  {
    slug: 'llms-txt-generator',
    title: 'llms.txt Generator',
    shortTitle: 'llms.txt Generator',
    blurb: 'Produce a spec-correct llms.txt index for your site.',
  },
  {
    slug: 'agentsmd-generator',
    title: 'AGENTS.md Generator',
    shortTitle: 'AGENTS.md Generator',
    blurb: 'Write the README coding agents actually read.',
  },
  {
    slug: 'mcp-manifest-generator',
    title: 'MCP Server Manifest Generator',
    shortTitle: 'MCP Manifest Generator',
    blurb: 'Generate a ready-to-paste mcpServers JSON entry.',
  },
  {
    slug: 'rules-file-generator',
    title: 'Cursor & Windsurf Rules Generator',
    shortTitle: 'Rules File Generator',
    blurb: 'Create .cursorrules, .mdc, or .windsurfrules files.',
  },
];

export interface GuideMeta {
  slug: string;
  title: string;
}

export const GUIDES: GuideMeta[] = [
  {
    slug: 'skillmd-vs-mcp-vs-agentsmd',
    title: 'SKILL.md vs MCP Manifest vs AGENTS.md',
  },
];
