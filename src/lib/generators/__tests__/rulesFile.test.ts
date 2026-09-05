import { describe, expect, test } from 'vitest';
import { generateRulesFile, validateRulesFileInput, type RulesFileInput } from '../rulesFile';

const legacyInput: RulesFileInput = {
  format: 'cursor-legacy',
  projectName: 'ManifestKit',
  sections: [{ heading: 'Code style', content: 'Use TypeScript strict mode everywhere.' }],
};

describe('generateRulesFile', () => {
  test('cursor-legacy and windsurf render the same plain-text body', () => {
    const legacy = generateRulesFile(legacyInput);
    const windsurf = generateRulesFile({ ...legacyInput, format: 'windsurf' });
    expect(legacy).toBe(windsurf);
    expect(legacy).toContain('## Code style');
    expect(legacy).toContain('Use TypeScript strict mode everywhere.');
  });

  test('cursor-legacy has no YAML frontmatter fence', () => {
    expect(generateRulesFile(legacyInput).startsWith('---')).toBe(false);
  });

  test('cursor-mdc emits frontmatter with description, globs, and alwaysApply', () => {
    const output = generateRulesFile({
      ...legacyInput,
      format: 'cursor-mdc',
      mdcDescription: 'TypeScript conventions',
      globs: '**/*.ts',
      alwaysApply: false,
    });
    expect(output.startsWith('---\n')).toBe(true);
    expect(output).toContain('description: TypeScript conventions');
    expect(output).toContain('globs: **/*.ts');
    expect(output).toContain('alwaysApply: false');
    expect(output).toContain('## Code style');
  });

  test('cursor-mdc omits globs line when globs is not provided', () => {
    const output = generateRulesFile({
      ...legacyInput,
      format: 'cursor-mdc',
      alwaysApply: true,
    });
    expect(output).not.toContain('globs:');
    expect(output).toContain('alwaysApply: true');
  });
});

describe('validateRulesFileInput', () => {
  test('returns no errors for valid cursor-legacy input', () => {
    expect(validateRulesFileInput(legacyInput).filter((i) => i.level === 'error')).toHaveLength(0);
  });

  test('errors when projectName is missing', () => {
    const issues = validateRulesFileInput({ ...legacyInput, projectName: '' });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'projectName', level: 'error' }));
  });

  test('errors when there are no sections', () => {
    const issues = validateRulesFileInput({ ...legacyInput, sections: [] });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'sections', level: 'error' }));
  });

  test('cursor-mdc errors when alwaysApply, globs, and description are all absent', () => {
    const issues = validateRulesFileInput({
      ...legacyInput,
      format: 'cursor-mdc',
      alwaysApply: false,
    });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'mdcDescription', level: 'error' })
    );
  });

  test('cursor-mdc has no attachment error when alwaysApply is true', () => {
    const issues = validateRulesFileInput({
      ...legacyInput,
      format: 'cursor-mdc',
      alwaysApply: true,
    });
    expect(issues.filter((i) => i.field === 'mdcDescription')).toHaveLength(0);
  });
});
