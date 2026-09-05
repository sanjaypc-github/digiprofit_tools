import { describe, expect, test } from 'vitest';
import { generateAgentsMd, validateAgentsMdInput, type AgentsMdInput } from '../agentsmd';

const validInput: AgentsMdInput = {
  projectName: 'ManifestKit',
  overview: 'A static Astro site of free generators for AI-agent config files.',
  sections: [
    { heading: 'Setup commands', content: '- `npm install`\n- `npm run dev`' },
    { heading: 'Testing instructions', content: 'Run `npm test` before committing.' },
  ],
};

describe('generateAgentsMd', () => {
  test('starts with an H1 of the project name', () => {
    expect(generateAgentsMd(validInput).startsWith('# ManifestKit\n')).toBe(true);
  });

  test('includes the overview paragraph', () => {
    expect(generateAgentsMd(validInput)).toContain(
      'A static Astro site of free generators for AI-agent config files.'
    );
  });

  test('renders each section as an H2 followed by its content', () => {
    const output = generateAgentsMd(validInput);
    expect(output).toContain('## Setup commands');
    expect(output).toContain('- `npm install`');
    expect(output).toContain('## Testing instructions');
    expect(output).toContain('Run `npm test` before committing.');
  });

  test('preserves section order', () => {
    const output = generateAgentsMd(validInput);
    expect(output.indexOf('## Setup commands')).toBeLessThan(
      output.indexOf('## Testing instructions')
    );
  });
});

describe('validateAgentsMdInput', () => {
  test('returns no errors for valid input', () => {
    expect(validateAgentsMdInput(validInput).filter((i) => i.level === 'error')).toHaveLength(0);
  });

  test('errors when projectName is missing', () => {
    const issues = validateAgentsMdInput({ ...validInput, projectName: '' });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'projectName', level: 'error' }));
  });

  test('errors when there are no sections', () => {
    const issues = validateAgentsMdInput({ ...validInput, sections: [] });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'sections', level: 'error' }));
  });

  test('errors when a section is missing a heading', () => {
    const issues = validateAgentsMdInput({
      ...validInput,
      sections: [{ heading: '', content: 'x' }],
    });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'sections[0].heading', level: 'error' })
    );
  });

  test('errors when a section has empty content', () => {
    const issues = validateAgentsMdInput({
      ...validInput,
      sections: [{ heading: 'Setup commands', content: '   ' }],
    });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'sections[0].content', level: 'error' })
    );
  });
});
