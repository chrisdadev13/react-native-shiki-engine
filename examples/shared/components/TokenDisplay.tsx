import type { ThemedToken } from '@shikijs/core'
import type { CodeBlockHeaderRenderProps } from 'react-native-shiki-diff-ui'
import React, { type ComponentType, type ReactNode } from 'react'
import { CodeBlockWithGutter } from 'react-native-shiki-diff-ui'
import { styles } from '../styles'

interface TokenDisplayProps {
  tokens: ThemedToken[][]
  showLineNumbers?: boolean
  /** Top bar file-style label (optional). */
  title?: string
  /** Top bar right label, e.g. language id (optional). */
  badge?: string
  showCodeHeader?: boolean
  renderCodeHeader?: (props: CodeBlockHeaderRenderProps) => ReactNode
  codeHeaderComponent?: ComponentType<CodeBlockHeaderRenderProps>
}

export function TokenDisplay({
  tokens,
  showLineNumbers,
  title,
  badge,
  showCodeHeader,
  renderCodeHeader,
  codeHeaderComponent,
}: TokenDisplayProps) {
  return (
    <CodeBlockWithGutter
      tokens={tokens}
      showLineNumbers={showLineNumbers}
      title={title}
      badge={badge}
      showCodeHeader={showCodeHeader}
      renderCodeHeader={renderCodeHeader}
      codeHeaderComponent={codeHeaderComponent}
      containerStyle={styles.codeContainer}
    />
  )
}
