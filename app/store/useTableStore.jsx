import { create } from "zustand";

export const useTableStore = create((set) => ({
  initialColumns: getInitialColumns(),
  initialTotalRows: getInitialTotalRows(),
  toggleColumnVisibility: (columnName) =>
    set((state) => {
      const newInitialColumns = state.initialColumns.includes(columnName)
        ? state.initialColumns.filter((col) => col !== columnName)
        : [...state.initialColumns, columnName];
      saveToLocalStorage("initialColumns", newInitialColumns);

      return {
        initialColumns: newInitialColumns,
      };
    }),
  toggleTotalRowVisibility: (rowName) =>
    set((state) => {
      const newInitialTotalRows = state.initialTotalRows.includes(rowName)
        ? state.initialTotalRows.filter((row) => row !== rowName)
        : [...state.initialTotalRows, rowName];
      saveToLocalStorage("initialTotalRows", newInitialTotalRows);

      return {
        initialTotalRows: newInitialTotalRows,
      };
    }),
}));

function getInitialColumns() {
  return (
    JSON.parse(
      typeof window !== "undefined"
        ? window.localStorage.getItem("initialColumns")
        : "[]"
    ) || [
      "Code",
      "Packsize",
      "Description",
      "UOM",
      "Qty",
      "Price",
      "Net",
      "Total Net",
      "Tax",
      "Tax Calculation",
      "Total Price",
      "Unit Cost",
      "Total Cost",
      "Profit",
      "Price Band",
    ]
  );
}

function getInitialTotalRows() {
  return (
    JSON.parse(
      typeof window !== "undefined"
        ? window.localStorage.getItem("initialTotalRows")
        : "[]"
    ) || ["Net Invoice", "Total VAT", "Total Invoice"]
  );
}

function saveToLocalStorage(key, value) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}
