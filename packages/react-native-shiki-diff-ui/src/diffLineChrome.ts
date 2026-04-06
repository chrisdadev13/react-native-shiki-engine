import type { ThemedToken } from '@shikijs/core'
import type { DiffRow } from './types'
import { diffUiStyles } from './styles'

export function rowBackgroundStyleForKind(kind: DiffRow['kind']) {
  if (kind === 'add')
    return diffUiStyles.rowAdd
  if (kind === 'remove')
    return diffUiStyles.rowRemove
  return undefined
}

export function signForKind(kind: DiffRow['kind']): string {
  if (kind === 'add')
    return '+'
  if (kind === 'remove')
    return '-'
  return ' '
}

export function signColorForKind(kind: DiffRow['kind']): string {
  if (kind === 'add')
    return '#d8f9b8'
  if (kind === 'remove')
    return '#ffb4c2'
  return '#7b8496'
}

export function lineNumberColorForKind(kind: DiffRow['kind']): string {
  if (kind === 'add')
    return '#9ece6a'
  if (kind === 'remove')
    return '#f7768e'
  return '#a9b1d6'
}

export function accentStripeColorForKind(kind: DiffRow['kind']): string | undefined {
  if (kind === 'add')
    return '#73daca'
  if (kind === 'remove')
    return '#f7768e'
  return undefined
}

export function countDiffStats(rows: DiffRow[]): { add: number, remove: number } {
  let add = 0
  let remove = 0
  for (const row of rows) {
    if (row.kind === 'add')
      add++
    else if (row.kind === 'remove')
      remove++
  }
  return { add, remove }
}

export function lineTokensForRow(
  row: DiffRow,
  oldTokens: ThemedToken[][],
  newTokens: ThemedToken[][],
): ThemedToken[] {
  return row.source === 'old'
    ? (oldTokens[row.lineIndex] ?? [])
    : (newTokens[row.lineIndex] ?? [])
}
