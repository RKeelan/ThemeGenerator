import { ThemeGeneratorError } from '../core/errors.ts';
import type {
  RenderResult,
  ThemeDocument,
  ThemeTarget,
} from '../core/types.ts';

import { renderCodeMirrorTheme } from './codemirror.ts';
import { renderSublimeTheme } from './sublime.ts';
import { renderVsCodeTheme } from './vscode.ts';
import { renderWebsiteTheme } from './website.ts';

function assertUnreachable(value: never): never {
  throw new ThemeGeneratorError(
    `Unsupported target: ${String(value)}.`,
    'INVALID_TARGET',
  );
}

export function renderTarget(
  document: ThemeDocument,
  target: ThemeTarget,
): RenderResult {
  switch (target) {
    case 'website':
      return renderWebsiteTheme(document);
    case 'vscode':
      return renderVsCodeTheme(document);
    case 'sublime':
      return renderSublimeTheme(document);
    case 'codemirror':
      return renderCodeMirrorTheme(document);
    default:
      return assertUnreachable(target);
  }
}
