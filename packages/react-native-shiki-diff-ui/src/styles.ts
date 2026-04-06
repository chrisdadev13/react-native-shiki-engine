import { Platform, StyleSheet } from "react-native";

export const monospaceFamily = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});

export const diffUiStyles = StyleSheet.create({
  panel: {
    borderRadius: 12,
    backgroundColor: "#0c0c10",
    overflow: "hidden",
  },
  diffPanelBody: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  diffPanelBodyPadding: {
    paddingVertical: 0,
  },
  /** Line number + sign column; pairs with one shared horizontal ScrollView for all code lines. */
  diffLeftRail: {
    flexShrink: 0,
    paddingLeft: 0,
  },
  diffRowChrome: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 20,
  },
  diffBodyRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  gutterRail: {
    flexShrink: 0,
    paddingLeft: 8,
    paddingVertical: 8,
  },
  /** Plain code block line-number column; matches diff rail spacing (no accent/sign). */
  lineNumberRail: {
    flexShrink: 0,
    paddingLeft: 0,
    paddingVertical: 0,
  },
  diffCodeScroll: {
    flexGrow: 1,
    flexShrink: 1,
  },
  diffCodeScrollInner: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingRight: 8,
  },
  /** Horizontal scroll content for file diff — no extra vertical padding (rows align with diffLeftRail). */
  diffFileCodeScrollContent: {
    flexGrow: 1,
    minWidth: "100%",
    paddingRight: 8,
  },
  diffCodeColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  /** File diff: stretch each line row so rowAdd/rowRemove span at least the scroll viewport width. */
  diffFileCodeColumn: {
    flexDirection: "column",
    alignItems: "stretch",
    minWidth: "100%",
  },
  codeLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    minHeight: 20,
  },
  /** Plain line-number column (CodeBlockWithGutter). */
  gutter: {
    flexDirection: "row",
    width: 32,
    paddingLeft: 0,
    paddingRight: 10,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  /** Diff: both old+new numbers — fixed width, numbers right-aligned in column. */
  gutterDiffDual: {
    flexDirection: "row",
    width: 36,
    paddingLeft: 0,
    paddingRight: 10,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  /** Line-number column shared by plain blocks and diffs (no separator). */
  gutterDiffSingle: {
    flexDirection: "row",
    width: 32,
    paddingLeft: 0,
    paddingRight: 10,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  /** Black rule after line numbers — use only in file diff rows. */
  gutterDiffNumberSeparator: {
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  gutterText: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: monospaceFamily,
    color: "#565f89",
    textAlign: "right",
  },
  gutterLineNumberDiff: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: monospaceFamily,
    textAlign: "right",
  },
  accentStripe: {
    width: 2,
    flexShrink: 0,
    alignSelf: "stretch",
  },
  signCell: {
    minWidth: 26,
    paddingLeft: 0,
    paddingRight: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    flexShrink: 0,
  },
  signText: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: monospaceFamily,
    fontWeight: "400",
  },
  codeScrollInner: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "flex-start",
  },
  codeText: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: monospaceFamily,
  },
  fileSection: {
    marginBottom: 20,
  },
  fileHeader: {
    backgroundColor: "#0C0C10",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#2a2a36",
  },
  fileHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  breadcrumbName: {
    color: "#7aa2f7",
    fontSize: 11,
    fontWeight: "500",
    fontFamily: monospaceFamily,
  },
  breadcrumbArrow: {
    color: "#565f89",
    fontSize: 11,
    fontFamily: monospaceFamily,
    marginHorizontal: 4,
  },
  breadcrumbNameEmphasis: {
    color: "#c0caf5",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: monospaceFamily,
  },
  diffStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  diffStatRemove: {
    color: "#f7768e",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: monospaceFamily,
  },
  diffStatAdd: {
    color: "#9ece6a",
    fontSize: 11,
    fontWeight: "600",
    fontFamily: monospaceFamily,
    marginLeft: 8,
  },
  fileHeaderText: {
    color: "#c0caf5",
    fontSize: 12,
    fontWeight: "300",
    fontFamily: monospaceFamily,
  },
  codeBlockHeaderTitle: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
    color: "#c0caf5",
    fontSize: 11,
    fontWeight: "300",
    fontFamily: monospaceFamily,
  },
  codeBlockHeaderBadge: {
    flexShrink: 0,
    color: "#7aa2f7",
    fontSize: 11,
    fontWeight: "300",
    fontFamily: monospaceFamily,
  },
  codeBlockHeaderSpacer: {
    flex: 1,
    marginRight: 8,
    minWidth: 0,
  },
  /** Vertical inset for CodeBlockWithGutter panel body (both plain and line-number layouts). */
  codeBlockPanelPadding: {
    paddingVertical: 6,
  },
  codeBlockPlainScrollContent: {
    paddingVertical: 6,
    paddingLeft: 8,
    paddingRight: 10,
  },
  gutterLineNumberPlain: {
    fontSize: 11,
    lineHeight: 18,
    fontFamily: monospaceFamily,
    textAlign: "right",
    color: "#a9b1d6",
  },
  rowAdd: {
    backgroundColor: "rgba(65, 120, 95, 0.38)",
  },
  rowRemove: {
    backgroundColor: "rgba(120, 55, 70, 0.42)",
  },
  /** Stacked collapse affordances; align to gutter’s right edge like line numbers. */
  collapsedRailChevronStack: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  collapsedRailChevron: {
    color: "#a9b1d6",
    fontSize: 10,
    lineHeight: 12,
    fontFamily: monospaceFamily,
    textAlign: "right",
  },
  /** Collapsed summary row: same horizontal chrome as diffRowChrome (stripe + gutter + sign). */
  collapsedContextRowChrome: {
    minHeight: 32,
    backgroundColor: "#181820",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#2a2a36",
  },
  /** Vertical center of chevrons in the line-number column. */
  collapsedContextGutter: {
    alignItems: "center",
  },
  collapsedContextLabel: {
    color: "#a9b1d6",
    fontSize: 11,
    fontFamily: monospaceFamily,
    lineHeight: 18,
    marginLeft: 0,
  },
  collapsedContextCodeFill: {
    flexGrow: 1,
    alignSelf: "stretch",
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: "#181820",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#2a2a36",
  },
});
