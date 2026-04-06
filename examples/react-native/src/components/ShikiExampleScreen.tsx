import type { FileDiffPair } from '@shared/components'
import type { ThemedToken } from '@shikijs/core'
import { MultiFileDiff, TokenDisplay } from '@shared/components'
import { useHighlighter } from '@shared/hooks'
import { rustExample } from '@shared/snippets'
import { styles } from '@shared/styles'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { isNativeEngineAvailable } from 'react-native-shiki-engine'

const demoDiffFiles: FileDiffPair[] = [
  {
    oldFile: { name: 'example.ts', contents: 'console.log("Hello world");\n' },
    newFile: { name: 'example.ts', contents: 'console.warn("Updated message");\n' },
  },
  {
    oldFile: { name: 'util.ts', contents: 'export const x = 1;\n' },
    newFile: { name: 'util.ts', contents: 'export const x = 2;\nexport const y = 3;' },
  },
]

export function ShikiExampleScreen() {
  const [engineStatus, setEngineStatus] = useState('Initializing...')
  const [tokens, setTokens] = useState<ThemedToken[][]>([])
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const highlighter = useHighlighter()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const available = isNativeEngineAvailable()
        setEngineStatus(available ? 'Available' : 'Not Available')

        if (!available)
          throw new Error('Native engine not available.')

        await highlighter.initialize()
        setReady(true)

        const tokenized = highlighter.tokenize(rustExample, {
          lang: 'rust',
          theme: 'tokyo-night',
        })

        setTokens(tokenized)
      }
      catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
          console.error('Tokenization error:', err)
        }
        else {
          setError('An unknown error occurred.')
          console.error('Unknown error:', err)
        }
      }
    }

    initializeApp()

    return () => {
      highlighter.dispose()
    }
  }, [highlighter])

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Shiki Engine</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Engine Status:</Text>
          <Text style={styles.statusValue}>{engineStatus}</Text>
        </View>
      </View>

      <ScrollView style={styles.demoSection} showsVerticalScrollIndicator={false}>
        {error
          ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )
          : (
              <>
                <TokenDisplay showLineNumbers title="snippet.rs" badge="rust" tokens={tokens} />
                {ready
                  ? (
                      <View style={{ marginHorizontal: 24, marginTop: 8 }}>
                        <Text style={styles.sectionTitle}>Stacked file diffs</Text>
                        <MultiFileDiff
                          files={demoDiffFiles}
                          theme="tokyo-night"
                          tokenize={highlighter.tokenize}
                        />
                      </View>
                    )
                  : null}
              </>
            )}
      </ScrollView>
    </SafeAreaView>
  )
}
