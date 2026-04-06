import type { HighlighterContextType } from '@shared/contexts'
import type { HighlighterCore } from '@shikijs/core'
import { HighlighterContext } from '@shared/contexts'
import { createHighlighterCore } from '@shikijs/core'
import { createOnigurumaEngine } from '@shikijs/engine-oniguruma'
import rust from '@shikijs/langs/rust'
import tsx from '@shikijs/langs/tsx'
import typescript from '@shikijs/langs/typescript'
import tokyoNight from '@shikijs/themes/tokyo-night'
import React from 'react'

let highlighterInstance: HighlighterCore | null = null
let initializationPromise: Promise<void> | null = null

export function HighlighterProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo<HighlighterContextType>(
    () => ({
      initialize: async () => {
        if (!initializationPromise) {
          initializationPromise = (async () => {
            highlighterInstance = await createHighlighterCore({
              langs: [rust, typescript, tsx],
              themes: [tokyoNight],
              engine: createOnigurumaEngine(import('@shikijs/engine-oniguruma/wasm-inlined')),
            })
          })()
        }

        await initializationPromise
      },

      tokenize: (code: string, options: { lang: string, theme: string }) => {
        if (!highlighterInstance) {
          throw new Error('Highlighter not initialized. Call initialize() first.')
        }
        return highlighterInstance.codeToTokensBase(code, options)
      },

      dispose: () => {
        if (highlighterInstance) {
          highlighterInstance.dispose()
          highlighterInstance = null
          initializationPromise = null
        }
      },
    }),
    [],
  )

  return <HighlighterContext value={value}>{children}</HighlighterContext>
}
