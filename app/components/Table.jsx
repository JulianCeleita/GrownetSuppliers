"use client";
import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import {
  PresentationData,
  createStorageOrder,
  presentationsCode,
  productsUrl,
} from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import { useTableStore } from "@/app/store/useTableStore";

const initialRowsState = {
  Code: "",
  Description: "",
  Packsize: "",
  UOM: "",
  Qty: "",
  Price: "",
  Net: "",
  "Total Net": "",
  Tax: "",
  "Tax Calculation": "",
  "Total Price": "",
  "Unit Cost": "",
  "Total Cost": "",
  Profit: "",
  "Price Band": "",
};

const inputRefs = {
  Code: [],
  Description: [],
  Packsize: [],
  UOM: [],
  Qty: [],
  Price: [],
  Net: [],
  "Total Net": [],
  Tax: [],
  "Tax Calculation": [],
  "Total Price": [],
  "Unit Cost": [],
  "Total Cost": [],
  Profit: [],
  "Price Band": [],
};

const useFocusOnEnter = (formRef) => {
  const onEnterKey = (event) => {
    if (
      event &&
      event.keyCode &&
      event.keyCode === 13 &&
      event.target &&
      event.target.form
    ) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      for (let i = index + 1; i < formRef.current.length; i++) {
        if (formRef.current[i].tabIndex === -1) {
          continue;
        }
        formRef.current[i].focus();
        if (document.activeElement === formRef.current[i]) {
          break;
        }
      }
    }
  };
  return { onEnterKey };
};

export default function Table({
  updateTotalPriceSum,
  updateTotalTaxSum,
  updateTotalNetSum,
}) {
  const [rows, setRows] = useState(
    Array.from({ length: 5 }, () => ({ ...initialRowsState }))
  );
  const form = useRef();
  const { onEnterKey } = useFocusOnEnter(form);
  const { token } = useTokenStore();
  const [products, setProducts] = useState([]);
  const {
    initialColumns,
    toggleColumnVisibility,
    initialTotalRows,
    toggleTotalRowVisibility,
    customers,
  } = useTableStore();
  const [showCheckboxColumnTotal, setShowCheckboxColumnTotal] = useState(false);
  const menuRef = useRef(null);
  const menuRefTotal = useRef(null);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [currentValues, setCurrentValues] = useState({});
  const [productByCode, setProductByCode] = useState({});
  const [DescriptionData, setDescriptionData] = useState(null);
  const lastActiveColumn = initialColumns[initialColumns.length - 1];

  const columns = [
    "Code",
    "Description",
    "Packsize",
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
  ];
  const inputTypes = {
    Code: "text",
    Description: "text",
    Packsize: "text",
    UOM: "text",
    Qty: "number",
    Price: "number",
    Net: "number",
    "Total Net": "number",
    Tax: "number",
    "Tax Calculation": "text",
    "Total Price": "number",
    "Unit Cost": "number",
    "Total Cost": "number",
    Profit: "number",
    "Price Band": "text",
  };

  useEffect(() => {
    const fetchPresentationData = async () => {
      try {
        const response = await axios.get(PresentationData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const modifiedData = response.data.presentations
          .filter((item) => item.code !== null)
          .map((item) => ({
            ...item,
            concatenatedName: `${item.productName} - ${item.presentationName}`,
          }))
          .sort((a, b) => a.concatenatedName.localeCompare(b.concatenatedName));

        setDescriptionData(modifiedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPresentationData();
  }, [token]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowCheckboxColumn(!showCheckboxColumn);
  };

  const handleCheckboxChange = (columnName) => {
    toggleColumnVisibility(columnName);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowCheckboxColumn(false);
    }
  };

  // PRICE
  const calculatePrice = (row) => {
    const net = parseFloat(row.Net) || 0;
    const tax = parseFloat(row.Tax) || 0;
    const total = net + net * tax;
    const totalFiltered = total !== 0 ? total.toFixed(2) : "";
    return totalFiltered;
  };

  // TOTAL NET
  const calculateTotalNet = (row) => {
    const net = parseFloat(row.Net) || 0;
    const qty = parseFloat(row.Qty) || 0;
    const total = net * qty;
    const totalFiltered = total !== 0 ? total.toFixed(2) : "";
    return totalFiltered;
  };

  // TAX CALCULATION
  const calculateTaxCalculation = (row) => {
    const net = parseFloat(row.Net) || 0;
    const tax = parseFloat(row.Tax) || 0;
    const qty = parseFloat(row.Qty) || 0;
    const total = (net * tax) * qty;
    const totalFiltered = total !== 0 ? total.toFixed(2) : "";
    return totalFiltered;
  };

  //  TOTAL PRICE
  const calculateTotalPrice = (row) => {
    const price = parseFloat(row.Price) || 0;
    const qty = parseFloat(row.Qty) || 0;
    const total = price * qty;
    const totalFiltered = total !== 0 ? total.toFixed(2) : "";
    return totalFiltered;
  };

  // TOTAL COST
  const calculateTotalCost = (row) => {
    const qty = parseFloat(row.Qty) || 0;
    const cost = parseFloat(row["Unit Cost"]) || 0;
    const total = qty * cost;
    const totalFiltered = total !== 0 ? total.toFixed(2) : "";
    return totalFiltered;
  };

  // PROFIT
  const calculateProfit = (row) => {
    const price = parseFloat(row.Price) || 0;
    const cost = parseFloat(row["Unit Cost"]) || 0;
    const tax = parseFloat(row.Tax) * parseFloat(row.Net);
    const total = (price - cost - tax) / parseFloat(row.Net) * 100 || 0;
    const totalFiltered = total !== 0 ? total.toFixed(2) : "";
    return totalFiltered;
  };

  //SUMA TOTAL INVOICE
  useEffect(() => {
    const totalSum = rows.reduce(
      (sum, row) => sum + calculateTotalPrice(row),
      0
    );
    updateTotalPriceSum(totalSum);
  }, [rows, updateTotalPriceSum]);

  //SUMA TOTAL VAT
  useEffect(() => {
    const totalSum = rows.reduce(
      (sum, row) => sum + calculateTaxCalculation(row),
      0
    );
    updateTotalTaxSum(totalSum);
  }, [rows, updateTotalTaxSum]);

  //SUMA NET INVOICE
  const calculateTotalNetSum = (rows) => {
    return rows.reduce((sum, row) => sum + (parseFloat(row.Price) || 0), 0);
  };
  useEffect(() => {
    const totalNetSum = calculateTotalNetSum(rows);
    updateTotalNetSum(totalNetSum);
  }, [rows, updateTotalNetSum]);

  // VALORES INICIALES DE LA TABLA
  useEffect(() => {
    if (productByCode) {
      const updatedRows = rows.map((row, index) => {
        if (
          row["Code"] === currentValues["Code"] ||
          row["Description"] === currentValues["Description"]
        ) {
          return {
            ...row,
            Code: productByCode.product_code,
            Description: productByCode.product_name,
            Packsize: productByCode.presentation_name,
            UOM: productByCode.uom,
            Qty: "",
            Price: productByCode.price + productByCode.price * productByCode.tax,
            Net: productByCode.price,
            "Total Net": "",
            Tax: productByCode.tax,
            "Tax Calculation": "",
            "Total Price": "",
            "Unit Cost": productByCode.cost,
            "Total Cost": "",
            Profit: "",
            "Price Band": "",
          };
        }
        return row;
      });
      setRows(updatedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productByCode]);

  // AGREGAR NUEVA FILA
  const addNewRow = () => {
    setRows((prevRows) => [...prevRows, { ...initialRowsState }]);
  };

  // OBTENER NOMBRE DEL CAMPO SIGUIENTE
  const getNextFieldName = (currentFieldName, rowIndex) => {
    const currentIndex = initialColumns.indexOf(currentFieldName);

    if (currentIndex !== -1) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < initialColumns.length) {
        return initialColumns[nextIndex];
      } else {
        return rowIndex === rows.length - 1 ? null : initialColumns[0];
      }
    }

    return null;
  };

  // FUNCIONALIDAD TECLA ENTER

  const handleKeyDown = (e, rowIndex, fieldName) => {
    if (e.key === "Enter" && e.target.tagName.toLowerCase() !== "textarea") {
      e.preventDefault();

      if (
        (fieldName === "Code" && currentValues["Code"].trim() !== "") ||
        (fieldName === "Description" &&
          currentValues["Description"].trim() !== "")
      ) {
        fetchPrductCOde();
        console.log("Entro fetchPrductCOde");
      }

      const nextFieldName = getNextFieldName(fieldName, rowIndex);

      if (nextFieldName != null) {
        const nextFieldRefs = inputRefs[nextFieldName];
        if (nextFieldRefs && nextFieldRefs[rowIndex]) {
          nextFieldRefs[rowIndex].current.focus();
        }
      } else {
        const isLastCell =
          rowIndex === rows.length - 1 &&
          initialColumns.indexOf(fieldName) === initialColumns.length - 1;

        if (isLastCell) {
          console.log("Entro addNewRow");
          addNewRow();
        } else {
          const nextRowIndex = rowIndex + 1;
          const nextFieldRefs = inputRefs[lastActiveColumn][nextRowIndex];
          if (nextFieldRefs && nextFieldRefs.current) {
            nextFieldRefs.current.focus();
          }
        }
      }
    }
  };

  const fetchPrductCOde = async () => {
    try {
      // Obtener el valor del input de "Code" desde currentValues
      const currentProductCode =
        currentValues["Code"] || currentValues["Description"];
      console.log("currentProductCode", currentProductCode);
      const response = await axios.get(
        `${presentationsCode}${currentProductCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductByCode(response.data.data[0]);
    } catch (error) {
      // Manejar errores aquí
      console.error("Error al hacer la solicitud:", error.message);
    }
  };

  console.log("currentValues", currentValues);
  console.log("data A enviar :", rows);
  console.log("productByCode:", productByCode);

  const createOrder = async () => {
    try {
      const filteredProducts = rows
        .filter((row) => parseFloat(row.Qty) > 0)
        .map(({ Qty, Packsize, Price }) => ({ Qty, Packsize, Price }));

      const jsonOrderData = {
        accountNumber_customers: customers.accountNumber,
        address_delivery: customers.address,
        date_delivery: customers.orderDate,
        id_suppliers: 1,
        net: 19.76,
        observation: "Test Heiner desde app suppliers",
        total: 78.5,
        total_tax: 58.76,
        products: filteredProducts,
      };
      console.log("jsonOrderData", jsonOrderData);
      const response = await axios.post(createStorageOrder, jsonOrderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("se creo la ordern", response);
    } catch (error) {
      console.log("Error al crear la orden", error);
    }
  };

  return (
    <div className="flex flex-col p-8">
      <div className="overflow-x-auto">
        <form
          ref={form}
          onKeyUp={(event) => onEnterKey(event)}
          className="m-1 whitespace-nowrap"
        >
          <table className="w-full text-sm text-center table-auto">
            <thead className="text-white">
              <tr>
                {columns.map(
                  (column, index) =>
                    initialColumns.includes(column) && (
                      <th
                        key={index}
                        scope="col"
                        className={`py-2 bg-dark-blue rounded-lg ${["Net", "Tax"].includes(column) ? "hidden" : ""}`}
                        onContextMenu={(e) => handleContextMenu(e)}
                        style={{
                          boxShadow:
                            "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <p className="text-lg text-white">{column}</p>
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* CODIGO DE PRODUCTO */}
                  {columns.map(
                    (column, columnIndex) =>
                      initialColumns.includes(column) && (
                        <React.Fragment key={columnIndex}>
                          <td
                            className={`px-3 py-2 border-r-2 border-r-[#0c547a] border-[#808e94] ${
                              rowIndex === 0 ? "border-t-0" : "border-t-2"
                            } ${["Net", "Tax"].includes(column) ? "hidden" : ""}`}
                            tabIndex={0}
                            style={{ overflow: "visible" }}
                          >
                            {[
                              "Total Price",
                              "Tax Calculation",
                              "Total Cost",
                              "Profit",
                              "Description",
                              "Price",
                              "Total Net",
                            ].includes(column) ? (
                              <span>
                                {column === "Total Price" &&
                                  calculateTotalPrice(row)}
                                {column === "Tax Calculation" &&
                                  calculateTaxCalculation(row)}
                                {column === "Total Cost" &&
                                  calculateTotalCost(row)}
                                {column === "Profit" &&
                                  `${calculateProfit(row)}%`}
                                  {column === "Price" &&
                                  calculatePrice(row)}
                                  {column === "Total Net" &&
                                  calculateTotalNet(row)}
                                {column === "Description" && (
                                  <Select
                                    className="w-[240px] whitespace-nowrap"
                                    menuPortalTarget={document.body}
                                    options={
                                      DescriptionData
                                        ? DescriptionData.map((item) => ({
                                            value: item.productName,
                                            label: item.concatenatedName,
                                            code: item.code,
                                          }))
                                        : []
                                    }
                                    value={{
                                      label: row[column] || "",
                                      value: row[column] || "",
                                    }}
                                    onChange={(selectedDescription) => {
                                      setCurrentValues((prevValues) => ({
                                        ...prevValues,
                                        [column]: selectedDescription.code,
                                      }));

                                      const updatedRows = [...rows];
                                      updatedRows[rowIndex][column] =
                                        selectedDescription.code;
                                      setRows(updatedRows);
                                    }}
                                    onKeyDown={(e) =>
                                      handleKeyDown(e, rowIndex, column)
                                    }
                                  />
                                )}
                              </span>
                            ) : (
                              <input
                                type={inputTypes[column]}
                                ref={inputRefs[column][rowIndex]}
                                className="pl-2 h-[30px] outline-none w-full"
                                value={row[column] || ""}
                                onChange={(e) => {
                                  setCurrentValues((prevValues) => ({
                                    ...prevValues,
                                    [column]: e.target.value,
                                  }));
                                  const updatedRows = [...rows];
                                  updatedRows[rowIndex][column] =
                                    e.target.value;
                                  setRows(updatedRows);
                                }}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, rowIndex, column)
                                }
                              />
                            )}
                          </td>
                        </React.Fragment>
                      )
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {showCheckboxColumn === true && (
            <div ref={menuRef} className="absolute bg-white p-2 border rounded">
              <h4 className="font-bold mb-2">Show/Hide Columns</h4>
              {columns.map((column) => (
                <div key={column} className={`flex items-center ${["Net", "Tax"].includes(column) ? "hidden" : ""}`}>
                  <input
                    type="checkbox"
                    id={column}
                    checked={initialColumns.includes(column)}
                    onChange={() => handleCheckboxChange(column)}
                  />
                  <label htmlFor={column} className="ml-2">
                    {column}
                  </label>
                </div>
              ))}
              <button
                className="mt-2 text-danger"
                onClick={() => setShowCheckboxColumn(false)}
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
      <div className="flex justify-center mb-40 w-full mt-5">
        <h1 className="bg-dark-blue text-white font-semibold p-3 rounded-tl-lg rounded-bl-lg w-[30%] items-center text-center flex justify-center">
          Special requirements
        </h1>
        <input
          type="text"
          className="p-3 border border-dark-blue rounded-tr-lg rounded-br-lg w-full mr-5"
          placeholder="Write your comments here"
        />
        <button
          onClick={createOrder}
          className="bg-primary-blue py-2 px-4 rounded-lg text-white font-medium mr-2 w-[15%]"
        >
          Send order
        </button>
      </div>
    </div>
  );
}
