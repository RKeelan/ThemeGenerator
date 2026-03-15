export { getErrorMessage, ThemeGeneratorError } from './core/errors.ts';
export { buildThemeDocument } from './core/theme-generator.ts';
export { THEME_TARGETS } from './core/types.ts';
export { renderTarget } from './targets/index.ts';
export type {
  GeneratedPalettes,
  RenderResult,
  SeedColor,
  SemanticTheme,
  ThemeDocument,
  ThemeTarget,
} from './core/types.ts';
