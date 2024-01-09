"use client";
import {
  presentationData,
  createStorageOrder,
  presentationsCode,
} from "@/app/config/urls.config";
import { useTableStore } from "@/app/store/useTableStore";
import useTokenStore from "@/app/store/useTokenStore";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import useUserStore from "../store/useUserStore";
import ModalOrderError from "./ModalOrderError";
import ModalSuccessfull from "./ModalSuccessfull";

const initialRowsState = {
  Code: "",
  Description: "",
  Packsize: "",
  UOM: "",
  quantity: "",
  price: "",
  Net: "",
  "Total Net": "",
  "VAT %": "",
  "VAT £": "",
  "Total Price": "",
  "Unit Cost": "",
  Profit: "",
  "Price Band": "",
  "Total Cost": "",
};

const inputRefs = {
  Code: [],
  Description: [],
  Packsize: [],
  UOM: [],
  quantity: [],
  price: [],
  Net: [],
  "Total Net": [],
  "VAT %": [],
  "VAT £": [],
  "Total Price": [],
  "Unit Cost": [],
  Profit: [],
  "Price Band": [],
  "Total Cost": [],
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
    customers,
    setTotalNetSum,
    setTotalPriceSum,
    setTotalTaxSum,
    setTotalCostSum,
    setTotalProfit,
    setTotalProfitPercentage,
  } = useTableStore();
  const [showCheckboxColumnTotal, setShowCheckboxColumnTotal] = useState(false);
  const menuRef = useRef(null);
  const menuRefTotal = useRef(null);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [currentValues, setCurrentValues] = useState({});
  const [productByCode, setProductByCode] = useState({});
  const [DescriptionData, setDescriptionData] = useState(null);
  const lastActiveColumn = initialColumns[initialColumns.length - 1];
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorOrderModal, setShowErrorOrderModal] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const { user, setUser } = useUserStore();

  const columns = [
    "Code",
    "Description",
    "Packsize",
    "UOM",
    "quantity",
    "price",
    "Net",
    "Total Net",
    "VAT %",
    "VAT £",
    "Total Price",
    "Unit Cost",
    "Profit",
    "Price Band",
    "Total Cost",
  ];
  const inputTypes = {
    Code: "text",
    Description: "text",
    Packsize: "text",
    UOM: "text",
    quantity: "number",
    price: "number",
    Net: "number",
    "Total Net": "number",
    "VAT %": "number",
    "VAT £": "text",
    "Total Price": "number",
    "Unit Cost": "number",
    Profit: "number",
    "Price Band": "text",
    "Total Cost": "number",
  };

  useEffect(() => {
    const fetchPresentationData = async () => {
      try {
        const response = await axios.get(presentationData, {
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
    setMouseCoords({ x: e.clientX, y: e.clientY });
  };

  const handleCheckboxChange = (columnName) => {
    toggleColumnVisibility(columnName);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowCheckboxColumn(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PRICE
  const calculatePrice = (row) => {
    const net = parseFloat(row.Net) || 0;
    const tax = parseFloat(row["VAT %"]) || 0;
    const total = net + net * tax;
    const totalFiltered = total !== 0 ? total.toFixed(2) : "";
    return totalFiltered;
  };

  // TOTAL NET
  const calculateTotalNet = (row) => {
    const net = parseFloat(row.Net) || 0;
    const qty = parseFloat(row.quantity) || 0;
    const total = net * qty;
    const totalFormatted = total !== 0 ? total.toFixed(2) : "";
    return totalFormatted;
  };

  // VAT £
  const calculateTaxCalculation = (row) => {
    const net = parseFloat(row.Net) || 0;
    const tax = parseFloat(row["VAT %"]) || 0;
    const qty = parseFloat(row.quantity) || 0;
    const total = net * tax * qty;
    const totalFormatted = total !== 0 ? total.toFixed(2) : "";
    return totalFormatted;
  };

  //  TOTAL PRICE
  const calculateTotalPrice = (row) => {
    const net = parseFloat(row.Net) || 0;
    const tax = parseFloat(row["VAT %"]) || 0;
    const qty = parseFloat(row.quantity) || 0;
    const total = (net + net * tax) * qty;
    const totalFormatted = total !== 0 ? total.toFixed(2) : "";
    return totalFormatted;
  };

  // TOTAL COST
  const calculateTotalCost = (row) => {
    const qty = parseFloat(row.quantity) || 0;
    const cost = parseFloat(row["Unit Cost"]) || 0;
    const total = qty * cost;
    const totalFormatted = total !== 0 ? total.toFixed(2) : "";
    return totalFormatted;
  };

  // PROFIT
  const calculateProfit = (row) => {
    const net = parseFloat(row.Net) || 0;
    const cost = parseFloat(row["Unit Cost"]) || 0;
    const total = ((net - cost) / net) * 100 || 0;
    const totalFiltered = total !== 0 ? `${total.toFixed(2)}%` : "";
    return totalFiltered;
  };

  // TOTAL NET SUM
  const calculateTotalNetSum = (rows) => {
    return rows
      .reduce((acc, row) => {
        const totalNet = parseFloat(calculateTotalNet(row)) || 0;
        return acc + totalNet;
      }, 0)
      .toFixed(2);
  };

  // TOTAL PRICE SUM
  const calculateTotalPriceSum = (rows) => {
    return rows
      .reduce((acc, row) => {
        const totalPrice = parseFloat(calculateTotalPrice(row)) || 0;
        return acc + totalPrice;
      }, 0)
      .toFixed(2);
  };

  // TOTAL TAX SUM
  const calculateTotalTaxSum = (rows) => {
    return rows
      .reduce((acc, row) => {
        const totalTax = parseFloat(calculateTaxCalculation(row)) || 0;
        return acc + totalTax;
      }, 0)
      .toFixed(2);
  };

  // TOTAL COST SUM
  const calculateTotalCostSum = (rows) => {
    return rows
      .reduce((acc, row) => {
        const totalCost = parseFloat(calculateTotalCost(row)) || 0;
        return acc + totalCost;
      }, 0)
      .toFixed(2);
  };

  // TOTAL PROFIT $
  const calculateTotalProfit = () => {
    const totalProfit = totalPriceSum - totalTaxSum - totalCostSum;
    return totalProfit.toFixed(2);
  };

  // TOTAL PROFIT %
  const calculateTotalProfitPercentage = () => {
    const totalProfitPercentage = (totalProfit / totalNetSum) * 100 || 0;
    return totalProfitPercentage.toFixed(2);
  };

  const totalNetSum = calculateTotalNetSum(rows);
  const totalPriceSum = calculateTotalPriceSum(rows);
  const totalTaxSum = calculateTotalTaxSum(rows);
  const totalCostSum = calculateTotalCostSum(rows);
  const totalProfit = calculateTotalProfit();
  const totalProfitPercentage = calculateTotalProfitPercentage();

  useEffect(() => {
    setTotalNetSum(totalNetSum);
    setTotalPriceSum(totalPriceSum);
    setTotalTaxSum(totalTaxSum);
    setTotalCostSum(totalCostSum);
    setTotalProfit(totalProfit);
    setTotalProfitPercentage(totalProfitPercentage);
  }, [
    totalNetSum,
    totalPriceSum,
    totalProfit,
    setTotalProfit,
    totalProfitPercentage,
    setTotalProfitPercentage,
    totalCostSum,
    setTotalCostSum,
    totalTaxSum,
    setTotalNetSum,
    setTotalPriceSum,
    setTotalTaxSum,
  ]);

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
            Code: productByCode.presentation_code,
            Description: productByCode.product_name,
            Packsize: productByCode.presentation_name,
            UOM: productByCode.uom,
            quantity: row.quantity,
            price:
              productByCode.price + productByCode.price * productByCode.tax,
            Net:
              (productByCode.price !== null &&
                productByCode.price.toFixed(2)) ||
              0,
            "Total Net": "",
            "VAT %": productByCode.tax,
            "VAT £": "",
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
        fetchProductCode(rowIndex);
      }

      if (fieldName === "Net") {
        const isLastRow = rowIndex === rows.length - 1;
        if (isLastRow) {
          addNewRow();
          return;
        }
      } else {
        const nextFieldName = getNextFieldName(fieldName, rowIndex);
        const nextFieldRefs = inputRefs[nextFieldName];
        if (nextFieldRefs && nextFieldRefs[rowIndex]) {
          nextFieldRefs[rowIndex].current.focus();
        }
      }
    }
  };

  const fetchProductCode = async (rowIndex) => {
    try {
      // Obtener el valor del input de "Code" desde la fila
      const currentProductCode = rows[rowIndex]["Code"] || "0";
      const currentDescription = rows[rowIndex]["Description"];
      const codeToUse =
        currentProductCode && currentProductCode !== currentValues["Code"]
          ? currentDescription
          : currentProductCode;

      const response = await axios.get(`${presentationsCode}${codeToUse}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productByCodeData = response.data.data[0];

      const updatedRows = rows.map((row, index) => {
        if (
          index === rowIndex &&
          (row["Code"] === currentProductCode ||
            row["Description"] === currentProductCode)
        ) {
          return {
            ...row,
            id_presentations: productByCodeData.id_presentations,
          };
        }
        return row;
      });

      setRows(updatedRows);
      setProductByCode(productByCodeData);
    } catch (error) {
      console.error("Error al hacer la solicitud:", error.message);
    }
  };

  const createOrder = async () => {
    try {
      const filteredProducts = rows
        .filter((row) => parseFloat(row.quantity) > 0)
        .map(({ quantity, price, id_presentations }) => ({
          quantity: parseFloat(quantity),
          price,
          id_presentations,
        }));

      const jsonOrderData = {
        accountNumber_customers: customers?.accountNumber,
        address_delivery: customers?.address,
        date_delivery: customers?.orderDate,
        id_suppliers: 1,
        net: parseFloat(totalNetSum),
        observation: specialRequirements,
        total: parseFloat(totalPriceSum),
        total_tax: parseFloat(totalTaxSum),
        products: filteredProducts,
      };
      const response = await axios.post(createStorageOrder, jsonOrderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowConfirmModal(true);
      setRows(Array.from({ length: 5 }, () => ({ ...initialRowsState })));
      setSpecialRequirements("");
    } catch (error) {
      setShowErrorOrderModal(true);
    }
  };

  // BORRAR CASILLAS SI SE BORRA EL CODE
  const handleCodeChange = (e, rowIndex, column) => {
    const newCodeValue = e.target.value;
    setCurrentValues((prevValues) => ({
      ...prevValues,
      [column]: newCodeValue,
    }));

    if (column === "Code" && newCodeValue.trim() === "") {
      const updatedRows = rows.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...initialRowsState,
          };
        }
        return row;
      });
      setRows(updatedRows);
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
                        className={`py-2 px-2 bg-dark-blue rounded-lg capitalize ${
                          column === "quantity" ||
                          column === "Code" ||
                          column === "VAT %" ||
                          column === "UOM" ||
                          column === "Net"
                            ? "w-20"
                            : column === "Packsize"
                            ? "w-40"
                            : ""
                        }`}
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
                            } `}
                            tabIndex={0}
                            style={{ overflow: "visible" }}
                          >
                            {[
                              "Description",
                              "Packsize",
                              "UOM",
                              "price",
                              "Total Net",
                              "VAT %",
                              "VAT £",
                              "Total Price",
                              "Unit Cost",
                              "Profit",
                              "Price Band",
                              "Total Cost",
                            ].includes(column) ? (
                              <span>
                                {column === "Packsize" && row[column]}
                                {column === "UOM" && row[column]}
                                {column === "price" && calculatePrice(row)}
                                {column === "Total Net" &&
                                  calculateTotalNet(row)}
                                {column === "VAT %" && row[column]}
                                {column === "VAT £" &&
                                  calculateTaxCalculation(row)}
                                {column === "Total Price" &&
                                  calculateTotalPrice(row)}
                                {column === "Unit Cost" && row[column]}
                                {column === "Profit" && calculateProfit(row)}
                                {column === "Price Band" && row[column]}
                                {column === "Total Cost" &&
                                  calculateTotalCost(row)}
                                {column === "Description" && (
                                  <Select
                                    className="w-full"
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
                                    onChange={(selectedDescription, e) => {
                                      setCurrentValues((prevValues) => ({
                                        ...prevValues,
                                        [column]: selectedDescription.code,
                                      }));

                                      const updatedRows = [...rows];
                                      updatedRows[rowIndex][column] =
                                        selectedDescription.code;
                                      if (selectedDescription.code) {
                                        fetchProductCode(rowIndex);
                                      }
                                      setRows(updatedRows);
                                    }}
                                    onKeyDown={(selectedDescription) => {
                                      if (selectedDescription.code) {
                                        fetchProductCode(rowIndex);
                                      }
                                    }}
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        border: "none",
                                        boxShadow: "none",
                                      }),
                                      dropdownIndicator: (provided) => ({
                                        ...provided,
                                        display: "none",
                                      }),
                                      indicatorSeparator: (provided) => ({
                                        ...provided,
                                        display: "none",
                                      }),
                                    }}
                                  />
                                )}
                              </span>
                            ) : (
                              <input
                                type={inputTypes[column]}
                                ref={inputRefs[column][rowIndex]}
                                className={`pl-2 h-[30px] outline-none w-full ${
                                  inputTypes[column] === "number"
                                    ? "hide-number-arrows"
                                    : ""
                                }`}
                                value={row[column] || ""}
                                onChange={(e) => {
                                  if (column === "Net") {
                                    let newValue = parseFloat(e.target.value);

                                    newValue = newValue.toFixed(2);
                                  }
                                  setCurrentValues((prevValues) => ({
                                    ...prevValues,
                                    [column]: e.target.value,
                                  }));
                                  const updatedRows = [...rows];
                                  updatedRows[rowIndex][column] =
                                    e.target.value;
                                  setRows(updatedRows);
                                  handleCodeChange(e, rowIndex, column);
                                }}
                                step={0.1}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, rowIndex, column)
                                }
                                onKeyPress={(e) => {
                                  if (column === "Net" && e.charCode === 46) {
                                    return;
                                  }
                                  if (
                                    inputTypes[column] === "number" &&
                                    (e.charCode < 48 || e.charCode > 57)
                                  ) {
                                    e.preventDefault();
                                  }
                                }}
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
            <div
              ref={menuRef}
              className="absolute bg-white p-2 border rounded"
              style={{
                top: `${mouseCoords.y}px`,
                left: `${mouseCoords.x}px`,
              }}
            >
              <h4 className="font-bold mb-2">Show/Hide Columns</h4>
              {columns.map((column) => (
                <div key={column} className={`flex items-center`}>
                  <input
                    type="checkbox"
                    id={column}
                    checked={initialColumns.includes(column)}
                    onChange={() => handleCheckboxChange(column)}
                  />
                  <label htmlFor={column} className="ml-2 capitalize">
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
      <div className="flex justify-center mb-20 w-full mt-5">
        <h1 className="bg-dark-blue text-white font-semibold p-3 rounded-tl-lg rounded-bl-lg w-[30%] items-center text-center flex justify-center">
          Special requirements
        </h1>
        <input
          type="text"
          value={specialRequirements}
          onChange={(e) => setSpecialRequirements(e.target.value)}
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
      <ModalSuccessfull
        isvisible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      />
      <ModalOrderError
        isvisible={showErrorOrderModal}
        onClose={() => setShowErrorOrderModal(false)}
      />
    </div>
  );
}
