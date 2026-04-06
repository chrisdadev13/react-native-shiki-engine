import type { ThemedToken } from '@shikijs/core'
import type { ViewStyle } from 'react-native'
import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { diffUiStyles } from '../styles'
import { TokenLine } from './TokenLine'

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
}

function nonEmpty(s: string | undefined): string | undefined {
  const t = s?.trim()
  return t && t.length > 0 ? t : undefined
}

export function CodeBlockWithGutter({
  tokens,
  showLineNumbers = false,
  startLine = 1,
  containerStyle,
  title: titleProp,
  badge: badgeProp,
}: CodeBlockWithGutterProps) {
  const title = nonEmpty(titleProp)
  const badge = nonEmpty(badgeProp)
  const hasHeader = title !== undefined || badge !== undefined

  return (
    <View style={[diffUiStyles.fileSection, containerStyle]}>
      {hasHeader
        ? (
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
        : null}
      <View
        style={[
          diffUiStyles.panel,
          hasHeader ? diffUiStyles.diffPanelBody : undefined,
          hasHeader ? diffUiStyles.diffPanelBodyPadding : undefined,
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
                      key={`plain-${lineIndex}-${line.map(t => t.content).join('').length}`}
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
                  {tokens.map((line, lineIndex) => {
                    const displayNo = startLine + lineIndex
                    return (
                      <View
                        key={`ln-g-${lineIndex}-${line.map(t => t.content).join('').length}`}
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
                        key={`ln-c-${lineIndex}-${line.map(t => t.content).join('').length}`}
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
