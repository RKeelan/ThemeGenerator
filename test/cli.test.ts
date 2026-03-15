import { describe, expect, test } from 'bun:test';
import path from 'node:path';

import { run } from '../src/cli.ts';

import { createTempDirectory, createTestImage } from './helpers.ts';

function createCapturedStreams(): {
  stderr: string;
  stdout: string;
  streams: {
    stderr: (message: string) => void;
    stdout: (message: string) => void;
  };
} {
  const output: {
    stderr: string;
    stdout: string;
    streams: {
      stderr: (message: string) => void;
      stdout: (message: string) => void;
    };
  } = {
    stdout: '',
    stderr: '',
    streams: {
      stdout: (message: string) => {
        output.stdout += message;
      },
      stderr: (message: string) => {
        output.stderr += message;
      },
    },
  };

  return output;
}

describe('CLI', () => {
  test('prints help output', async () => {
    const capture = createCapturedStreams();

    await run(['bun', 'theme-generator', '--help'], capture.streams);

    expect(capture.stdout).toContain('theme-generator');
    expect(capture.stdout).toContain('inspect');
    expect(capture.stdout).toContain('generate');
    expect(capture.stderr).toBe('');
  });

  test('generates website theme assets', async () => {
    const workspace = await createTempDirectory('cli');
    const inputImage = await createTestImage(workspace, 'fixture.png', [
      [
        [66, 133, 244, 255],
        [66, 133, 244, 255],
      ],
      [
        [219, 68, 55, 255],
        [15, 157, 88, 255],
      ],
    ]);
    const outputDirectory = path.join(workspace, 'output');
    const capture = createCapturedStreams();

    await run(
      [
        'bun',
        'theme-generator',
        'generate',
        '--input',
        inputImage,
        '--target',
        'website',
        '--output',
        outputDirectory,
      ],
      capture.streams,
    );

    expect(capture.stdout).toContain(path.join(outputDirectory, 'theme.css'));
    expect(capture.stdout).toContain(
      path.join(outputDirectory, 'theme.tokens.json'),
    );
    expect(capture.stderr).toBe('');
  });
});
