export interface SkillInput {
  name: string;
  description: string;
  license?: string;
  body: string;
}

export interface ValidationIssue {
  field: string;
  message: string;
  level: 'error' | 'warning';
}

const KEBAB_CASE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Wraps a YAML scalar in double quotes, escaping embedded double quotes. */
function yamlQuote(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

/** Plain YAML scalars break on quotes, ": ", a trailing colon, or a leading special char. */
function needsYamlQuoting(value: string): boolean {
  if (value !== value.trim()) return true;
  if (value.includes('"')) return true;
  if (value.includes(': ') || value.endsWith(':')) return true;
  if (/^[-?:,[\]{}#&*!|>'"%@`]/.test(value)) return true;
  return false;
}

function yamlScalar(value: string): string {
  return needsYamlQuoting(value) ? yamlQuote(value) : value;
}

export function validateSkillInput(input: SkillInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const name = input.name?.trim() ?? '';
  const description = input.description?.trim() ?? '';
  const body = input.body?.trim() ?? '';

  if (!name) {
    issues.push({ field: 'name', level: 'error', message: 'Name is required.' });
  } else if (!KEBAB_CASE.test(name)) {
    issues.push({
      field: 'name',
      level: 'error',
      message: 'Name must be kebab-case: lowercase letters, digits, and hyphens only.',
    });
  }

  if (!description) {
    issues.push({
      field: 'description',
      level: 'error',
      message: 'Description is required — Claude uses it to decide when to trigger the skill.',
    });
  } else if (description.length < 20) {
    issues.push({
      field: 'description',
      level: 'warning',
      message:
        'Description is short. Include what the skill does and when to use it so Claude can match it reliably.',
    });
  }

  if (!body) {
    issues.push({ field: 'body', level: 'error', message: 'Body instructions are required.' });
  }

  return issues;
}

export function generateSkillMd(input: SkillInput): string {
  const lines: string[] = ['---'];
  lines.push(`name: ${input.name}`);
  lines.push(`description: ${yamlScalar(input.description)}`);
  if (input.license) {
    lines.push(`license: ${input.license}`);
  }
  lines.push('---', '', input.body.trim(), '');

  return lines.join('\n');
}
