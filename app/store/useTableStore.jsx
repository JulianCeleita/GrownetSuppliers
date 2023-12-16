import { create } from "zustand";

export const useTableStore = create((set) => ({
  initialColumns: getInitialColumns(),
  initialTotalRows: getInitialTotalRows(),
  customers: null,
  totalNetSum: "0.00",
  totalPriceSum: "0.00",
  totalTaxSum: "0.00",
  totalCostSum: "0.00",
  totalProfit: "0.00",
  totalProfitPercentage: "0.00",
  setTotalNetSum: (total) => set({ totalNetSum: total }),
  setTotalPriceSum: (total) => set({ totalPriceSum: total }),
  setTotalTaxSum: (total) => set({ totalTaxSum: total }),
  setTotalCostSum: (total) => set({ totalCostSum: total }),
  setTotalProfit: (total) => set({ totalProfit: total }),
  setTotalProfitPercentage: (total) => set({ totalProfitPercentage: total }),
  setCustomers: (newCustomers) => set({ customers: newCustomers }),

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
      "Description",
      "UOM",
      "quantity",
      "Net",
      "Total Net",
      "VAT £",
      "Total Price",
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
