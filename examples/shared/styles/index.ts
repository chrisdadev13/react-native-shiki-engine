import { Platform, StyleSheet } from 'react-native'

const monospaceFontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  web: 'monospace',
})

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1b26',
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    color: '#c0caf5',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161e',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#292e42',
  },
  statusLabel: {
    fontSize: 16,
    color: '#a9b1d6',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 16,
    color: '#c0caf5',
    fontWeight: '600',
  },
  platformBadge: {
    backgroundColor: '#7aa2f7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 12,
  },
  platformText: {
    fontSize: 14,
    color: '#1a1b26',
    fontWeight: '600',
  },
  demoSection: {
    flex: 1,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a9b1d6',
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  codeContainer: {
    marginVertical: 12,
    marginHorizontal: 24,
    flexShrink: 1,
  },
  codeScrollContainer: {
    flexDirection: 'column',
    minWidth: '100%',
  },
  codeLine: {
    fontSize: 16,
    fontFamily: monospaceFontFamily,
    lineHeight: 24,
    marginBottom: 6,
    flexDirection: 'row',
  },
  codeText: {
    fontSize: 16,
    fontFamily: monospaceFontFamily,
    lineHeight: 24,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'rgba(247, 118, 142, 0.12)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f7768e',
    marginHorizontal: 16,
  },
  errorText: {
    color: '#f7768e',
    fontSize: 16,
  },
})
