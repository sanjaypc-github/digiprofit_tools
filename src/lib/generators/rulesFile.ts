import type { ValidationIssue } from './skillmd';

export interface RulesSection {
  heading: string;
  content: string;
}

export type RulesFormat = 'cursor-legacy' | 'cursor-mdc' | 'windsurf';

export interface RulesFileInput {
  format: RulesFormat;
  projectName: string;
  sections: RulesSection[];
  /** cursor-mdc only — shown to the agent so it knows when to pull this rule in. */
  mdcDescription?: string;
  /** cursor-mdc only — glob(s) that auto-attach this rule to matching files. */
  globs?: string;
  /** cursor-mdc only — attach this rule to every request regardless of file. */
  alwaysApply?: boolean;
}

export type { ValidationIssue };

export function validateRulesFileInput(input: RulesFileInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!input.projectName?.trim()) {
    issues.push({ field: 'projectName', level: 'error', message: 'Project name is required.' });
  }

  if (input.sections.length === 0) {
    issues.push({
      field: 'sections',
      level: 'error',
      message: 'Add at least one rule section (e.g. Code style, Testing).',
    });
  }

  input.sections.forEach((section, index) => {
    if (!section.heading?.trim()) {
      issues.push({
        field: `sections[${index}].heading`,
        level: 'error',
        message: 'Section heading is required.',
      });
    }
    if (!section.content?.trim()) {
      issues.push({
        field: `sections[${index}].content`,
        level: 'error',
        message: 'Section content is required.',
      });
    }
  });

  if (input.format === 'cursor-mdc') {
    const hasGlobs = Boolean(input.globs?.trim());
    const hasDescription = Boolean(input.mdcDescription?.trim());
    if (!input.alwaysApply && !hasGlobs && !hasDescription) {
      issues.push({
        field: 'mdcDescription',
        level: 'error',
        message:
          'Set alwaysApply, add globs, or write a description — Cursor needs at least one to know when this rule applies.',
      });
    }
  }

  return issues;
}

function renderSectionsBody(sections: RulesSection[]): string {
  const lines: string[] = [];
  for (const section of sections) {
    lines.push(`## ${section.heading}`, '', section.content.trim(), '');
  }
  return lines.join('\n').trimEnd() + '\n';
}

export function generateRulesFile(input: RulesFileInput): string {
  const body = renderSectionsBody(input.sections);

  if (input.format === 'cursor-legacy' || input.format === 'windsurf') {
    return body;
  }

  const frontmatter = ['---'];
  frontmatter.push(`description: ${input.mdcDescription ?? ''}`);
  if (input.globs?.trim()) {
    frontmatter.push(`globs: ${input.globs.trim()}`);
  }
  frontmatter.push(`alwaysApply: ${input.alwaysApply ? 'true' : 'false'}`);
  frontmatter.push('---', '');

  return frontmatter.join('\n') + body;
}
