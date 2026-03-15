import { access } from 'node:fs/promises';
import path from 'node:path';

import { argbFromRgb } from '@material/material-color-utilities';
import { Jimp } from 'jimp';

import { ThemeGeneratorError } from './errors.ts';
import type { SourceImage } from './types.ts';

const SUPPORTED_IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.bmp',
  '.gif',
  '.tif',
  '.tiff',
]);

interface LoadedSourceImage extends SourceImage {
  argbPixels: number[];
}

function blendChannel(channel: number, alpha: number): number {
  const normalizedAlpha = alpha / 255;
  return Math.round(channel * normalizedAlpha + 255 * (1 - normalizedAlpha));
}

export async function loadSourceImage(
  inputPath: string,
): Promise<LoadedSourceImage> {
  const resolvedPath = path.resolve(inputPath);
  const extension = path.extname(resolvedPath).toLowerCase();

  if (!SUPPORTED_IMAGE_EXTENSIONS.has(extension)) {
    throw new ThemeGeneratorError(
      `Unsupported image format "${extension || 'unknown'}". Supported formats: ${[...SUPPORTED_IMAGE_EXTENSIONS].join(', ')}.`,
      'UNSUPPORTED_IMAGE_FORMAT',
    );
  }

  try {
    await access(resolvedPath);
  } catch {
    throw new ThemeGeneratorError(
      `Input image not found: ${resolvedPath}.`,
      'INPUT_NOT_FOUND',
    );
  }

  let image: Awaited<ReturnType<typeof Jimp.read>>;

  try {
    image = await Jimp.read(resolvedPath);
  } catch (error) {
    throw new ThemeGeneratorError(
      `Failed to decode image: ${resolvedPath}. ${error instanceof Error ? error.message : ''}`.trim(),
      'IMAGE_DECODE_FAILED',
    );
  }

  const { width, height, data } = image.bitmap;
  const pixelCount = width * height;
  const maxSampledPixels = 16_384;
  const stride = Math.max(
    1,
    Math.ceil(Math.sqrt(pixelCount / maxSampledPixels)),
  );
  const argbPixels: number[] = [];

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const index = (width * y + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3];

      if (
        red === undefined ||
        green === undefined ||
        blue === undefined ||
        alpha === undefined
      ) {
        continue;
      }

      if (alpha === 0) {
        continue;
      }

      argbPixels.push(
        argbFromRgb(
          blendChannel(red, alpha),
          blendChannel(green, alpha),
          blendChannel(blue, alpha),
        ),
      );
    }
  }

  if (argbPixels.length === 0) {
    throw new ThemeGeneratorError(
      `Image does not contain any visible pixels: ${resolvedPath}.`,
      'IMAGE_EMPTY',
    );
  }

  return {
    path: resolvedPath,
    width,
    height,
    pixelCount,
    sampledPixelCount: argbPixels.length,
    argbPixels,
  };
}
