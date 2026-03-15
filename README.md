# ThemeGenerator

[![CI](https://github.com/RKeelan/ThemeGenerator/actions/workflows/ci.yml/badge.svg)](https://github.com/RKeelan/ThemeGenerator/actions/workflows/ci.yml)

ThemeGenerator is a Bun and TypeScript CLI that derives a Monet-style color system from a source image and renders one consistent theme for multiple targets from one shared semantic model.

## Supported targets

- Website CSS custom properties with matching JSON tokens
- VS Code color theme JSON
- Sublime Text `.sublime-color-scheme`
- CodeMirror 6 theme module

## Installation

```bash
bun install
```

## CLI usage

Inspect an image and print the derived seed color, tonal palettes, and semantic theme:

```bash
bun run src/cli.ts inspect --input /path/to/wallpaper.jpg
```

Generate target files into an output directory:

```bash
bun run src/cli.ts generate --input /path/to/wallpaper.jpg --target website --output ./tmp/website
```

Targets:

- `website`
- `vscode`
- `sublime`
- `codemirror`

## Development

```bash
bun run lint
bun test
bun run build
```

## Design

The core image loading, palette extraction, and semantic theme generation are target-agnostic. Renderers translate the shared semantic model into each output format so new targets can be added without changing the extraction pipeline.
