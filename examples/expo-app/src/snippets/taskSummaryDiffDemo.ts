import type { FileDiffPair } from '@shared/components'

const taskSummaryOld = `export type Task = { id: string }
const summary: string[] = []
function appendPhase(marker: string) {
  summary.push(marker)
}
appendPhase('phase:boot')
// trace-01
// trace-02
// trace-03
// trace-04
// trace-05
// trace-06
// trace-07
// trace-08
// trace-09
// trace-10
// trace-11
// trace-12
// trace-13
// trace-14
// trace-15
// trace-16
// trace-17
// trace-18
appendPhase('phase:mid')
// span-01
// span-02
// span-03
// span-04
// span-05
// span-06
// span-07
// span-08
// span-09
// span-10
// span-11
// span-12
// span-13
appendPhase('phase:tail')
// footer-01
// footer-02
// footer-03
// footer-04
// footer-05
// footer-06
export function getTaskSummaryLines() {
  return summary.slice()
}
`

const taskSummaryNew = `export type Task = { id: string }
const summary: string[] = []
function appendPhase(marker: string) {
  summary.push(marker)
}
appendPhase('phase:boot-ready')
// trace-01
// trace-02
// trace-03
// trace-04
// trace-05
// trace-06
// trace-07
// trace-08
// trace-09
// trace-10
// trace-11
// trace-12
// trace-13
// trace-14
// trace-15
// trace-16
// trace-17
// trace-18
appendPhase('phase:mid-' + String(3))
// span-01
// span-02
// span-03
// span-04
// span-05
// span-06
// span-07
// span-08
// span-09
// span-10
// span-11
// span-12
// span-13
const previewTaskId = 'alpha'
if (previewTaskId !== '') {
  appendPhase('phase:tail-' + previewTaskId)
}
// footer-01
// footer-02
// footer-03
// footer-04
// footer-05
// footer-06
export function getTaskSummaryLines() {
  return summary.slice()
}
`

export const taskSummaryDiffDemoFiles: FileDiffPair[] = [
  {
    oldFile: { name: 'task-summary.ts', contents: taskSummaryOld },
    newFile: { name: 'task-summary.ts', contents: taskSummaryNew },
  },
]
