import { describe, expect, test } from 'vitest';
import {
  generateMcpManifest,
  validateMcpManifestInput,
  type McpManifestInput,
} from '../mcpManifest';

const validInput: McpManifestInput = {
  serverName: 'weather',
  command: 'npx',
  args: ['-y', '@example/weather-mcp'],
  env: [{ key: 'WEATHER_API_KEY', value: 'your-key-here' }],
};

describe('generateMcpManifest', () => {
  test('produces valid, parseable JSON', () => {
    expect(() => JSON.parse(generateMcpManifest(validInput))).not.toThrow();
  });

  test('nests the server under mcpServers by its name', () => {
    const parsed = JSON.parse(generateMcpManifest(validInput));
    expect(parsed.mcpServers.weather).toBeDefined();
  });

  test('includes command and args', () => {
    const parsed = JSON.parse(generateMcpManifest(validInput));
    expect(parsed.mcpServers.weather.command).toBe('npx');
    expect(parsed.mcpServers.weather.args).toEqual(['-y', '@example/weather-mcp']);
  });

  test('includes env as a key-value object', () => {
    const parsed = JSON.parse(generateMcpManifest(validInput));
    expect(parsed.mcpServers.weather.env).toEqual({ WEATHER_API_KEY: 'your-key-here' });
  });

  test('omits the env key entirely when no env vars are given', () => {
    const parsed = JSON.parse(generateMcpManifest({ ...validInput, env: [] }));
    expect(parsed.mcpServers.weather.env).toBeUndefined();
  });

  test('is indented with 2 spaces for human readability', () => {
    const output = generateMcpManifest(validInput);
    expect(output).toContain('\n  "mcpServers"');
  });
});

describe('validateMcpManifestInput', () => {
  test('returns no errors for valid input', () => {
    expect(validateMcpManifestInput(validInput).filter((i) => i.level === 'error')).toHaveLength(0);
  });

  test('errors when serverName is missing', () => {
    const issues = validateMcpManifestInput({ ...validInput, serverName: '' });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'serverName', level: 'error' }));
  });

  test('errors when serverName contains spaces', () => {
    const issues = validateMcpManifestInput({ ...validInput, serverName: 'my server' });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'serverName', level: 'error' }));
  });

  test('errors when command is missing', () => {
    const issues = validateMcpManifestInput({ ...validInput, command: '' });
    expect(issues).toContainEqual(expect.objectContaining({ field: 'command', level: 'error' }));
  });

  test('errors when an env var has a key but no value', () => {
    const issues = validateMcpManifestInput({
      ...validInput,
      env: [{ key: 'API_KEY', value: '' }],
    });
    expect(issues).toContainEqual(
      expect.objectContaining({ field: 'env[0].value', level: 'error' })
    );
  });
});
