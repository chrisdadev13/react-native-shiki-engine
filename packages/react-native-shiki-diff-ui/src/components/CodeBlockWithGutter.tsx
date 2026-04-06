import type { ThemedToken } from '@shikijs/core'
import type { ViewStyle } from 'react-native'
import React, { memo, useMemo, type ComponentType, type ReactNode } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { diffUiStyles } from '../styles'
import { TokenLine } from './TokenLine'

export interface CodeBlockHeaderRenderProps {
  /** Trimmed `title` prop, or undefined when empty / omitted. */
  title: string | undefined
  /** Trimmed `badge` prop, or undefined when empty / omitted. */
  badge: string | undefined
}

export interface CodeBlockWithGutterProps {
  tokens: ThemedToken[][]
  showLineNumbers?: boolean
  /** 1-based number for the first line */
  startLine?: number
  containerStyle?: ViewStyle
  /** Top bar label (e.g. file name). Omit for no header row. */
  title?: string
  /** Top bar right label (e.g. language id). */
  badge?: string
  /** When false, no header is rendered (ignores `title`, `badge`, and custom header props). */
  showCodeHeader?: boolean
  /**
   * Replaces the built-in title/badge header. Takes precedence over `codeHeaderComponent`.
   * Receives trimmed `title` / `badge`; return null for no header.
   */
  renderCodeHeader?: (props: CodeBlockHeaderRenderProps) => ReactNode
  /** Custom header component. Used when `renderCodeHeader` is omitted. */
  codeHeaderComponent?: ComponentType<CodeBlockHeaderRenderProps>
}

function nonEmpty(s: string | undefined): string | undefined {
  const t = s?.trim()
  return t && t.length > 0 ? t : undefined
}

function isRenderableHeader(node: ReactNode): boolean {
  return node !== null && node !== undefined && node !== false
}

function DefaultCodeBlockHeader({ title, badge }: CodeBlockHeaderRenderProps) {
  return (
    <View style={diffUiStyles.fileHeader}>
      <View style={diffUiStyles.fileHeaderRow}>
        {title !== undefined
          ? (
              <Text style={diffUiStyles.codeBlockHeaderTitle} numberOfLines={1}>
                {title}
              </Text>
            )
          : (
              <View style={diffUiStyles.codeBlockHeaderSpacer} />
            )}
        {badge !== undefined
          ? (
              <Text style={diffUiStyles.codeBlockHeaderBadge}>{badge}</Text>
            )
          : null}
      </View>
    </View>
  )
}

function CodeBlockWithGutterInner({
  tokens,
  showLineNumbers = false,
  startLine = 1,
  containerStyle,
  title: titleProp,
  badge: badgeProp,
  showCodeHeader = true,
  renderCodeHeader,
  codeHeaderComponent: CodeHeaderComponent,
}: CodeBlockWithGutterProps) {
  const title = nonEmpty(titleProp)
  const badge = nonEmpty(badgeProp)

  const headerRenderProps: CodeBlockHeaderRenderProps = useMemo(
    () => ({ title, badge }),
    [title, badge],
  )

  const headerNode: ReactNode = useMemo(() => {
    if (!showCodeHeader)
      return null
    if (renderCodeHeader !== undefined)
      return renderCodeHeader(headerRenderProps)
    if (CodeHeaderComponent !== undefined)
      return <CodeHeaderComponent {...headerRenderProps} />
    if (title !== undefined || badge !== undefined)
      return <DefaultCodeBlockHeader {...headerRenderProps} />
    return null
  }, [showCodeHeader, renderCodeHeader, CodeHeaderComponent, headerRenderProps])

  const hasHeader = isRenderableHeader(headerNode)

  return (
    <View style={[diffUiStyles.fileSection, containerStyle]}>
      {hasHeader ? headerNode : null}
      <View
        style={[
          diffUiStyles.panel,
          hasHeader ? diffUiStyles.diffPanelBody : undefined,
          diffUiStyles.codeBlockPanelPadding,
        ]}
      >
        {!showLineNumbers
          ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator
                contentContainerStyle={diffUiStyles.codeBlockPlainScrollContent}
              >
                <View>
                  {tokens.map((line, lineIndex) => (
                    <View
                      key={`plain-${lineIndex}`}
                      style={diffUiStyles.codeLine}
                    >
                      <TokenLine line={line} lineKeyPrefix={`plain-${lineIndex}`} />
                    </View>
                  ))}
                </View>
              </ScrollView>
            )
          : (
              <View style={diffUiStyles.diffBodyRow}>
                <View style={diffUiStyles.lineNumberRail}>
                  {tokens.map((_, lineIndex) => {
                    const displayNo = startLine + lineIndex
                    return (
                      <View
                        key={`ln-g-${lineIndex}`}
                        style={diffUiStyles.codeLine}
                      >
                        <View style={diffUiStyles.gutterDiffSingle}>
                          <Text style={diffUiStyles.gutterLineNumberPlain}>{String(displayNo)}</Text>
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
                  <View style={diffUiStyles.diffCodeColumn}>
                    {tokens.map((line, lineIndex) => (
                      <View
                        key={`ln-c-${lineIndex}`}
                        style={diffUiStyles.codeLine}
                      >
                        <TokenLine line={line} lineKeyPrefix={`ln-${lineIndex}`} />
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
      </View>
    </View>
  )
}

export const CodeBlockWithGutter = memo(CodeBlockWithGutterInner)
CodeBlockWithGutter.displayName = 'CodeBlockWithGutter'
