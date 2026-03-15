export const THEME_TARGETS = [
  'website',
  'vscode',
  'sublime',
  'codemirror',
] as const;

export const PALETTE_TONES = [
  0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100,
] as const;

export const SEMANTIC_COLOR_ROLES = [
  'background',
  'surface',
  'surfaceAlt',
  'foreground',
  'foregroundMuted',
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'tertiary',
  'tertiaryForeground',
  'selection',
  'selectionForeground',
  'lineHighlight',
  'caret',
  'comment',
  'keyword',
  'string',
  'number',
  'type',
  'function',
  'constant',
  'link',
  'error',
  'warning',
  'success',
] as const;

export type ThemeTarget = (typeof THEME_TARGETS)[number];
export type SemanticColorRole = (typeof SEMANTIC_COLOR_ROLES)[number];
export type HexColor = `#${string}`;

export interface SourceImage {
  path: string;
  width: number;
  height: number;
  pixelCount: number;
  sampledPixelCount: number;
}

export interface SeedColor {
  argb: number;
  hex: HexColor;
}

export interface TonalPaletteSummary {
  name: string;
  hue: number;
  chroma: number;
  keyColor: HexColor;
  tones: Record<string, HexColor>;
}

export interface GeneratedPalettes {
  primary: TonalPaletteSummary;
  secondary: TonalPaletteSummary;
  tertiary: TonalPaletteSummary;
  neutral: TonalPaletteSummary;
  neutralVariant: TonalPaletteSummary;
  error: TonalPaletteSummary;
}

export type SemanticThemeColors = Record<SemanticColorRole, HexColor>;

export interface SemanticTheme {
  colors: SemanticThemeColors;
}

export interface ThemeDocument {
  sourceImage: SourceImage;
  seedColor: SeedColor;
  palettes: GeneratedPalettes;
  theme: SemanticTheme;
}

export interface RenderedFile {
  filename: string;
  content: string;
}

export interface RenderResult {
  target: ThemeTarget;
  files: RenderedFile[];
}
