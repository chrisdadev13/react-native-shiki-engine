import type { DiffRow } from './types'
import { diffArrays } from 'diff'
import { splitSourceLines } from './splitSourceLines'

export function buildLineDiffRows(oldText: string, newText: string): DiffRow[] {
  const oldLines = splitSourceLines(oldText)
  const newLines = splitSourceLines(newText)
  const parts = diffArrays(oldLines, newLines)

  let oldIndex = 0
  let newIndex = 0
  const rows: DiffRow[] = []

  for (const part of parts) {
    if (part.added) {
      part.value.forEach(() => {
        rows.push({
          kind: 'add',
          oldLineNo: null,
          newLineNo: newIndex + 1,
          lineIndex: newIndex,
          source: 'new',
        })
        newIndex++
      })
    }
    else if (part.removed) {
      part.value.forEach(() => {
        rows.push({
          kind: 'remove',
          oldLineNo: oldIndex + 1,
          newLineNo: null,
          lineIndex: oldIndex,
          source: 'old',
        })
        oldIndex++
      })
    }
    else {
      part.value.forEach(() => {
        rows.push({
          kind: 'context',
          oldLineNo: oldIndex + 1,
          newLineNo: newIndex + 1,
          lineIndex: newIndex,
          source: 'new',
        })
        oldIndex++
        newIndex++
      })
    }
  }

  return rows
}
