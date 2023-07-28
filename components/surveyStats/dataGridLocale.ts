import { GridLocaleText } from "@mui/x-data-grid";

export const GRID_LOCALE_TEXT: GridLocaleText = {
  // Root
  noRowsLabel: "Keine Daten",
  noResultsOverlayLabel: "Keine Daten gefunden.",
  //errorOverlayDefaultLabel: "Es ist ein unerwarteter Fehler aufgetreten.",
  // Density selector toolbar button text
  toolbarDensity: "Anzeige",
  toolbarDensityLabel: "Anzeigedichte",
  toolbarDensityCompact: "Kompakt",
  toolbarDensityStandard: "Standard",
  toolbarDensityComfortable: "Große Abstände",

  // Columns selector toolbar button text
  toolbarColumns: "Spalten",
  toolbarColumnsLabel: "Spalten auswählen",

  // Filters toolbar button text
  toolbarFilters: "Filter",
  toolbarFiltersLabel: "Filter anzeigen",
  toolbarFiltersTooltipHide: "Filter Verstecken",
  toolbarFiltersTooltipShow: "Filter anzeigen",
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive Filter` : `${count} aktiver Filter`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: "Suchen…",
  toolbarQuickFilterLabel: "Suchen",
  toolbarQuickFilterDeleteIconLabel: "Löschen",

  // Export selector toolbar button text
  toolbarExport: "Exportieren",
  toolbarExportLabel: "Exportieren",
  toolbarExportCSV: "CSV herunterladen",
  toolbarExportPrint: "Drucken",
  toolbarExportExcel: "Download as Excel",

  // Columns panel text
  columnsPanelTextFieldLabel: "Spalte finden",
  columnsPanelTextFieldPlaceholder: "Spaltentitel",
  columnsPanelDragIconLabel: "Spalten neu anordnen",
  columnsPanelShowAllButton: "Alle anzeigen",
  columnsPanelHideAllButton: "Alle verstecken",

  // Filter panel text
  filterPanelAddFilter: "Filter hinzufügen",
  filterPanelDeleteIconLabel: "Löschen",
  //filterPanelLinkOperator: "Logischer Operator",
  //filterPanelOperators: "Operator",
  filterPanelOperatorAnd: "Und",
  filterPanelOperatorOr: "Oder",
  filterPanelColumns: "Spalten",
  filterPanelInputLabel: "Wert",
  filterPanelInputPlaceholder: "Filter-Wert",

  // Filter operators text
  filterOperatorContains: "enthält",
  filterOperatorEquals: "ist gleich",
  filterOperatorStartsWith: "startet mit",
  filterOperatorEndsWith: "endet mit",
  filterOperatorIs: "ist",
  filterOperatorNot: "ist nicht",
  filterOperatorAfter: "ist nach",
  filterOperatorOnOrAfter: "ist an oder nach",
  filterOperatorBefore: "ist vor",
  filterOperatorOnOrBefore: "ist an oder vor",
  filterOperatorIsEmpty: "ist leer",
  filterOperatorIsNotEmpty: "ist nicht leer",
  filterOperatorIsAnyOf: "ist einer von",

  // Filter values text
  filterValueAny: "irgendein",
  filterValueTrue: "wahr",
  filterValueFalse: "falsch",

  // Column menu text
  columnMenuLabel: "Menu",
  columnMenuShowColumns: "Spalten anzeigen",
  columnMenuFilter: "Filter",
  columnMenuHideColumn: "Verstecken",
  columnMenuUnsort: "Sortierung aufheben",
  columnMenuSortAsc: "Aufsteigend sortieren",
  columnMenuSortDesc: "Absteigend sortieren",

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} aktive Filter` : `${count} aktiver Filter`,
  columnHeaderFiltersLabel: "Filter anzeigen",
  columnHeaderSortIconLabel: "Sortieren",

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} Zeilen ausgewählt`
      : `${count.toLocaleString()} Zeile ausgewählt`,

  // Total row amount footer text
  footerTotalRows: "Zeilen gesamt:",

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: "Auswahl",
  checkboxSelectionSelectAllRows: "Alle Zeilen auswählen",
  checkboxSelectionUnselectAllRows: "Keine Zeilen auswählen",
  checkboxSelectionSelectRow: "Zeile auswählen",
  checkboxSelectionUnselectRow: "Zeile abwählen",

  // Boolean cell text
  booleanCellTrueLabel: "ja",
  booleanCellFalseLabel: "nein",

  // Actions cell more text
  actionsCellMore: "mehr",

  // Column pinning text
  pinToLeft: "Links anheften",
  pinToRight: "Rechts anheften",
  unpin: "Nicht mehr anheften",

  // Tree Data
  treeDataGroupingHeaderName: "Gruppe",
  treeDataExpand: "Kinder anzeigen",
  treeDataCollapse: "Kinder verstecken",

  // Grouping columns
  groupingColumnHeaderName: "Gruppe",
  groupColumn: (name) => `Gruppiert nach ${name}`,
  unGroupColumn: (name) => `Nicht mehr gruppieren nach ${name}`,

  // Master/detail
  detailPanelToggle: "Detail-Panel umschalten",
  expandDetailPanel: "Ausklappen",
  collapseDetailPanel: "Einklappen",

  // Used core components translation keys
  MuiTablePagination: {},

  // Row reordering text
  rowReorderingHeaderName: "Zeilen neu ordnen",

  // Aggregation
  aggregationMenuItemHeader: "Aggregieren",
  aggregationFunctionLabelSum: "Summe",
  aggregationFunctionLabelAvg: "Durchschnitt",
  aggregationFunctionLabelMin: "Minimum",
  aggregationFunctionLabelMax: "Maximum",
  aggregationFunctionLabelSize: "Größe",

  filterPanelRemoveAll: "",
  filterPanelLogicOperator: "",
  filterPanelOperator: "",
  "filterOperator=": "=",
  "filterOperator!=": "!=",
  "filterOperator>": ">",
  "filterOperator>=": ">=",
  "filterOperator<": "<",
  "filterOperator<=": "<=",
  headerFilterOperatorContains: "",
  headerFilterOperatorEquals: "",
  headerFilterOperatorStartsWith: "",
  headerFilterOperatorEndsWith: "",
  headerFilterOperatorIs: "",
  headerFilterOperatorNot: "",
  headerFilterOperatorAfter: "",
  headerFilterOperatorOnOrAfter: "",
  headerFilterOperatorBefore: "",
  headerFilterOperatorOnOrBefore: "",
  headerFilterOperatorIsEmpty: "",
  headerFilterOperatorIsNotEmpty: "",
  headerFilterOperatorIsAnyOf: "",
  "headerFilterOperator=": "=",
  "headerFilterOperator!=": "!=",
  "headerFilterOperator>": ">",
  "headerFilterOperator>=": ">=",
  "headerFilterOperator<": "<",
  "headerFilterOperator<=": "<=",
  columnMenuManageColumns: "",
};
