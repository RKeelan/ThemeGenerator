import { loadSourceImage } from './image-loader.ts';
import { extractSeedColor, generatePalettes } from './palette-extractor.ts';
import { generateSemanticTheme } from './semantic-theme.ts';
import type { ThemeDocument } from './types.ts';

export async function buildThemeDocument(
  inputPath: string,
): Promise<ThemeDocument> {
  const sourceImage = await loadSourceImage(inputPath);
  const seedColor = extractSeedColor(sourceImage);
  const palettes = generatePalettes(seedColor);
  const publicSourceImage = {
    path: sourceImage.path,
    width: sourceImage.width,
    height: sourceImage.height,
    pixelCount: sourceImage.pixelCount,
    sampledPixelCount: sourceImage.sampledPixelCount,
  };

  return {
    sourceImage: publicSourceImage,
    seedColor,
    palettes,
    theme: generateSemanticTheme(seedColor),
  };
}
