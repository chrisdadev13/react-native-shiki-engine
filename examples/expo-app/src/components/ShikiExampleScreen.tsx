import type { FileDiffPair } from '@shared/components'
import type { ThemedToken } from '@shikijs/core'
import { CustomCodeBlockHeader, CustomDiffFileHeader, MultiFileDiff, TokenDisplay } from '@shared/components'
import { useHighlighter } from '@shared/hooks'
import { rustExample } from '@shared/snippets'
import { styles } from '@shared/styles'
import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, StatusBar, Text, View } from 'react-native'
import { isNativeEngineAvailable } from 'react-native-shiki-engine'
import { taskSummaryDiffDemoFiles } from '@/snippets/taskSummaryDiffDemo'

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

  const platformName = Platform.OS === 'web' ? 'Web' : Platform.OS === 'ios' ? 'iOS' : 'Android'
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const available = isNativeEngineAvailable()
        const engineType = Platform.OS === 'web' ? 'WASM Engine' : available ? 'Native Engine' : 'Not Available'
        setEngineStatus(engineType)

        await highlighter.initialize()

        const tokenized = highlighter.tokenize(rustExample, {
          lang: 'rust',
          theme: 'tokyo-night',
        })

        setTokens(tokenized)
        setReady(true)
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
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Shiki Engine</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Engine:</Text>
          <Text style={styles.statusValue}>{engineStatus}</Text>
          <View style={styles.platformBadge}>
            <Text style={styles.platformText}>{platformName}</Text>
          </View>
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
              ready
                ? (
                    <>
                      <TokenDisplay showLineNumbers title="snippet.rs" badge="rust" tokens={tokens} />
                      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                        Code block without header
                      </Text>
                      <TokenDisplay showLineNumbers tokens={tokens} showCodeHeader={false} />
                      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                        Code block with custom header
                      </Text>
                      <TokenDisplay
                        showLineNumbers
                        title="snippet.rs"
                        badge="rust"
                        tokens={tokens}
                        codeHeaderComponent={CustomCodeBlockHeader}
                      />
                      <View style={{ marginHorizontal: 24, marginTop: 8 }}>
                        <Text style={styles.sectionTitle}>Stacked file diffs</Text>
                        <MultiFileDiff
                          files={demoDiffFiles}
                          theme="tokyo-night"
                          tokenize={highlighter.tokenize}
                        />
                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                          Diff without built-in header
                        </Text>
                        <MultiFileDiff
                          files={demoDiffFiles}
                          theme="tokyo-night"
                          tokenize={highlighter.tokenize}
                          showFileHeader={false}
                        />
                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                          Diff with custom header
                        </Text>
                        <MultiFileDiff
                          files={demoDiffFiles}
                          theme="tokyo-night"
                          tokenize={highlighter.tokenize}
                          fileHeaderComponent={CustomDiffFileHeader}
                        />
                        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                          Large file (collapsed unmodified sections)
                        </Text>
                        <MultiFileDiff
                          files={taskSummaryDiffDemoFiles}
                          theme="tokyo-night"
                          tokenize={highlighter.tokenize}
                          contextCollapseThreshold={6}
                        />
                      </View>
                    </>
                  )
                : (
                    <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
                      <Text style={styles.sectionTitle}>Loading highlighter…</Text>
                    </View>
                  )
            )}
      </ScrollView>
    </View>
  )
}
