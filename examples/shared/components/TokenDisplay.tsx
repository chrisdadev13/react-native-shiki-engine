import type { ThemedToken } from '@shikijs/core'
import React from 'react'
import { CodeBlockWithGutter } from 'react-native-shiki-diff-ui'
import { styles } from '../styles'

interface TokenDisplayProps {
  tokens: ThemedToken[][]
  showLineNumbers?: boolean
  /** Top bar file-style label (optional). */
  title?: string
  /** Top bar right label, e.g. language id (optional). */
  badge?: string
}

export function TokenDisplay({ tokens, showLineNumbers, title, badge }: TokenDisplayProps) {
  return (
    <CodeBlockWithGutter
      tokens={tokens}
      showLineNumbers={showLineNumbers}
      title={title}
      badge={badge}
      containerStyle={styles.codeContainer}
    />
  )
}
