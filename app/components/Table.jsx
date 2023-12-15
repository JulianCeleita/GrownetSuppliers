"use client";
import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { presentationsCode, productsUrl } from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import { useTableStore } from "@/app/store/useTableStore";
import { fetchPresentations } from "../presentations/page";

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

export default function Table() {
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
  } = useTableStore();
  const [showCheckboxColumnTotal, setShowCheckboxColumnTotal] = useState(false);
  const menuRef = useRef(null);
  const menuRefTotal = useRef(null);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [currentValues, setCurrentValues] = useState({});
  const [productByCode, setProductByCode] = useState("");
  const [Packsize, setPacksize] = useState(null);
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
  console.log("initialColumns:", initialColumns);

  useEffect(() => {
    fetchPresentations(token, setPacksize);
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  //Ventana Total:
  const columnsTotal = [
    { name: "Net Invoice", price: "£ 100" },
    { name: "Total VAT", price: "£ 200" },
    { name: "Total Invoice", price: "£ 300" },
    { name: "Profit (£)", price: "£ 100" },
    { name: "Profit (%)", price: "10.60%" },
  ];

  const handleContextMenuTotal = (e) => {
    e.preventDefault();
    setShowCheckboxColumnTotal(!showCheckboxColumnTotal);
  };
  const handleCheckboxChangeTotal = (columnName) => {
    toggleTotalRowVisibility(columnName);
  };
  const handleClickOutsideTotal = (e) => {
    if (menuRefTotal.current && !menuRefTotal.current.contains(e.target)) {
      setShowCheckboxColumnTotal(false);
    }
  };
  console.log("initialTotalsi:", initialTotalRows);

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTotal);
    return () => {
      document.removeEventListener("click", handleClickOutsideTotal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //Product api
  // useEffect(() => {
  //   axios
  //     .get(productsUrl, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((response) => {
  //       setProducts(
  //         response.data.products.map((product) => ({
  //           value: product.code,
  //           label: product.code,
  //         }))
  //       );
  //       console.log("Productos:", response.data.products);
  //     })
  //     .catch((error) => {
  //       console.error("Error al obtener los productos:", error);
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // VALORES INICIALES DE LA TABLA
  useEffect(() => {
    if (productByCode) {
      const updatedRows = rows.map((row, index) => {
        if (row["Code"] === currentValues["Code"]) {
          return {
            ...row,
            Code: productByCode.code,
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

      if (fieldName === "Code" && currentValues["Code"].trim() !== "") {
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
      const currentProductCode = currentValues["Code"];
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

  console.log("Packsize:", Packsize);

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
                                      Packsize
                                        ? Packsize.map((item) => ({
                                            value: item.name,
                                            label: item.name,
                                          }))
                                        : []
                                    }
                                    value={{
                                      label: row.Description,
                                      value: row.Description,
                                    }}
                                    onChange={(selectedDescription) => {
                                      const updatedRows = [...rows];
                                      updatedRows[rowIndex].Description =
                                        selectedDescription.label;
                                      setRows(updatedRows);
                                    }}
                                  />
                                )}
                              </span>
                            ) : (
                              <input
                                type={inputTypes[column]}
                                ref={inputRefs[column][rowIndex]}
                                className="pl-2 h-[30px] outline-none w-full"
                                value={row[column]}
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
      <div className="flex flex-col items-end justify-end mb-40">
        <div
          className="w-[20%] p-5 mt-10 bg-white rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] mb-5"
          onContextMenu={(e) => handleContextMenuTotal(e)}
        >
          {columnsTotal.map(
            (column, index) =>
              initialTotalRows.includes(column.name) && (
                <div className=" flex items-center mt-2" key={column.name}>
                  <h1 className="text-lg text-dark-blue font-semibold w-[80%] ml-5">
                    {column.name}
                  </h1>
                  <p className="text-dark-blue text-lg w-[40%]">
                    {column.price}
                  </p>
                </div>
              )
          )}
          <div className="w-full flex justify-center mt-3">
            <button className="bg-primary-blue py-2 px-4 rounded-lg text-white font-medium mr-2">
              Send order
            </button>
          </div>
        </div>
        {showCheckboxColumnTotal === true && (
          <div
            ref={menuRefTotal}
            className="w-[20%] bg-white p-3 border rounded-xl"
          >
            <h4 className="font-bold mb-2 text-dark-blue">Show/Hide Columns</h4>
            {columnsTotal.map((column) => (
              <div
                key={column.name}
                className="flex items-center text-dark-blue"
              >
                <input
                  type="checkbox"
                  id={column.name}
                  checked={initialTotalRows.includes(column.name)}
                  onChange={() => handleCheckboxChangeTotal(column.name)}
                />
                <label htmlFor={column.name} className="ml-2">
                  {column.name}
                </label>
              </div>
            ))}
            <button
              className="mt-2 text-danger"
              onClick={() => setShowCheckboxColumnTotal(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
