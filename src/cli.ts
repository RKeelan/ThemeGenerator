#!/usr/bin/env bun

import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { Command, CommanderError, InvalidArgumentError } from 'commander';

import { getErrorMessage, ThemeGeneratorError } from './core/errors.ts';
import { buildThemeDocument } from './core/theme-generator.ts';
import {
  PALETTE_TONES,
  SEMANTIC_COLOR_ROLES,
  THEME_TARGETS,
} from './core/types.ts';
import type { ThemeDocument, ThemeTarget } from './core/types.ts';
import { renderTarget } from './targets/index.ts';

interface CliStreams {
  stdout: (message: string) => void;
  stderr: (message: string) => void;
}

function writeLine(write: (message: string) => void, message: string): void {
  write(`${message}\n`);
}

function parseTarget(value: string): ThemeTarget {
  if (THEME_TARGETS.includes(value as ThemeTarget)) {
    return value as ThemeTarget;
  }

  throw new InvalidArgumentError(
    `Invalid target "${value}". Expected one of: ${THEME_TARGETS.join(', ')}.`,
  );
}

function formatTheme(document: ThemeDocument): string {
  const palettes = [
    document.palettes.primary,
    document.palettes.secondary,
    document.palettes.tertiary,
    document.palettes.neutral,
    document.palettes.neutralVariant,
    document.palettes.error,
  ];
  const paletteLines = palettes
    .map((palette) => {
      const toneSummary = PALETTE_TONES.map(
        (tone) => `${tone}:${palette.tones[String(tone)]}`,
      ).join(' ');
      return `  ${palette.name}: hue=${palette.hue} chroma=${palette.chroma} key=${palette.keyColor}\n    ${toneSummary}`;
    })
    .join('\n');
  const themeLines = SEMANTIC_COLOR_ROLES.map(
    (role) => `  ${role}: ${document.theme.colors[role]}`,
  ).join('\n');

  return [
    `Source image: ${document.sourceImage.path}`,
    `Dimensions: ${document.sourceImage.width}x${document.sourceImage.height}`,
    `Sampled pixels: ${document.sourceImage.sampledPixelCount}/${document.sourceImage.pixelCount}`,
    `Seed color: ${document.seedColor.hex}`,
    'Palettes:',
    paletteLines,
    'Semantic theme:',
    themeLines,
  ].join('\n');
}

async function ensureOutputDirectory(outputPath: string): Promise<string> {
  const resolved = path.resolve(outputPath);

  try {
    const existing = await stat(resolved);
    if (!existing.isDirectory()) {
      throw new ThemeGeneratorError(
        `Output path must be a directory: ${resolved}.`,
        'INVALID_OUTPUT_PATH',
      );
    }
  } catch (error) {
    if (error instanceof ThemeGeneratorError) {
      throw error;
    }

    await mkdir(resolved, { recursive: true });
  }

  return resolved;
}

async function writeRenderResult(
  outputDirectory: string,
  target: ThemeTarget,
  document: ThemeDocument,
): Promise<string[]> {
  const renderResult = renderTarget(document, target);
  const writtenFiles: string[] = [];

  for (const file of renderResult.files) {
    const destination = path.join(outputDirectory, file.filename);
    await writeFile(destination, file.content, 'utf8');
    writtenFiles.push(destination);
  }

  return writtenFiles;
}

function createProgram(streams: CliStreams): Command {
  const program = new Command();

  program
    .name('theme-generator')
    .description(
      'Generate a deterministic Monet-style theme from a source image.',
    )
    .showHelpAfterError()
    .exitOverride()
    .configureOutput({
      writeOut: (message) => streams.stdout(message),
      writeErr: (message) => streams.stderr(message),
      outputError: (message, write) => write(message),
    });

  program
    .command('inspect')
    .description(
      'Inspect the derived seed color, tonal palettes, and semantic theme.',
    )
    .requiredOption('-i, --input <image>', 'Path to the source image')
    .option('--json', 'Emit JSON instead of human-readable text', false)
    .action(async (options: { input: string; json: boolean }) => {
      const document = await buildThemeDocument(options.input);

      if (options.json) {
        writeLine(streams.stdout, JSON.stringify(document, null, 2));
        return;
      }

      writeLine(streams.stdout, formatTheme(document));
    });

  program
    .command('generate')
    .description('Generate theme files for a target into an output directory.')
    .requiredOption('-i, --input <image>', 'Path to the source image')
    .requiredOption('-t, --target <target>', 'Target renderer', parseTarget)
    .requiredOption('-o, --output <path>', 'Output directory')
    .action(
      async (options: {
        input: string;
        output: string;
        target: ThemeTarget;
      }) => {
        const outputDirectory = await ensureOutputDirectory(options.output);
        const document = await buildThemeDocument(options.input);
        const writtenFiles = await writeRenderResult(
          outputDirectory,
          options.target,
          document,
        );

        for (const file of writtenFiles) {
          writeLine(streams.stdout, file);
        }
      },
    );

  return program;
}

export async function run(
  argv: string[],
  streams: CliStreams = {
    stdout: (message) => process.stdout.write(message),
    stderr: (message) => process.stderr.write(message),
  },
): Promise<void> {
  const program = createProgram(streams);

  try {
    await program.parseAsync(argv);
  } catch (error) {
    if (
      error instanceof CommanderError &&
      error.code === 'commander.helpDisplayed'
    ) {
      return;
    }

    throw error;
  }
}

if (import.meta.main) {
  run(Bun.argv).catch((error: unknown) => {
    process.stderr.write(`${getErrorMessage(error)}\n`);
    process.exit(1);
  });
}
