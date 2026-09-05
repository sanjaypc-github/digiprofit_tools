import { describe, expect, test } from 'vitest';
import { generateSkillMd, validateSkillInput, type SkillInput } from '../skillmd';

const validInput: SkillInput = {
  name: 'pdf-form-filler',
  description: 'Fills PDF forms from structured field data and returns the completed file.',
  body: '## Instructions\n\nRead the form fields, map them to the input data, then fill and save.',
};

describe('generateSkillMd', () => {
  test('emits YAML frontmatter with name and description', () => {
    const output = generateSkillMd(validInput);
    expect(output).toMatch(/^---\n/);
    expect(output).toContain('name: pdf-form-filler');
    expect(output).toContain(
      'description: Fills PDF forms from structured field data and returns the completed file.'
    );
  });

  test('includes the body after the closing frontmatter fence', () => {
    const output = generateSkillMd(validInput);
    const [, afterFirstFence] = output.split('---\n');
    expect(output.split('---\n')).toHaveLength(3);
    expect(output).toContain('## Instructions');
    expect(afterFirstFence).toBeDefined();
  });

  test('omits license line when license is not provided', () => {
    const output = generateSkillMd(validInput);
    expect(output).not.toContain('license:');
  });

  test('includes license line when license is provided', () => {
    const output = generateSkillMd({ ...validInput, license: 'MIT' });
    expect(output).toContain('license: MIT');
  });

  test('wraps description in quotes and escapes embedded double quotes', () => {
    const output = generateSkillMd({
      ...validInput,
      description: 'Handles "edge cases" like colons: and quotes.',
    });
    expect(output).toContain(
      'description: "Handles \\"edge cases\\" like colons: and quotes."'
    );
  });
});

describe('validateSkillInput', () => {
  test('returns no errors for valid input', () => {
    const issues = validateSkillInput(validInput);
    expect(issues.filter((i) => i.level === 'error')).toHaveLength(0);
  });

  test('errors when name is missing', () => {
    const issues = validateSkillInput({ ...validInput, name: '' });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'name', level: 'error' })
    );
  });

  test('errors when name is not kebab-case', () => {
    const issues = validateSkillInput({ ...validInput, name: 'PDF Form Filler' });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'name', level: 'error' })
    );
  });

  test('errors when description is missing', () => {
    const issues = validateSkillInput({ ...validInput, description: '' });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'description', level: 'error' })
    );
  });

  test('warns when description is too short to describe triggering conditions', () => {
    const issues = validateSkillInput({ ...validInput, description: 'Fills PDFs.' });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'description', level: 'warning' })
    );
  });

  test('errors when body is empty', () => {
    const issues = validateSkillInput({ ...validInput, body: '   ' });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'body', level: 'error' })
    );
  });
});
