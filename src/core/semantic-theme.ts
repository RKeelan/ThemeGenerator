import {
  Hct,
  SchemeTonalSpot,
  TonalPalette,
} from '@material/material-color-utilities';

import { argbToHex } from './color.ts';
import type { SeedColor, SemanticTheme } from './types.ts';

function paletteTone(palette: TonalPalette, tone: number) {
  return argbToHex(palette.tone(tone));
}

export function generateSemanticTheme(seedColor: SeedColor): SemanticTheme {
  const scheme = new SchemeTonalSpot(Hct.fromInt(seedColor.argb), true, 0);
  const warningPalette = TonalPalette.fromHueAndChroma(86, 48);
  const successPalette = TonalPalette.fromHueAndChroma(146, 36);

  return {
    colors: {
      background: argbToHex(scheme.background),
      surface: argbToHex(scheme.surface),
      surfaceAlt: argbToHex(scheme.surfaceContainerHighest),
      foreground: argbToHex(scheme.onSurface),
      foregroundMuted: argbToHex(scheme.onSurfaceVariant),
      primary: argbToHex(scheme.primary),
      primaryForeground: argbToHex(scheme.onPrimary),
      secondary: argbToHex(scheme.secondary),
      secondaryForeground: argbToHex(scheme.onSecondary),
      tertiary: argbToHex(scheme.tertiary),
      tertiaryForeground: argbToHex(scheme.onTertiary),
      selection: argbToHex(scheme.secondaryContainer),
      selectionForeground: argbToHex(scheme.onSecondaryContainer),
      lineHighlight: argbToHex(scheme.surfaceContainerHigh),
      caret: argbToHex(scheme.primary),
      comment: paletteTone(scheme.neutralVariantPalette, 72),
      keyword: paletteTone(scheme.primaryPalette, 80),
      string: paletteTone(scheme.tertiaryPalette, 82),
      number: paletteTone(scheme.secondaryPalette, 84),
      type: paletteTone(scheme.tertiaryPalette, 88),
      function: paletteTone(scheme.primaryPalette, 90),
      constant: paletteTone(scheme.secondaryPalette, 88),
      link: argbToHex(scheme.tertiary),
      error: argbToHex(scheme.error),
      warning: paletteTone(warningPalette, 80),
      success: paletteTone(successPalette, 82),
    },
  };
}
