import type { DiffRow } from './types'

export type DiffDisplayItem =
  | { type: 'row'; row: DiffRow; rowIndex: number }
  | { type: 'collapsed'; count: number; baseIndex: number }

export function collapseKeyForBaseIndex(baseIndex: number): string {
  return String(baseIndex)
}

type RawSegment = {
  rows: DiffRow[]
  baseIndex: number
  isPureContext: boolean
}

function splitIntoSegments(rows: DiffRow[]): RawSegment[] {
  const segments: RawSegment[] = []
  let i = 0
  while (i < rows.length) {
    const startRow = rows[i]
    if (startRow === undefined)
      break
    const isContext = startRow.kind === 'context'
    let j = i
    if (isContext) {
      while (j < rows.length) {
        const r = rows[j]
        if (r === undefined || r.kind !== 'context')
          break
        j++
      }
    }
    else {
      while (j < rows.length) {
        const r = rows[j]
        if (r === undefined || r.kind === 'context')
          break
        j++
      }
    }
    segments.push({
      rows: rows.slice(i, j),
      baseIndex: i,
      isPureContext: isContext,
    })
    i = j
  }
  return segments
}

export function buildDiffDisplayItems(
  rows: DiffRow[],
  minContextToCollapse: number,
  expandedCollapseKeys: ReadonlySet<string>,
): DiffDisplayItem[] {
  const segs = splitIntoSegments(rows)
  const out: DiffDisplayItem[] = []
  for (const seg of segs) {
    const canCollapse = seg.isPureContext && seg.rows.length >= minContextToCollapse
    const key = collapseKeyForBaseIndex(seg.baseIndex)
    if (canCollapse && !expandedCollapseKeys.has(key)) {
      out.push({
        type: 'collapsed',
        count: seg.rows.length,
        baseIndex: seg.baseIndex,
      })
    }
    else {
      for (let k = 0; k < seg.rows.length; k++) {
        const row = seg.rows[k]
        if (row === undefined)
          continue
        out.push({
          type: 'row',
          row,
          rowIndex: seg.baseIndex + k,
        })
      }
    }
  }
  return out
}
