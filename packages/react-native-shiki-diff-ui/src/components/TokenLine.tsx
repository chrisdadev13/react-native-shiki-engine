import type { ThemedToken } from '@shikijs/core'
import React, { memo } from 'react'
import { Text, View } from 'react-native'
import { diffUiStyles } from '../styles'

interface TokenLineProps {
  line: ThemedToken[]
  lineKeyPrefix: string
}

function TokenLineInner({ line, lineKeyPrefix }: TokenLineProps) {
  return (
    <View style={diffUiStyles.codeScrollInner}>
      {line.map((token, tokenIndex) => (
        <Text
          key={`${lineKeyPrefix}-${tokenIndex}-${token.offset}-${token.content.length}`}
          style={[
            {
              color: token.color,
              fontStyle: token.fontStyle === 1 ? 'italic' : 'normal',
            },
            diffUiStyles.codeText,
          ]}
        >
          {token.content}
        </Text>
      ))}
    </View>
  )
}

export const TokenLine = memo(TokenLineInner)
TokenLine.displayName = 'TokenLine'
