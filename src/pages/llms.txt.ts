import type { APIRoute } from 'astro';
import { getAllPosts } from '../lib/sanity';
import { SITE, TOOLS, GUIDES } from '../lib/site';

export const prerender = true;

export const GET: APIRoute = async () => {
  const posts = await getAllPosts();

  const lines: string[] = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.tagline}`,
    '',
    'Client-side generators for SKILL.md, llms.txt, AGENTS.md, MCP server manifests, and',
    'Cursor/Windsurf rules files. No signup, no server round-trip — fill a form, get a',
    'correctly formatted file, download it.',
    '',
    '## Tools',
    '',
    ...TOOLS.map(
      (tool) => `- [${tool.title}](${SITE.origin}/tools/${tool.slug}/): ${tool.blurb}`
    ),
    '',
    '## Guides',
    '',
    ...GUIDES.map(
      (guide) => `- [${guide.title}](${SITE.origin}/guides/${guide.slug}/)`
    ),
    '',
    '## Blog',
    '',
    // Every published post, newest first — regenerated on every build, no manual upkeep.
    ...posts.map((post) => `- [${post.title}](${SITE.origin}/blog/${post.slug}/): ${post.excerpt}`),
    '',
    '## Optional',
    '',
    `- [About](${SITE.origin}/about/)`,
    `- [Contact](${SITE.origin}/contact/)`,
    `- [Privacy](${SITE.origin}/privacy/)`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
