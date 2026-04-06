export interface FileContents {
  name: string
  contents: string
}

export interface FileDiffPair {
  oldFile: FileContents
  newFile: FileContents
  lang?: string
}

export type DiffRowKind = 'context' | 'add' | 'remove'

export interface DiffRow {
  kind: DiffRowKind
  oldLineNo: number | null
  newLineNo: number | null
  lineIndex: number
  source: 'old' | 'new'
}
