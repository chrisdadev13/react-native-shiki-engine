/**
 * Split source the same way line-based diff and Shiki line tokens align:
 * `code.split(/\r?\n/)` yields one entry per line; trailing newline produces a final empty segment.
 */
export function splitSourceLines(code: string): string[] {
  return code.split(/\r?\n/)
}
