import { create } from "zustand";

export const useTableStore = create((set) => ({
  initialColumns: JSON.parse(localStorage.getItem("initialColumns")) || [
    "Product Code",
    "Presentation",
    "Description",
    "UOM",
    "Qty",
    "Price",
    "Total Price",
    "Unit Cost",
    "Profit",
    "Price Band",
    "Total Cost",
    "Tax",
    "Tax Calculation",
  ],

  initialTotalRows: JSON.parse(localStorage.getItem("initialTotalRows")) || [
    "Net Invoice",
    "Total VAT",
    "Total Invoice",
    "Profit (£)",
    "Profit (%)",
  ],

  toggleColumnVisibility: (columnName) =>
    set((state) => {
      const newInitialColumns = state.initialColumns.includes(columnName)
        ? state.initialColumns.filter((col) => col !== columnName)
        : [...state.initialColumns, columnName];
      localStorage.setItem("initialColumns", JSON.stringify(newInitialColumns));

      return {
        initialColumns: newInitialColumns,
      };
    }),

  toggleTotalRowVisibility: (rowName) =>
    set((state) => {
      const newInitialTotalRows = state.initialTotalRows.includes(rowName)
        ? state.initialTotalRows.filter((row) => row !== rowName)
        : [...state.initialTotalRows, rowName];
      localStorage.setItem(
        "initialTotalRows",
        JSON.stringify(newInitialTotalRows)
      );

      return {
        initialTotalRows: newInitialTotalRows,
      };
    }),
}));
