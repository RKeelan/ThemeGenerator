# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

See [README.md](README.md) for project overview, CLI usage, and supported targets.

## Commands

```bash
bun install              # install dependencies
bun test                 # run all tests
bun test test/core/theme-generator.test.ts  # run a single test file
bun run lint             # ESLint (--max-warnings=0)
bun run check            # TypeScript type-check (tsc --noEmit)
bun run format           # Prettier auto-format
bun run format:check     # Prettier check only
bun run build            # bundle to dist/
```

## Architecture

The pipeline has two stages: extraction and rendering.

- Extraction (`src/core/`): image loading (Jimp) -> seed colour extraction -> tonal palette generation (Material colour utilities) -> semantic theme mapping. All target-agnostic. The entry point is `buildThemeDocument()` in `theme-generator.ts`, which returns a `ThemeDocument` containing source image metadata, seed colour, palettes, and semantic theme.
- Rendering (`src/targets/`): each renderer takes a `ThemeDocument` and produces `RenderResult` (array of `RenderedFile`). `renderTarget()` in `targets/index.ts` dispatches by `ThemeTarget`. Adding a new target means writing a renderer and adding a case to the switch + the `THEME_TARGETS` const in `types.ts`.

Key types are in `src/core/types.ts`: `ThemeDocument`, `SemanticTheme`, `SemanticColorRole`, `ThemeTarget`, `HexColor`.

The CLI (`src/cli.ts`) uses Commander with two subcommands: `inspect` and `generate`.

## Conventions

- TypeScript strict mode with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`
- Use `type` imports (`@typescript-eslint/consistent-type-imports` enforced)
- Tests use `bun:test`; test helpers in `test/helpers.ts` create temp directories and synthetic images via Jimp
- Bun is the runtime; all scripts invoke tools through `bun ./node_modules/...` rather than npx

## Dependency Management

Always pin dependencies to exact versions — no `^`, `~`, or bare package names. `.bunfmt` sets `save-exact=true` so `bun add` pins automatically. `bun.lock` must be committed.
