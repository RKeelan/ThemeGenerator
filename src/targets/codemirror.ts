import { hexWithAlpha } from '../core/color.ts';
import type {
  RenderResult,
  SemanticTheme,
  ThemeDocument,
} from '../core/types.ts';

function buildModule(theme: SemanticTheme): string {
  const namePrefix = 'themeGenerator';

  return `import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { EditorView } from '@codemirror/view';

export const ${namePrefix}Theme = EditorView.theme(
  {
    '&': {
      color: '${theme.colors.foreground}',
      backgroundColor: '${theme.colors.background}',
    },
    '.cm-content': {
      caretColor: '${theme.colors.caret}',
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '${theme.colors.caret}',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      backgroundColor: '${hexWithAlpha(theme.colors.selection, 0.58)}',
      color: '${theme.colors.selectionForeground}',
    },
    '.cm-activeLine': {
      backgroundColor: '${hexWithAlpha(theme.colors.lineHighlight, 0.7)}',
    },
    '.cm-gutters': {
      backgroundColor: '${theme.colors.surface}',
      color: '${theme.colors.foregroundMuted}',
      border: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '${theme.colors.lineHighlight}',
      color: '${theme.colors.foreground}',
    },
  },
  { dark: true },
);

export const ${namePrefix}HighlightStyle = HighlightStyle.define([
  { tag: tags.comment, color: '${theme.colors.comment}', fontStyle: 'italic' },
  { tag: [tags.keyword, tags.operatorKeyword], color: '${theme.colors.keyword}' },
  { tag: [tags.string, tags.special(tags.string)], color: '${theme.colors.string}' },
  { tag: [tags.number, tags.integer, tags.float], color: '${theme.colors.number}' },
  { tag: [tags.typeName, tags.className], color: '${theme.colors.type}' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: '${theme.colors.function}' },
  { tag: [tags.constant(tags.name), tags.bool, tags.null], color: '${theme.colors.constant}' },
  { tag: tags.link, color: '${theme.colors.link}' },
  { tag: tags.invalid, color: '${theme.colors.error}' },
]);

export const ${namePrefix}Extension = [
  ${namePrefix}Theme,
  syntaxHighlighting(${namePrefix}HighlightStyle),
];
`;
}

export function renderCodeMirrorTheme(document: ThemeDocument): RenderResult {
  return {
    target: 'codemirror',
    files: [
      {
        filename: 'theme.ts',
        content: buildModule(document.theme),
      },
    ],
  };
}
