import { hexWithAlpha } from '../core/color.ts';
import type {
  RenderResult,
  SemanticTheme,
  ThemeDocument,
} from '../core/types.ts';

function buildSublimeTheme(theme: SemanticTheme) {
  return {
    name: 'ThemeGenerator',
    author: 'ThemeGenerator',
    globals: {
      background: theme.colors.background,
      foreground: theme.colors.foreground,
      caret: theme.colors.caret,
      selection: hexWithAlpha(theme.colors.selection, 0.6),
      selection_foreground: theme.colors.selectionForeground,
      line_highlight: hexWithAlpha(theme.colors.lineHighlight, 0.65),
      gutter: theme.colors.surface,
      gutter_foreground: theme.colors.foregroundMuted,
      guide: hexWithAlpha(theme.colors.foregroundMuted, 0.2),
      active_guide: hexWithAlpha(theme.colors.primary, 0.34),
      highlight: hexWithAlpha(theme.colors.primary, 0.18),
      find_highlight: hexWithAlpha(theme.colors.secondary, 0.26),
      misspelling: theme.colors.warning,
      minimap_border: hexWithAlpha(theme.colors.foregroundMuted, 0.22),
      accent: theme.colors.primary,
      popup_css: `html { background-color: ${theme.colors.surfaceAlt}; color: ${theme.colors.foreground}; }`,
    },
    rules: [
      {
        scope: 'comment',
        foreground: theme.colors.comment,
        font_style: 'italic',
      },
      {
        scope: 'keyword',
        foreground: theme.colors.keyword,
      },
      {
        scope: 'string',
        foreground: theme.colors.string,
      },
      {
        scope: 'constant.numeric',
        foreground: theme.colors.number,
      },
      {
        scope: 'entity.name.type, support.type',
        foreground: theme.colors.type,
      },
      {
        scope: 'entity.name.function, support.function',
        foreground: theme.colors.function,
      },
      {
        scope: 'constant, variable.other.constant',
        foreground: theme.colors.constant,
      },
      {
        scope: 'markup.underline.link',
        foreground: theme.colors.link,
      },
      {
        scope: 'invalid',
        foreground: theme.colors.error,
      },
    ],
  };
}

export function renderSublimeTheme(document: ThemeDocument): RenderResult {
  return {
    target: 'sublime',
    files: [
      {
        filename: 'theme.sublime-color-scheme',
        content: `${JSON.stringify(buildSublimeTheme(document.theme), null, 2)}\n`,
      },
    ],
  };
}
