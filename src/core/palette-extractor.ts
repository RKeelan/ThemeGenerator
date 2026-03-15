import {
  blueFromArgb,
  greenFromArgb,
  Hct,
  QuantizerMap,
  redFromArgb,
  SchemeTonalSpot,
  Score,
} from '@material/material-color-utilities';
import type { TonalPalette } from '@material/material-color-utilities';

import { argbToHex } from './color.ts';
import { PALETTE_TONES } from './types.ts';
import type {
  GeneratedPalettes,
  HexColor,
  SeedColor,
  TonalPaletteSummary,
} from './types.ts';

interface PixelSource {
  argbPixels: number[];
}

function averageArgb(argbPixels: number[]): number {
  const totals = argbPixels.reduce(
    (accumulator, argb) => {
      accumulator.red += redFromArgb(argb);
      accumulator.green += greenFromArgb(argb);
      accumulator.blue += blueFromArgb(argb);
      return accumulator;
    },
    { red: 0, green: 0, blue: 0 },
  );
  const count = Math.max(argbPixels.length, 1);
  const averageColor = Hct.fromInt(
    (255 << 24) |
      ((Math.round(totals.red / count) & 255) << 16) |
      ((Math.round(totals.green / count) & 255) << 8) |
      (Math.round(totals.blue / count) & 255),
  );

  return averageColor.toInt();
}

export function extractSeedColor(sourceImage: PixelSource): SeedColor {
  const fallbackColor = averageArgb(sourceImage.argbPixels);
  const quantized = QuantizerMap.quantize(sourceImage.argbPixels);
  const ranked = Score.score(quantized, {
    desired: 1,
    fallbackColorARGB: fallbackColor,
    filter: true,
  });
  const argb = ranked[0] ?? fallbackColor;

  return {
    argb,
    hex: argbToHex(argb),
  };
}

function summarizePalette(
  name: string,
  palette: TonalPalette,
): TonalPaletteSummary {
  const tones: Record<string, HexColor> = {};

  for (const tone of PALETTE_TONES) {
    tones[String(tone)] = argbToHex(palette.tone(tone));
  }

  return {
    name,
    hue: Number(palette.hue.toFixed(2)),
    chroma: Number(palette.chroma.toFixed(2)),
    keyColor: argbToHex(palette.keyColor.toInt()),
    tones,
  };
}

export function generatePalettes(seedColor: SeedColor): GeneratedPalettes {
  const scheme = new SchemeTonalSpot(Hct.fromInt(seedColor.argb), false, 0);

  return {
    primary: summarizePalette('primary', scheme.primaryPalette),
    secondary: summarizePalette('secondary', scheme.secondaryPalette),
    tertiary: summarizePalette('tertiary', scheme.tertiaryPalette),
    neutral: summarizePalette('neutral', scheme.neutralPalette),
    neutralVariant: summarizePalette(
      'neutralVariant',
      scheme.neutralVariantPalette,
    ),
    error: summarizePalette('error', scheme.errorPalette),
  };
}
