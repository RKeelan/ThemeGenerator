import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { Jimp } from 'jimp';

type RgbaTuple = [number, number, number, number?];

export async function createTempDirectory(prefix: string): Promise<string> {
  const root = path.join(os.tmpdir(), 'theme-generator-tests');
  await mkdir(root, { recursive: true });
  return mkdtemp(path.join(root, `${prefix}-`));
}

export async function createTestImage(
  directory: string,
  filename: string,
  colors: RgbaTuple[][],
): Promise<string> {
  const width = colors[0]?.length ?? 0;
  const height = colors.length;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const pixel: RgbaTuple = colors[y]?.[x] ?? [0, 0, 0, 255];
      const red = pixel[0];
      const green = pixel[1];
      const blue = pixel[2];
      const alpha = pixel[3] ?? 255;
      const index = (y * width + x) * 4;
      data[index] = red;
      data[index + 1] = green;
      data[index + 2] = blue;
      data[index + 3] = alpha;
    }
  }

  const image = Jimp.fromBitmap({
    width,
    height,
    data: Buffer.from(data),
  }) as { write: (outputPath: string) => Promise<void> };
  const imagePath = path.join(directory, filename);
  await image.write(imagePath);

  return imagePath;
}

export async function writeTextFixture(
  directory: string,
  filename: string,
  content: string,
): Promise<string> {
  const filePath = path.join(directory, filename);
  await writeFile(filePath, content, 'utf8');
  return filePath;
}
