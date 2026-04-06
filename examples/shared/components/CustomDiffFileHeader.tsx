import type { FileDiffHeaderRenderProps } from 'react-native-shiki-diff-ui'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const customHeaderStyles = StyleSheet.create({
  root: {
    backgroundColor: '#2d3154',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#565f89',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  path: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#bb9af7',
    marginRight: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remove: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f7768e',
    marginRight: 10,
  },
  add: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ece6a',
  },
})

/** Example custom header for `MultiFileDiff` / `FileDiffSection` (`fileHeaderComponent`). */
export function CustomDiffFileHeader({
  oldFileName,
  newFileName,
  fileRenamed,
  stats,
}: FileDiffHeaderRenderProps) {
  const pathLabel = fileRenamed ? `${oldFileName} → ${newFileName}` : newFileName
  return (
    <View style={customHeaderStyles.root}>
      <View style={customHeaderStyles.row}>
        <Text style={customHeaderStyles.path} numberOfLines={1}>
          {pathLabel}
        </Text>
        <View style={customHeaderStyles.stats}>
          <Text style={customHeaderStyles.remove}>{`-${stats.remove}`}</Text>
          <Text style={customHeaderStyles.add}>{`+${stats.add}`}</Text>
        </View>
      </View>
    </View>
  )
}
