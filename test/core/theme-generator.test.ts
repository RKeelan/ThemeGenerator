import { describe, expect, test } from 'bun:test';

import { buildThemeDocument } from '../../src/core/theme-generator.ts';

import {
  createTempDirectory,
  createTestImage,
  writeTextFixture,
} from '../helpers.ts';

describe('core theme pipeline', () => {
  test('loads an image and builds a theme', async () => {
    const workspace = await createTempDirectory('core');
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

    expect(document.sourceImage.width).toBe(2);
    expect(document.sourceImage.height).toBe(2);
    expect(document.seedColor.hex).toBe('#4285f4');
    expect(document.palettes.primary.tones['40']).toBeString();
    expect(document.theme.colors.background).toMatch(/^#/);
    expect(document.theme.colors.primary).toMatch(/^#/);
  });

  test('fails clearly for missing input files', async () => {
    try {
      await buildThemeDocument('missing.png');
      throw new Error('Expected missing input file to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/Input image not found/);
    }
  });

  test('fails clearly for unsupported image formats', async () => {
    const workspace = await createTempDirectory('core-unsupported');
    const inputPath = await writeTextFixture(
      workspace,
      'fixture.txt',
      'not an image',
    );

    try {
      await buildThemeDocument(inputPath);
      throw new Error('Expected unsupported format to fail.');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toMatch(/Unsupported image format/);
    }
  });
});
