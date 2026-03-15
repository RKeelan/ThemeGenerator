import { hexWithAlpha } from '../core/color.ts';
import type {
  RenderResult,
  SemanticTheme,
  ThemeDocument,
} from '../core/types.ts';

function buildVsCodeTheme(theme: SemanticTheme) {
  return {
    $schema: 'vscode://schemas/color-theme',
    name: 'ThemeGenerator',
    type: 'dark',
    semanticHighlighting: false,
    colors: {
      foreground: theme.colors.foreground,
      focusBorder: theme.colors.primary,
      'textLink.foreground': theme.colors.link,
      errorForeground: theme.colors.error,
      'button.background': theme.colors.primary,
      'button.foreground': theme.colors.primaryForeground,
      'button.hoverBackground': theme.colors.secondary,
      'input.background': theme.colors.surfaceAlt,
      'input.foreground': theme.colors.foreground,
      'input.placeholderForeground': theme.colors.foregroundMuted,
      'editor.background': theme.colors.background,
      'editor.foreground': theme.colors.foreground,
      'editorCursor.foreground': theme.colors.caret,
      'editor.lineHighlightBackground': hexWithAlpha(
        theme.colors.lineHighlight,
        0.58,
      ),
      'editor.selectionBackground': hexWithAlpha(theme.colors.selection, 0.5),
      'editor.selectionHighlightBackground': hexWithAlpha(
        theme.colors.selection,
        0.3,
      ),
      'editor.findMatchHighlightBackground': hexWithAlpha(
        theme.colors.secondary,
        0.35,
      ),
      'editor.wordHighlightBackground': hexWithAlpha(theme.colors.primary, 0.2),
      'editorGutter.background': theme.colors.surface,
      'editorLineNumber.foreground': theme.colors.foregroundMuted,
      'editorLineNumber.activeForeground': theme.colors.foreground,
      'editorIndentGuide.background1': hexWithAlpha(
        theme.colors.foregroundMuted,
        0.16,
      ),
      'editorIndentGuide.activeBackground1': hexWithAlpha(
        theme.colors.primary,
        0.32,
      ),
      'editorWhitespace.foreground': hexWithAlpha(
        theme.colors.foregroundMuted,
        0.25,
      ),
      'editorHoverWidget.background': theme.colors.surfaceAlt,
      'editorHoverWidget.foreground': theme.colors.foreground,
      'editorSuggestWidget.background': theme.colors.surfaceAlt,
      'editorSuggestWidget.foreground': theme.colors.foreground,
      'sideBar.background': theme.colors.surface,
      'sideBar.foreground': theme.colors.foreground,
      'activityBar.background': theme.colors.surfaceAlt,
      'activityBar.foreground': theme.colors.foreground,
      'statusBar.background': theme.colors.surfaceAlt,
      'statusBar.foreground': theme.colors.foreground,
      'panel.background': theme.colors.surface,
      'panel.border': hexWithAlpha(theme.colors.foregroundMuted, 0.18),
      'list.activeSelectionBackground': theme.colors.selection,
      'list.activeSelectionForeground': theme.colors.selectionForeground,
      'list.hoverBackground': hexWithAlpha(theme.colors.lineHighlight, 0.45),
      'inputValidation.errorBackground': hexWithAlpha(theme.colors.error, 0.2),
      'inputValidation.warningBackground': hexWithAlpha(
        theme.colors.warning,
        0.2,
      ),
      'inputValidation.infoBackground': hexWithAlpha(theme.colors.link, 0.2),
      'gitDecoration.addedResourceForeground': theme.colors.success,
      'gitDecoration.modifiedResourceForeground': theme.colors.warning,
      'gitDecoration.deletedResourceForeground': theme.colors.error,
    },
    tokenColors: [
      {
        name: 'Comment',
        scope: ['comment', 'punctuation.definition.comment'],
        settings: {
          foreground: theme.colors.comment,
          fontStyle: 'italic',
        },
      },
      {
        name: 'Keyword',
        scope: ['keyword', 'storage', 'storage.type'],
        settings: {
          foreground: theme.colors.keyword,
        },
      },
      {
        name: 'String',
        scope: ['string', 'string.quoted', 'string.template'],
        settings: {
          foreground: theme.colors.string,
        },
      },
      {
        name: 'Number',
        scope: ['constant.numeric', 'number'],
        settings: {
          foreground: theme.colors.number,
        },
      },
      {
        name: 'Type',
        scope: ['entity.name.type', 'support.type', 'storage.type.class'],
        settings: {
          foreground: theme.colors.type,
        },
      },
      {
        name: 'Function',
        scope: ['entity.name.function', 'support.function'],
        settings: {
          foreground: theme.colors.function,
        },
      },
      {
        name: 'Constant',
        scope: ['constant', 'variable.other.constant'],
        settings: {
          foreground: theme.colors.constant,
        },
      },
      {
        name: 'Link',
        scope: ['markup.underline.link', 'string.other.link'],
        settings: {
          foreground: theme.colors.link,
        },
      },
      {
        name: 'Invalid',
        scope: ['invalid', 'invalid.illegal'],
        settings: {
          foreground: theme.colors.error,
        },
      },
    ],
  };
}

export function renderVsCodeTheme(document: ThemeDocument): RenderResult {
  return {
    target: 'vscode',
    files: [
      {
        filename: 'theme.json',
        content: `${JSON.stringify(buildVsCodeTheme(document.theme), null, 2)}\n`,
      },
    ],
  };
}
