import type { ThemedToken } from '@shikijs/core'
import type { DiffRow, FileDiffPair } from '../types'
import React, { Fragment, memo, useMemo, type ComponentType, type ReactNode } from 'react'
import { buildLineDiffRows } from '../buildLineDiffRows'
import { langFromFileName } from '../langFromFileName'
import type { FileDiffHeaderRenderProps } from './FileDiffSection'
import { FileDiffSection } from './FileDiffSection'

type PreparedSection = {
  key: string
  oldName: string
  newName: string
  rows: DiffRow[]
  lang: string
  oldContents: string
  newContents: string
  collapsed: boolean | undefined
  onCollapsedChange: ((collapsed: boolean) => void) | undefined
  collapsible: boolean | undefined
}

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

function MultiFileDiffInner({
  files,
  tokenize,
  theme,
  defaultLang = 'typescript',
  contextCollapseThreshold,
  showFileHeader,
  renderFileHeader,
  fileHeaderComponent,
}: MultiFileDiffProps) {
  const prepared = useMemo((): PreparedSection[] => {
    return files.map((pair) => {
      const lang = pair.lang ?? langFromFileName(pair.newFile.name, defaultLang)
      return {
        key: `${pair.oldFile.name}\0${pair.newFile.name}`,
        oldName: pair.oldFile.name,
        newName: pair.newFile.name,
        rows: buildLineDiffRows(pair.oldFile.contents, pair.newFile.contents),
        lang,
        oldContents: pair.oldFile.contents,
        newContents: pair.newFile.contents,
        collapsed: pair.collapsed,
        onCollapsedChange: pair.onCollapsedChange,
        collapsible: pair.collapsible,
      }
    })
  }, [files, defaultLang])

  const sections = useMemo(() => {
    return prepared.map(p => ({
      key: p.key,
      oldName: p.oldName,
      newName: p.newName,
      rows: p.rows,
      oldTokens: tokenize(p.oldContents, { lang: p.lang, theme }),
      newTokens: tokenize(p.newContents, { lang: p.lang, theme }),
      collapsed: p.collapsed,
      onCollapsedChange: p.onCollapsedChange,
      collapsible: p.collapsible,
    }))
  }, [prepared, tokenize, theme])

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
          collapsed={section.collapsed}
          onCollapsedChange={section.onCollapsedChange}
          collapsible={section.collapsible}
        />
      ))}
    </Fragment>
  )
}

export const MultiFileDiff = memo(MultiFileDiffInner)
MultiFileDiff.displayName = 'MultiFileDiff'
