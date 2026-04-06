import type { CodeBlockHeaderRenderProps } from 'react-native-shiki-diff-ui'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const customStyles = StyleSheet.create({
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
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#7dcfff',
    marginRight: 12,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1b26',
    backgroundColor: '#7aa2f7',
    overflow: 'hidden',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
})

/** Example custom header for `CodeBlockWithGutter` / `TokenDisplay` (`codeHeaderComponent`). */
export function CustomCodeBlockHeader({ title, badge }: CodeBlockHeaderRenderProps) {
  return (
    <View style={customStyles.root}>
      <View style={customStyles.row}>
        <Text style={customStyles.title} numberOfLines={1}>
          {title ?? '—'}
        </Text>
        {badge !== undefined ? <Text style={customStyles.badge}>{badge}</Text> : null}
      </View>
    </View>
  )
}
