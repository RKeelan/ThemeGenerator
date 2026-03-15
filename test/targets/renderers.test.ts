import { describe, expect, test } from 'bun:test';

import { buildThemeDocument } from '../../src/core/theme-generator.ts';
import { renderTarget } from '../../src/targets/index.ts';

import { createTempDirectory, createTestImage } from '../helpers.ts';

describe('target renderers', () => {
  test('renders website theme CSS and token JSON', async () => {
    const workspace = await createTempDirectory('website');
    const imagePath = await createTestImage(workspace, 'fixture.png', [
      [
        [66, 133, 244, 255],
        [66, 133, 244, 255],
      ],
      [
        [66, 133, 244, 255],
        [15, 157, 88, 255],
      ],
    ]);
    const document = await buildThemeDocument(imagePath);
    const result = renderTarget(document, 'website');
    const cssFile = result.files.find((file) => file.filename === 'theme.css');
    const jsonFile = result.files.find(
      (file) => file.filename === 'theme.tokens.json',
    );

    expect(cssFile?.content).toContain(':root {');
    expect(cssFile?.content).toContain('--tg-background');
    expect(jsonFile?.content).toContain('"seedColor"');
    expect(jsonFile?.content).toContain('"theme"');
  });

  test('renders a VS Code theme document', async () => {
    const workspace = await createTempDirectory('vscode');
    const imagePath = await createTestImage(workspace, 'fixture.png', [
      [
        [66, 133, 244, 255],
        [219, 68, 55, 255],
      ],
      [
        [15, 157, 88, 255],
        [244, 180, 0, 255],
      ],
    ]);
    const document = await buildThemeDocument(imagePath);
    const result = renderTarget(document, 'vscode');
    const payload = JSON.parse(result.files[0]?.content ?? '{}') as {
      colors?: Record<string, string>;
      tokenColors?: unknown[];
      type?: string;
    };

    expect(result.files[0]?.filename).toBe('theme.json');
    expect(payload.type).toBe('dark');
    expect(payload.colors?.['editor.background']).toBe(
      document.theme.colors.background,
    );
    expect(payload.tokenColors?.length).toBeGreaterThan(0);
  });

  test('renders a Sublime Text theme document', async () => {
    const workspace = await createTempDirectory('sublime');
    const imagePath = await createTestImage(workspace, 'fixture.png', [
      [
        [66, 133, 244, 255],
        [66, 133, 244, 255],
      ],
      [
        [15, 157, 88, 255],
        [15, 157, 88, 255],
      ],
    ]);
    const document = await buildThemeDocument(imagePath);
    const result = renderTarget(document, 'sublime');
    const payload = JSON.parse(result.files[0]?.content ?? '{}') as {
      globals?: Record<string, string>;
      rules?: unknown[];
    };

    expect(result.files[0]?.filename).toBe('theme.sublime-color-scheme');
    expect(payload.globals?.background).toBe(document.theme.colors.background);
    expect(payload.rules?.length).toBeGreaterThan(0);
  });

  test('renders a CodeMirror module', async () => {
    const workspace = await createTempDirectory('codemirror');
    const imagePath = await createTestImage(workspace, 'fixture.png', [
      [
        [66, 133, 244, 255],
        [66, 133, 244, 255],
      ],
      [
        [219, 68, 55, 255],
        [219, 68, 55, 255],
      ],
    ]);
    const document = await buildThemeDocument(imagePath);
    const result = renderTarget(document, 'codemirror');
    const moduleContent = result.files[0]?.content ?? '';

    expect(result.files[0]?.filename).toBe('theme.ts');
    expect(moduleContent).toContain("from '@codemirror/language'");
    expect(moduleContent).toContain(document.theme.colors.background);
    expect(moduleContent).toContain('HighlightStyle.define');
  });
});
