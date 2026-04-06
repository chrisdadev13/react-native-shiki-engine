# react-native-shiki-diff-ui — Diffs

This package renders **syntax-highlighted, line-based file diffs** in React Native. It is meant to be used with a **Shiki highlighter** (for example the one from `react-native-shiki-engine`) so each line is shown as real Shiki tokens, not plain text.

## What you use

The main entry point is `**MultiFileDiff`**. You pass:

- `**files**` — one or more old/new file pairs (paths + full source strings).
- `**tokenize**` — a function with the same shape as Shiki’s line tokenizer: `(code, { lang, theme }) => ThemedToken[][]`.
- `**theme**` — Shiki theme id (must match what your highlighter loaded).

Optional props:

- `**defaultLang**` — language id when the filename has no known extension (default: `typescript`).
- `**contextCollapseThreshold**` — when **at least** this many **consecutive unchanged (context) lines** appear in a row, that block is replaced by a tappable “collapsed” bar (default inside `FileDiffSection` is `6`). Omit it or set it high if you never want collapsing.

Example (pattern matches the Expo example app):

```tsx
import { MultiFileDiff } from 'react-native-shiki-diff-ui'
import type { FileDiffPair } from 'react-native-shiki-diff-ui'

const files: FileDiffPair[] = [
  {
    oldFile: { name: 'app.ts', contents: oldSource },
    newFile: { name: 'app.ts', contents: newSource },
  },
]

<MultiFileDiff
  files={files}
  theme="tokyo-night"
  tokenize={highlighter.tokenize}
  contextCollapseThreshold={6}
/>
```

Per file you may set `**lang**` on the pair to force the Shiki language; otherwise the language is inferred from the **new** file’s name via `langFromFileName` (common extensions like `.ts`, `.tsx`, `.rs`, etc. are mapped).

## Data model

- `**FileContents`**: `{ name: string, contents: string }` — `contents` is the **full file text** (including newlines as in the real file).
- `**FileDiffPair`**: `{ oldFile, newFile, lang? }` — typically `oldFile.name` and `newFile.name` match; if they differ, the UI shows a rename-style breadcrumb (`old → new`).

## How it works

1. **Line splitting** — Both versions are split with the same rule as Shiki line tokens: `code.split(/\r?\n/)` (`splitSourceLines`). That keeps diff rows and token rows aligned.
2. **Line diff** — `buildLineDiffRows` uses the `**diff`** package’s `diffArrays` on the two line arrays. That produces a list of `**DiffRow**` objects:
  - `**context**` — line unchanged on both sides (one row; uses the **new** side’s line index for tokens).
  - `**remove`** — line only on the old side (`source: 'old'`, old line number set).
  - `**add**` — line only on the new side (`source: 'new'`, new line number set).
   This is a **line-oriented** diff (not intra-line/word granularity).
3. **Highlighting** — For each file pair, `MultiFileDiff` calls your `**tokenize`** separately on **old** and **new** full sources with the chosen `lang` and `theme`. Each `DiffRow` then takes tokens from either `oldTokens[lineIndex]` or `newTokens[lineIndex]` depending on `row.source` (`lineTokensForRow`).
4. **Rendering** — `FileDiffSection` draws a **single-column unified-style** view: gutter (line number + `+`/`-`/space), optional accent stripe, and a horizontally scrollable code column using the same `**TokenLine`** styling approach as the rest of this UI kit.
5. **Collapsing** — `buildDiffDisplayItems` scans **contiguous runs of context rows**. If a run’s length is ≥ `contextCollapseThreshold` and that run is not expanded, it becomes one **collapsed** item showing a count (“N unmodified lines”). Tapping the bar toggles expansion for that segment (tracked by a stable key from the segment’s start index).

## Lower-level building blocks

If you already have tokens and diff rows (e.g. custom diff or caching), you can render one file with `**FileDiffSection`** directly: pass `oldFileName`, `newFileName`, `rows`, `oldTokens`, `newTokens`, and optional `contextCollapseThreshold`.

You can also call `**buildLineDiffRows(oldText, newText)**` yourself to reuse the same diff logic outside this UI.

## Peer dependencies

- `react`, `react-native`
- `@shikijs/core` (for `ThemedToken` and tokenizer compatibility)

## Related export

`**CodeBlockWithGutter**` — single-file code display with a gutter (not a diff). Diffs are `**MultiFileDiff**` / `**FileDiffSection**` only.