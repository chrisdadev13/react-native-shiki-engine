import type { ThemedToken } from '@shikijs/core'
import type { DiffRow } from '../types'
import React, { memo, useCallback, useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
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

export interface FileDiffHeaderRenderProps {
  oldFileName: string
  newFileName: string
  fileRenamed: boolean
  stats: { add: number, remove: number }
  /** Whether the diff body below the header is hidden. */
  collapsed: boolean
  /** When false, the header is not a toggle and chevrons are omitted. */
  collapsible: boolean
}

export interface FileDiffSectionProps {
  oldFileName: string
  newFileName: string
  rows: DiffRow[]
  oldTokens: ThemedToken[][]
  newTokens: ThemedToken[][]
  /** Consecutive context lines at or above this count collapse into a summary bar. */
  contextCollapseThreshold?: number
  /** When false, no file header is rendered and the diff panel gets rounded top corners. */
  showFileHeader?: boolean
  /**
   * Replaces the built-in header. Return null to render nothing (same as hiding the header
   * for layout); prefer `showFileHeader={false}` when you never want a header.
   * Takes precedence over `fileHeaderComponent` when both are set.
   */
  renderFileHeader?: (props: FileDiffHeaderRenderProps) => ReactNode
  /** Custom header component. Used when `renderFileHeader` is omitted. */
  fileHeaderComponent?: ComponentType<FileDiffHeaderRenderProps>
  /**
   * When `onCollapsedChange` is set, this is controlled. Otherwise internal state is used
   * (initial value from this prop on first mount).
   */
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** When false, the diff body is always shown and the header does not toggle. Default true. */
  collapsible?: boolean
}

const DEFAULT_CONTEXT_COLLAPSE = 6

type CollapseBarPlacement = 'top' | 'middle' | 'bottom'

function collapseBarPlacement(
  displayItemsLength: number,
  itemIndex: number,
): CollapseBarPlacement {
  const isFirst = itemIndex === 0
  const isLast = itemIndex === displayItemsLength - 1
  if (isFirst && isLast)
    return 'middle'
  if (isFirst)
    return 'top'
  if (isLast)
    return 'bottom'
  return 'middle'
}

const CollapsedBarChevrons = memo(function CollapsedBarChevrons({ placement }: { placement: CollapseBarPlacement }) {
  const { collapsedRailChevron, collapsedRailChevronStack } = diffUiStyles
  if (placement === 'middle') {
    return (
      <View style={collapsedRailChevronStack}>
        <Text style={collapsedRailChevron}>▼</Text>
        <Text style={collapsedRailChevron}>▲</Text>
      </View>
    )
  }
  return (
    <View style={collapsedRailChevronStack}>
      <Text style={collapsedRailChevron}>↕</Text>
      <Text style={collapsedRailChevron}>▼</Text>
    </View>
  )
})

const DefaultFileDiffHeader = memo(function DefaultFileDiffHeader({
  oldFileName,
  newFileName,
  fileRenamed,
  stats,
  collapsed,
  collapsible,
}: FileDiffHeaderRenderProps) {
  return (
    <View style={diffUiStyles.fileHeader}>
      <View style={diffUiStyles.fileHeaderRow}>
        {collapsible
          ? (
              <Text style={diffUiStyles.fileHeaderChevron} accessibilityElementsHidden>
                {collapsed ? '▶' : '▼'}
              </Text>
            )
          : null}
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
  )
})

function renderAccentStripe(kind: DiffRow['kind']) {
  const color = accentStripeColorForKind(kind)
  if (color) {
    return (
      <View
        style={[
          diffUiStyles.accentStripe,
          {
            borderLeftWidth: 2,
            borderLeftColor: color,
          },
        ]}
      />
    )
  }
  return <View style={diffUiStyles.accentStripe} />
}

function isRenderableHeader(node: ReactNode): boolean {
  return node !== null && node !== undefined && node !== false
}

function FileDiffSectionInner({
  oldFileName,
  newFileName,
  rows,
  oldTokens,
  newTokens,
  contextCollapseThreshold = DEFAULT_CONTEXT_COLLAPSE,
  showFileHeader = true,
  renderFileHeader,
  fileHeaderComponent: FileHeaderComponent,
  collapsed: collapsedProp,
  onCollapsedChange,
  collapsible = true,
}: FileDiffSectionProps) {
  const isCollapsedControlled = onCollapsedChange !== undefined
  const [internalCollapsed, setInternalCollapsed] = useState(() => collapsedProp ?? false)
  const rawCollapsed = isCollapsedControlled ? Boolean(collapsedProp) : internalCollapsed
  const sectionCollapsed = collapsible && rawCollapsed

  const setSectionCollapsed = useCallback(
    (next: boolean) => {
      if (!collapsible)
        return
      if (isCollapsedControlled)
        onCollapsedChange(next)
      else
        setInternalCollapsed(next)
    },
    [collapsible, isCollapsedControlled, onCollapsedChange],
  )

  const toggleSectionCollapsed = useCallback(() => {
    if (!collapsible)
      return
    setSectionCollapsed(!rawCollapsed)
  }, [collapsible, rawCollapsed, setSectionCollapsed])

  const [expandedCollapses, setExpandedCollapses] = useState(() => new Set<string>())

  const displayItems = useMemo(() => {
    if (sectionCollapsed)
      return []
    return buildDiffDisplayItems(rows, contextCollapseThreshold, expandedCollapses)
  }, [sectionCollapsed, rows, contextCollapseThreshold, expandedCollapses])

  const toggleCollapse = useCallback((baseIndex: number) => {
    const key = collapseKeyForBaseIndex(baseIndex)
    setExpandedCollapses((prev) => {
      const next = new Set(prev)
      if (next.has(key))
        next.delete(key)
      else
        next.add(key)
      return next
    })
  }, [])

  const stats = useMemo(() => countDiffStats(rows), [rows])
  const fileRenamed = oldFileName !== newFileName

  const headerRenderProps: FileDiffHeaderRenderProps = useMemo(
    () => ({
      oldFileName,
      newFileName,
      fileRenamed,
      stats,
      collapsed: sectionCollapsed,
      collapsible,
    }),
    [oldFileName, newFileName, fileRenamed, stats, sectionCollapsed, collapsible],
  )

  const headerNode: ReactNode = useMemo(() => {
    if (!showFileHeader)
      return null
    if (renderFileHeader !== undefined)
      return renderFileHeader(headerRenderProps)
    if (FileHeaderComponent !== undefined)
      return <FileHeaderComponent {...headerRenderProps} />
    return <DefaultFileDiffHeader {...headerRenderProps} />
  }, [showFileHeader, renderFileHeader, FileHeaderComponent, headerRenderProps])

  const hasHeader = isRenderableHeader(headerNode)

  return (
    <View style={diffUiStyles.fileSection}>
      {hasHeader
        ? (
            collapsible
              ? (
                  <Pressable
                    onPress={toggleSectionCollapsed}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: !sectionCollapsed }}
                    style={({ pressed }) => [
                      sectionCollapsed ? diffUiStyles.fileHeaderCollapsedClip : null,
                      pressed ? { opacity: 0.92 } : null,
                    ]}
                  >
                    {headerNode}
                  </Pressable>
                )
              : (
                  <View>
                    {headerNode}
                  </View>
                )
          )
        : null}
      {sectionCollapsed
        ? null
        : (
            <View
              style={[
                diffUiStyles.panel,
                diffUiStyles.diffPanelBody,
                diffUiStyles.diffPanelBodyPadding,
                !hasHeader
                  ? { borderTopLeftRadius: 12, borderTopRightRadius: 12 }
                  : null,
              ]}
            >
              <View style={diffUiStyles.diffBodyRow}>
                <View style={diffUiStyles.diffLeftRail}>
                  {displayItems.map((item, itemIndex) => {
                    if (item.type === 'collapsed') {
                      const placement = collapseBarPlacement(displayItems.length, itemIndex)
                      return (
                        <Pressable
                          key={`${newFileName}-collapse-rail-${item.baseIndex}`}
                          onPress={() => toggleCollapse(item.baseIndex)}
                          style={({ pressed }) => [
                            diffUiStyles.diffRowChrome,
                            diffUiStyles.collapsedContextRowChrome,
                            pressed ? { opacity: 0.88 } : null,
                          ]}
                        >
                          {renderAccentStripe('context')}
                          <View
                            style={[
                              diffUiStyles.gutterDiffSingle,
                              diffUiStyles.gutterDiffNumberSeparator,
                              diffUiStyles.collapsedContextGutter,
                            ]}
                          >
                            <CollapsedBarChevrons placement={placement} />
                          </View>
                          <View style={diffUiStyles.signCell} />
                        </Pressable>
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
          )}
    </View>
  )
}

export const FileDiffSection = memo(FileDiffSectionInner)
FileDiffSection.displayName = 'FileDiffSection'
