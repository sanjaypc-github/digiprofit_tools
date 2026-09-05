import { describe, expect, test } from 'vitest';
import { generateLlmsTxt, validateLlmsTxtInput, type LlmsTxtInput } from '../llmstxt';

const validInput: LlmsTxtInput = {
  projectName: 'ManifestKit',
  summary: 'Free, no-signup generators for the config files AI agents read.',
  sections: [
    {
      heading: 'Docs',
      links: [
        { title: 'SKILL.md generator', url: 'https://digiprofit.online/tools/skillmd-generator/' },
        {
          title: 'llms.txt generator',
          url: 'https://digiprofit.online/tools/llms-txt-generator/',
          description: 'Generate this exact file for your own site.',
        },
      ],
    },
  ],
};

describe('generateLlmsTxt', () => {
  test('starts with an H1 of the project name', () => {
    const output = generateLlmsTxt(validInput);
    expect(output.startsWith('# ManifestKit\n')).toBe(true);
  });

  test('renders the summary as a blockquote', () => {
    const output = generateLlmsTxt(validInput);
    expect(output).toContain(
      '> Free, no-signup generators for the config files AI agents read.'
    );
  });

  test('renders each section as an H2 with a markdown link list', () => {
    const output = generateLlmsTxt(validInput);
    expect(output).toContain('## Docs');
    expect(output).toContain(
      '- [SKILL.md generator](https://digiprofit.online/tools/skillmd-generator/)'
    );
  });

  test('appends the link description after a colon when provided', () => {
    const output = generateLlmsTxt(validInput);
    expect(output).toContain(
      '- [llms.txt generator](https://digiprofit.online/tools/llms-txt-generator/): Generate this exact file for your own site.'
    );
  });

  test('includes the optional details paragraph when provided', () => {
    const output = generateLlmsTxt({ ...validInput, details: 'Built for AI agent developers.' });
    expect(output).toContain('Built for AI agent developers.');
  });
});

describe('validateLlmsTxtInput', () => {
  test('returns no errors for valid input', () => {
    expect(validateLlmsTxtInput(validInput).filter((i) => i.level === 'error')).toHaveLength(0);
  });

  test('errors when projectName is missing', () => {
    const issues = validateLlmsTxtInput({ ...validInput, projectName: '' });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'projectName', level: 'error' }));
  });

  test('errors when summary is missing', () => {
    const issues = validateLlmsTxtInput({ ...validInput, summary: '' });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'summary', level: 'error' }));
  });

  test('errors when there are no sections with links', () => {
    const issues = validateLlmsTxtInput({ ...validInput, sections: [] });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'sections', level: 'error' }));
  });

  test('errors when a link is missing a url', () => {
    const issues = validateLlmsTxtInput({
      ...validInput,
      sections: [{ heading: 'Docs', links: [{ title: 'Broken', url: '' }] }],
    });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'sections[0].links[0].url', level: 'error' })
    );
  });
});
