import type { ThemedToken } from '@shikijs/core'
import type { FileDiffPair } from '../types'
import React, { Fragment, useMemo, type ComponentType, type ReactNode } from 'react'
import { buildLineDiffRows } from '../buildLineDiffRows'
import { langFromFileName } from '../langFromFileName'
import type { FileDiffHeaderRenderProps } from './FileDiffSection'
import { FileDiffSection } from './FileDiffSection'

export interface MultiFileDiffProps {
  files: FileDiffPair[]
  tokenize: (code: string, options: { lang: string, theme: string }) => ThemedToken[][]
  theme: string
  defaultLang?: string
  contextCollapseThreshold?: number
  showFileHeader?: boolean
  renderFileHeader?: (props: FileDiffHeaderRenderProps) => ReactNode
  fileHeaderComponent?: ComponentType<FileDiffHeaderRenderProps>
}

export function MultiFileDiff({
  files,
  tokenize,
  theme,
  defaultLang = 'typescript',
  contextCollapseThreshold,
  showFileHeader,
  renderFileHeader,
  fileHeaderComponent,
}: MultiFileDiffProps) {
  const sections = useMemo(() => {
    return files.map((pair) => {
      const lang = pair.lang ?? langFromFileName(pair.newFile.name, defaultLang)
      const oldTokens = tokenize(pair.oldFile.contents, { lang, theme })
      const newTokens = tokenize(pair.newFile.contents, { lang, theme })
      const rows = buildLineDiffRows(pair.oldFile.contents, pair.newFile.contents)
      return {
        key: `${pair.oldFile.name}\0${pair.newFile.name}`,
        oldName: pair.oldFile.name,
        newName: pair.newFile.name,
        rows,
        oldTokens,
        newTokens,
      }
    })
  }, [files, tokenize, theme, defaultLang])

  return (
    <Fragment>
      {sections.map(section => (
        <FileDiffSection
          key={section.key}
          oldFileName={section.oldName}
          newFileName={section.newName}
          rows={section.rows}
          oldTokens={section.oldTokens}
          newTokens={section.newTokens}
          contextCollapseThreshold={contextCollapseThreshold}
          showFileHeader={showFileHeader}
          renderFileHeader={renderFileHeader}
          fileHeaderComponent={fileHeaderComponent}
        />
      ))}
    </Fragment>
  )
}
