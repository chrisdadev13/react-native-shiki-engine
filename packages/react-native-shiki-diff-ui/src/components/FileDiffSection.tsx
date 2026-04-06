import type { ThemedToken } from '@shikijs/core'
import type { DiffRow } from '../types'
import React, { useMemo, useState } from 'react'
import { Platform, Pressable, ScrollView, Text, View } from 'react-native'
import { buildDiffDisplayItems, collapseKeyForBaseIndex } from '../buildDiffDisplayItems'
import {
  accentStripeColorForKind,
  countDiffStats,
  lineNumberColorForKind,
  lineTokensForRow,
  rowBackgroundStyleForKind,
  signColorForKind,
  signForKind,
} from '../diffLineChrome'
import { diffUiStyles } from '../styles'
import { TokenLine } from './TokenLine'

export interface FileDiffSectionProps {
  oldFileName: string
  newFileName: string
  rows: DiffRow[]
  oldTokens: ThemedToken[][]
  newTokens: ThemedToken[][]
  /** Consecutive context lines at or above this count collapse into a summary bar. */
  contextCollapseThreshold?: number
}

const DEFAULT_CONTEXT_COLLAPSE = 6

function renderAccentStripe(kind: DiffRow['kind']) {
  const color = accentStripeColorForKind(kind)
  const dashed = Platform.OS === 'ios'
  if (color) {
    return (
      <View
        style={[
          diffUiStyles.accentStripe,
          {
            borderLeftWidth: 2,
            borderLeftColor: color,
            borderStyle: dashed ? 'dashed' : 'solid',
          },
        ]}
      />
    )
  }
  return <View style={diffUiStyles.accentStripe} />
}

export function FileDiffSection({
  oldFileName,
  newFileName,
  rows,
  oldTokens,
  newTokens,
  contextCollapseThreshold = DEFAULT_CONTEXT_COLLAPSE,
}: FileDiffSectionProps) {
  const [expandedCollapses, setExpandedCollapses] = useState(() => new Set<string>())

  const displayItems = useMemo(
    () => buildDiffDisplayItems(rows, contextCollapseThreshold, expandedCollapses),
    [rows, contextCollapseThreshold, expandedCollapses],
  )

  const stats = useMemo(() => countDiffStats(rows), [rows])
  const fileRenamed = oldFileName !== newFileName

  const toggleCollapse = (baseIndex: number) => {
    const key = collapseKeyForBaseIndex(baseIndex)
    setExpandedCollapses((prev) => {
      const next = new Set(prev)
      if (next.has(key))
        next.delete(key)
      else
        next.add(key)
      return next
    })
  }

  return (
    <View style={diffUiStyles.fileSection}>
      <View style={diffUiStyles.fileHeader}>
        <View style={diffUiStyles.fileHeaderRow}>
          <View style={diffUiStyles.breadcrumbRow}>
            {fileRenamed
              ? (
                  <>
                    <Text style={diffUiStyles.breadcrumbName} numberOfLines={1}>
                      {oldFileName}
                    </Text>
                    <Text style={diffUiStyles.breadcrumbArrow}>→</Text>
                    <Text style={diffUiStyles.breadcrumbNameEmphasis} numberOfLines={1}>
                      {newFileName}
                    </Text>
                  </>
                )
              : (
                  <Text style={diffUiStyles.breadcrumbNameEmphasis} numberOfLines={1}>
                    {newFileName}
                  </Text>
                )}
          </View>
          <View style={diffUiStyles.diffStatsRow}>
            <Text style={diffUiStyles.diffStatRemove}>{`-${stats.remove}`}</Text>
            <Text style={diffUiStyles.diffStatAdd}>{`+${stats.add}`}</Text>
          </View>
        </View>
      </View>
      <View
        style={[
          diffUiStyles.panel,
          diffUiStyles.diffPanelBody,
          diffUiStyles.diffPanelBodyPadding,
        ]}
      >
        <View style={diffUiStyles.diffBodyRow}>
          <View style={diffUiStyles.diffLeftRail}>
            {displayItems.map((item) => {
              if (item.type === 'collapsed') {
                return (
                  <Pressable
                    key={`${newFileName}-collapse-rail-${item.baseIndex}`}
                    onPress={() => toggleCollapse(item.baseIndex)}
                    style={({ pressed }) => [
                      diffUiStyles.collapsedContextRail,
                      pressed ? { opacity: 0.88 } : null,
                    ]}
                  />
                )
              }
              const { row } = item
              const lineLabel = row.newLineNo !== null ? String(row.newLineNo) : String(row.oldLineNo ?? '')
              return (
                <View
                  key={`${newFileName}-chrome-${item.rowIndex}-${row.kind}`}
                  style={[diffUiStyles.diffRowChrome, rowBackgroundStyleForKind(row.kind)]}
                >
                  {renderAccentStripe(row.kind)}
                  <View style={[diffUiStyles.gutterDiffSingle, diffUiStyles.gutterDiffNumberSeparator]}>
                    <Text
                      style={[
                        diffUiStyles.gutterLineNumberDiff,
                        { color: lineNumberColorForKind(row.kind) },
                      ]}
                    >
                      {lineLabel}
                    </Text>
                  </View>
                  <View style={diffUiStyles.signCell}>
                    <Text style={[diffUiStyles.signText, { color: signColorForKind(row.kind) }]}>
                      {signForKind(row.kind)}
                    </Text>
                  </View>
                </View>
              )
            })}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator
            style={diffUiStyles.diffCodeScroll}
            contentContainerStyle={diffUiStyles.diffFileCodeScrollContent}
          >
            <View style={diffUiStyles.diffFileCodeColumn}>
              {displayItems.map((item) => {
                if (item.type === 'collapsed') {
                  return (
                    <Pressable
                      key={`${newFileName}-collapse-code-${item.baseIndex}`}
                      onPress={() => toggleCollapse(item.baseIndex)}
                      style={({ pressed }) => [
                        diffUiStyles.collapsedContextCodeFill,
                        pressed ? { opacity: 0.88 } : null,
                      ]}
                    >
                      <Text style={diffUiStyles.collapsedContextChevron}>▼</Text>
                      <Text style={diffUiStyles.collapsedContextLabel}>
                        {item.count}
                        {' '}
                        unmodified lines
                      </Text>
                    </Pressable>
                  )
                }
                const { row } = item
                const lineTokens = lineTokensForRow(row, oldTokens, newTokens)
                return (
                  <View
                    key={`${newFileName}-code-${item.rowIndex}-${row.kind}`}
                    style={[diffUiStyles.codeLine, rowBackgroundStyleForKind(row.kind)]}
                  >
                    <TokenLine line={lineTokens} lineKeyPrefix={`d-${item.rowIndex}`} />
                  </View>
                )
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  )
}
