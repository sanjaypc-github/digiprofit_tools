import type { ValidationIssue } from './skillmd';

export interface LlmsTxtLink {
  title: string;
  url: string;
  description?: string;
}

export interface LlmsTxtSection {
  heading: string;
  links: LlmsTxtLink[];
}

export interface LlmsTxtInput {
  projectName: string;
  summary: string;
  details?: string;
  sections: LlmsTxtSection[];
}

export type { ValidationIssue };

export function validateLlmsTxtInput(input: LlmsTxtInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!input.projectName?.trim()) {
    issues.push({ field: 'projectName', level: 'error', message: 'Project name is required.' });
  }

  if (!input.summary?.trim()) {
    issues.push({
      field: 'summary',
      level: 'error',
      message: 'A one-sentence summary is required — it becomes the blockquote under the H1.',
    });
  }

  const sectionsWithLinks = input.sections.filter((s) => s.links.length > 0);
  if (sectionsWithLinks.length === 0) {
    issues.push({
      field: 'sections',
      level: 'error',
      message: 'Add at least one section with at least one link.',
    });
  }

  input.sections.forEach((section, sectionIndex) => {
    section.links.forEach((link, linkIndex) => {
      if (!link.title?.trim()) {
        issues.push({
          field: `sections[${sectionIndex}].links[${linkIndex}].title`,
          level: 'error',
          message: 'Link title is required.',
        });
      }
      if (!link.url?.trim()) {
        issues.push({
          field: `sections[${sectionIndex}].links[${linkIndex}].url`,
          level: 'error',
          message: 'Link URL is required.',
        });
      }
    });
  });

  return issues;
}

export function generateLlmsTxt(input: LlmsTxtInput): string {
  const lines: string[] = [`# ${input.projectName}`, '', `> ${input.summary}`];

  if (input.details?.trim()) {
    lines.push('', input.details.trim());
  }

  for (const section of input.sections) {
    if (section.links.length === 0) continue;
    lines.push('', `## ${section.heading}`, '');
    for (const link of section.links) {
      const suffix = link.description ? `: ${link.description}` : '';
      lines.push(`- [${link.title}](${link.url})${suffix}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}
