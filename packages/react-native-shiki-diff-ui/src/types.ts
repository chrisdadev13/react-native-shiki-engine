export interface FileContents {
  name: string
  contents: string
}

export interface FileDiffPair {
  oldFile: FileContents
  newFile: FileContents
  lang?: string
  /** When set with `onCollapsedChange`, controls collapsed state; otherwise seeds internal state on first mount. */
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** When false, the file section header does not collapse. Default true. */
  collapsible?: boolean
}

export type DiffRowKind = 'context' | 'add' | 'remove'

export interface DiffRow {
  kind: DiffRowKind
  oldLineNo: number | null
  newLineNo: number | null
  lineIndex: number
  source: 'old' | 'new'
}
