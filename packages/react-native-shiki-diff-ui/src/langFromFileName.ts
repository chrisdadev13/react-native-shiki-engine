const EXT_TO_LANG: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.mts': 'typescript',
  '.cts': 'typescript',
  '.js': 'javascript',
  '.jsx': 'jsx',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.json': 'json',
  '.md': 'markdown',
  '.mdx': 'mdx',
  '.rs': 'rust',
  '.py': 'python',
  '.go': 'go',
  '.css': 'css',
  '.html': 'html',
  '.yaml': 'yaml',
  '.yml': 'yaml',
}

export function langFromFileName(fileName: string, fallback: string): string {
  const dot = fileName.lastIndexOf('.')
  if (dot === -1)
    return fallback
  const ext = fileName.slice(dot).toLowerCase()
  const mapped = EXT_TO_LANG[ext]
  return mapped ?? fallback
}
