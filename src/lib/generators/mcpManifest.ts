import type { ValidationIssue } from './skillmd';

export interface McpEnvVar {
  key: string;
  value: string;
}

export interface McpManifestInput {
  serverName: string;
  command: string;
  args: string[];
  env?: McpEnvVar[];
}

export type { ValidationIssue };

export function validateMcpManifestInput(input: McpManifestInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const serverName = input.serverName?.trim() ?? '';

  if (!serverName) {
    issues.push({ field: 'serverName', level: 'error', message: 'Server name is required.' });
  } else if (/\s/.test(serverName)) {
    issues.push({
      field: 'serverName',
      level: 'error',
      message: 'Server name cannot contain spaces — it is used as a JSON object key.',
    });
  }

  if (!input.command?.trim()) {
    issues.push({
      field: 'command',
      level: 'error',
      message: 'Command is required (e.g. "npx", "node", "python").',
    });
  }

  (input.env ?? []).forEach((entry, index) => {
    if (!entry.key?.trim()) {
      issues.push({ field: `env[${index}].key`, level: 'error', message: 'Env var name is required.' });
    }
    if (!entry.value?.trim()) {
      issues.push({
        field: `env[${index}].value`,
        level: 'error',
        message: 'Env var value is required.',
      });
    }
  });

  return issues;
}

export function generateMcpManifest(input: McpManifestInput): string {
  const server: Record<string, unknown> = {
    command: input.command,
    args: input.args,
  };

  const env = input.env ?? [];
  if (env.length > 0) {
    server.env = Object.fromEntries(env.map((e) => [e.key, e.value]));
  }

  const manifest = {
    mcpServers: {
      [input.serverName]: server,
    },
  };

  return JSON.stringify(manifest, null, 2) + '\n';
}
