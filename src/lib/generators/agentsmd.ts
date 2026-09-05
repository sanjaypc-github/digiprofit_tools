import type { ValidationIssue } from './skillmd';

export interface AgentsMdSection {
  heading: string;
  content: string;
}

export interface AgentsMdInput {
  projectName: string;
  overview?: string;
  sections: AgentsMdSection[];
}

export type { ValidationIssue };

export function validateAgentsMdInput(input: AgentsMdInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!input.projectName?.trim()) {
    issues.push({ field: 'projectName', level: 'error', message: 'Project name is required.' });
  }

  if (input.sections.length === 0) {
    issues.push({
      field: 'sections',
      level: 'error',
      message: 'Add at least one section (e.g. Setup commands, Testing instructions).',
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

  return issues;
}

export function generateAgentsMd(input: AgentsMdInput): string {
  const lines: string[] = [`# ${input.projectName}`];

  if (input.overview?.trim()) {
    lines.push('', input.overview.trim());
  }

  for (const section of input.sections) {
    lines.push('', `## ${section.heading}`, '', section.content.trim());
  }

  lines.push('');
  return lines.join('\n');
}
