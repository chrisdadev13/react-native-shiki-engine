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
  rootCollapsedSolo: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  path: {
    flex: 1,
    minWidth: 0,
    fontSize: 13,
    fontWeight: '600',
    color: '#bb9af7',
    textAlign: 'left',
  },
  chevron: {
    fontSize: 10,
    color: '#565f89',
    width: 14,
    textAlign: 'center',
    marginRight: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
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
  collapsed,
  collapsible,
}: FileDiffHeaderRenderProps) {
  const pathLabel = fileRenamed ? `${oldFileName} → ${newFileName}` : newFileName
  return (
    <View
      style={[
        customHeaderStyles.root,
        collapsible && collapsed ? customHeaderStyles.rootCollapsedSolo : null,
      ]}
    >
      <View style={customHeaderStyles.row}>
        {collapsible
          ? (
              <Text style={customHeaderStyles.chevron} accessibilityElementsHidden>
                {collapsed ? '▶' : '▼'}
              </Text>
            )
          : null}
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
