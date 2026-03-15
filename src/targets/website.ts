import { toKebabCase } from '../core/color.ts';
import { SEMANTIC_COLOR_ROLES } from '../core/types.ts';
import type { RenderResult, ThemeDocument } from '../core/types.ts';

function renderCssBlock(document: ThemeDocument): string {
  const lines = SEMANTIC_COLOR_ROLES.map(
    (role) => `  --tg-${toKebabCase(role)}: ${document.theme.colors[role]};`,
  );

  return `:root {\n${lines.join('\n')}\n}`;
}

export function renderWebsiteTheme(document: ThemeDocument): RenderResult {
  const css = `${renderCssBlock(document)}\n`;
  const tokens = {
    seedColor: document.seedColor,
    palettes: document.palettes,
    theme: document.theme,
  };

  return {
    target: 'website',
    files: [
      {
        filename: 'theme.css',
        content: css,
      },
      {
        filename: 'theme.tokens.json',
        content: `${JSON.stringify(tokens, null, 2)}\n`,
      },
    ],
  };
}
