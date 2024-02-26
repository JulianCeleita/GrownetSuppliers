"use client";
import {
  createStorageOrder,
  presentationData,
  presentationsCode,
} from "@/app/config/urls.config";
import { useTableStore } from "@/app/store/useTableStore";
import useTokenStore from "@/app/store/useTokenStore";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { fetchPresentationsSupplier } from "../api/presentationsRequest";
import useUserStore from "../store/useUserStore";
import ModalOrderError from "./ModalOrderError";
import ModalSuccessfull from "./ModalSuccessfull";
import ModalRoutes from "./ModalRoutes";

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
      const fieldName = event.target.getAttribute("data-field-name");

      if (fieldName === "quantity" && event.target.value.trim() === "") {
        return;
      }

      for (let i = index + 1; i < formRef.current.length; i++) {
        if (formRef.current[i].getAttribute("data-field-name") === "Net") {
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
  orderDate,
  confirmCreateOrder,
  setConfirmCreateOrder,
  specialRequirements,
  setSpecialRequirements,
  customerDate,
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
    customers,
    setCustomers,
    setTotalNetSum,
    setTotalPriceSum,
    setTotalTaxSum,
    setTotalCostSum,
    setTotalProfit,
    setTotalProfitPercentage,
  } = useTableStore();

  const menuRef = useRef(null);

  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [currentValues, setCurrentValues] = useState({});
  const [DescriptionData, setDescriptionData] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorOrderModal, setShowErrorOrderModal] = useState(false);
  const [showErrorCode, setShowErrorCode] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const { user, setUser } = useUserStore();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [presentations, setPresentations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [existingCodes, setExistingCodes] = useState(new Set());
  const [isSelectDisabled, setIsSelectDisabled] = useState(true);
  const [previousCode, setPreviousCode] = useState({});
  const [showErrorDuplicate, setShowErrorDuplicate] = useState(false);
  const [showErrorRoutes, setShowErrorRoutes] = useState(false);
  const [sendingOrder, setSendingOrder] = useState(false);

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
    quantity: "text",
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

  const sortData = (data, searchTerm) => {
    const lowercasedTerm = searchTerm.toLowerCase();

    const exactMatchesCode = data.filter(
      (item) => item.code.toLowerCase() === lowercasedTerm
    );
    exactMatchesCode.sort((a, b) =>
      a.product_name.localeCompare(b.product_name)
    );

    const partialMatchesCode = data.filter(
      (item) =>
        item.code.toLowerCase().includes(lowercasedTerm) &&
        item.code.toLowerCase() !== lowercasedTerm
    );
    partialMatchesCode.sort((a, b) =>
      a.product_name.localeCompare(b.product_name)
    );

    const exactMatchesProductName = data.filter(
      (item) => item.product_name.toLowerCase() === lowercasedTerm
    );
    exactMatchesProductName.sort((a, b) =>
      a.product_name.localeCompare(b.product_name)
    );

    const partialMatchesProductName = data.filter(
      (item) =>
        item.product_name.toLowerCase().includes(lowercasedTerm) &&
        item.product_name.toLowerCase() !== lowercasedTerm &&
        !exactMatchesCode.includes(item) &&
        !partialMatchesCode.includes(item)
    );
    partialMatchesProductName.sort((a, b) =>
      a.product_name.localeCompare(b.product_name)
    );

    return [
      ...exactMatchesCode,
      ...partialMatchesCode,
      ...exactMatchesProductName,
      ...partialMatchesProductName,
    ];
  };
  //Modal no routes
  useEffect(() => {
    if (confirmCreateOrder && customerDate === undefined) {
      setShowErrorRoutes(true);
    }
  }, [confirmCreateOrder, customerDate, setShowErrorRoutes]);

  useEffect(() => {
    fetchPresentationsSupplier(
      token,
      user,
      setPresentations,
      setIsLoading,
      setDescriptionData
    );
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

  // AGREGAR NUEVA FILA
  const addNewRow = () => {
    setRows((prevRows) => [...prevRows, { ...initialRowsState }]);
  };

  // FUNCIONALIDAD TECLA ENTER
  const handleKeyDown = async (e, rowIndex, fieldName) => {
    if (e.key === "Enter" && e.target.tagName.toLowerCase() !== "textarea") {
      e.preventDefault();

      let productCode = "";

      if (fieldName === "Code" && currentValues["Code"]?.trim() !== "") {
        productCode = currentValues["Code"];
      }
      if (productCode) {
        await fetchProductCode(rowIndex, productCode);
        synchronizeExistingCodes();
      }

      const nextRowIndex = rowIndex + 1;
      if (nextRowIndex < rows.length) {
        form.current[nextRowIndex].querySelector('input[type="text"]')?.focus();
      } else {
        addNewRow();
      }
    }
  };

  const synchronizeExistingCodes = () => {
    const codesInRows = new Set(
      rows.map((row) => row.Code.toLowerCase()).filter((code) => code)
    );
    setExistingCodes(codesInRows);
  };

  const handleKeyPress = (e, column) => {
    if (column === "quantity") {
      if (
        !/[0-9.]/.test(e.key) ||
        (e.key === "." && e.target.value.includes("."))
      ) {
        e.preventDefault();
      }
    } else if (inputTypes[column] === "number") {
      if (e.charCode < 48 || e.charCode > 57) {
        e.preventDefault();
      }
    }
  };

  const fetchProductCode = async (rowIndex, code) => {
    const currentDescription = rows[rowIndex]["Description"];
    try {
      const lowerCaseCode = code.toLowerCase();
      const condition = currentDescription
        ? existingCodes.has(lowerCaseCode)
        : existingCodes.has(lowerCaseCode) ||
          existingCodes.has(rows[rowIndex].Code.toLowerCase());

      if (condition) {
        setShowErrorDuplicate(true);
        const updatedRows = rows.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...initialRowsState,
              isExistingProduct: row.isExistingProduct,
            };
          }
          return row;
        });
        setRows(updatedRows);
        return;
      }
      const response = await axios.get(`${presentationsCode}${code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const productData = response.data.data[0];
      console.log("Product data:", productData);
      // Actualiza las filas con los datos del producto
      const updatedRows = rows.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            Code: productData.presentation_code,
            Description: productData.product_name,
            Packsize: productData.presentation_name,
            UOM: productData.uom,
            Price: productData.price,
            "Unit Cost": productData.cost,
            "VAT %": productData.tax,
            //TODO: Si van agregar mas campos, agregarlos aqui
          };
        }
        return row;
      });
      setExistingCodes(
        new Set(
          [...existingCodes]
            .map((code) => code.toLowerCase())
            .concat(lowerCaseCode)
        )
      );
      setRows(updatedRows);
    } catch (error) {
      console.error("Error al hacer la solicitud:", error.message);
      // const currentProductCode = rows[rowIndex]["Code"] || "0"
      setShowErrorCode(true);
      const updatedRows = rows.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            Code: "",
          };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };

  const createOrder = async () => {
    console.log("Checking if I can send order...");
    if (sendingOrder) {
      console.log("I am already sending the past order...");
      return;
    }
    setConfirmCreateOrder(false);
    setSendingOrder(true);
    console.log("I am sending order...");
    try {
      if (!customers) {
        setShowErrorOrderModal(true);
        setOrderError(
          "Please select the customer you want to create the order for."
        );
        return;
      }
      const filteredProducts = rows
        .filter((row) => parseFloat(row.quantity) > 0)
        .map((row) => {
          const product = presentations.find(
            (product) => product.code === row.Code
          );

          return {
            quantity: parseFloat(row.quantity),
            id_presentations: product ? product.id : undefined,
            price: Number(row.Net),
          };
        });

      if (!filteredProducts || filteredProducts.length === 0) {
        setShowErrorOrderModal(true);
        setOrderError("Please choose a product for your order.");
        return;
      }
      const jsonOrderData = {
        accountNumber_customers: customers[0]?.accountNumber,
        address_delivery: customers[0]?.address,
        date_delivery: orderDate,
        id_suppliers: user?.id_supplier,
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
      if (response.data.status !== 200) {
        setShowErrorOrderModal(true);
        setOrderError(
          "Please check that the delivery day is available for this customer and that all products are correct."
        );
        return;
      }
      setSendingOrder(false);
      console.log("Order ended", response.data);
      setShowConfirmModal(true);
      setRows(Array.from({ length: 5 }, () => ({ ...initialRowsState })));
      setSpecialRequirements("");
      setProducts([]);
    } catch (error) {
      setShowErrorOrderModal(true);
    }

    setCustomers(null);
  };

  // BORRAR CASILLAS SI SE BORRA EL CODE
  const handleCodeChange = (e, rowIndex, column) => {
    const newCodeValue = e.target.value.toLowerCase();
    setCurrentValues((prevValues) => ({
      [column]: newCodeValue,
    }));

    if (column === "Code") {
      if (newCodeValue.trim() === "") {
        const currentCode = previousCode[rowIndex];
        synchronizeExistingCodes();

        const updatedRows = rows.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...initialRowsState,
            };
          }
          return row;
        });
        setRows(updatedRows);

        if (existingCodes.has(currentCode)) {
          const updatedExistingCodes = new Set([...existingCodes]);
          updatedExistingCodes.delete(currentCode);
          setExistingCodes(updatedExistingCodes);
        }

        setPreviousCode((prev) => {
          const newPrev = { ...prev };
          delete newPrev[rowIndex];
          return newPrev;
        });
      } else {
        const updatedRows = rows.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...row,
              Code: newCodeValue,
            };
          }
          return row;
        });
        setRows(updatedRows);
      }
    }
  };
  const handleInputFocus = (e, fieldName) => {
    if (fieldName === "quantity") {
      const quantityValue =
        e.target.value.trim() !== "" ? e.target.value.trim() : "0";
      setCurrentValues((prevValues) => ({
        quantity: quantityValue,
      }));
    }
  };
  useEffect(() => {
    if (showErrorDuplicate) {
      setCurrentValues({});
    }
  }, [showErrorDuplicate]);

  return (
    <div className="flex flex-col p-5">
      <div className="overflow-x-auto">
        <form
          ref={form}
          onKeyUp={(event) => onEnterKey(event)}
          className="m-2 whitespace-nowrap"
        >
          <table className="w-full text-sm bg-white rounded-2xl text-center shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr>
                {columns.map((column, index) => {
                  const isVisible = initialColumns.includes(column);
                  // Encuentra el índice de la primera y última columna visible
                  const firstVisibleColumnIndex = columns.findIndex((col) =>
                    initialColumns.includes(col)
                  );
                  const lastVisibleColumnIndex =
                    columns.length -
                    1 -
                    [...columns]
                      .reverse()
                      .findIndex((col) => initialColumns.includes(col));

                  return (
                    isVisible && (
                      <th
                        key={index}
                        scope="col"
                        className={`py-2 px-2 capitalize ${
                          index === firstVisibleColumnIndex
                            ? "rounded-tl-lg"
                            : ""
                        } ${
                          index === lastVisibleColumnIndex
                            ? "rounded-tr-lg"
                            : ""
                        } ${
                          column === "quantity" ||
                          column === "VAT %" ||
                          column === "UOM" ||
                          column === "Net"
                            ? "w-20"
                            : column === "Packsize" || column === "Total Price"
                            ? "w-40"
                            : column === "Code"
                            ? "w-[8em]"
                            : ""
                        }`}
                        onContextMenu={(e) => handleContextMenu(e)}
                      >
                        <p className="text-base text-dark-blue my-2">
                          {column}
                        </p>
                      </th>
                    )
                  );
                })}
              </tr>
            </thead>
            <tbody className="">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* CODIGO DE PRODUCTO */}
                  {columns.map(
                    (column, columnIndex) =>
                      initialColumns.includes(column) && (
                        <React.Fragment key={columnIndex}>
                          <td
                            className={`px-3 py-[0.2em] border-b-[1.5px] border-x-[0.5px] border-x-gray-100`}
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
                              <span onClick={() => setIsSelectDisabled(false)}>
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
                                    menuPlacement="auto"
                                    menuPortalTarget={document.body}
                                    onInputChange={(newValue) => {
                                      const sortedAndFilteredData = sortData(
                                        presentations,
                                        newValue
                                      );
                                      setDescriptionData(sortedAndFilteredData);
                                    }}
                                    options={
                                      DescriptionData
                                        ? DescriptionData.map((item) => ({
                                            value: item.product_name,
                                            label: `${item.code} - ${item.product_name} - ${item.name}`,
                                            code: item.code,
                                          }))
                                        : []
                                    }
                                    value={{
                                      label: row[column] || "",
                                      value: row[column] || "",
                                    }}
                                    onChange={(selectedOption) => {
                                      const selectedProduct =
                                        DescriptionData.find(
                                          (item) =>
                                            item.code === selectedOption.code
                                        );

                                      if (selectedProduct) {
                                        fetchProductCode(
                                          rowIndex,
                                          selectedProduct.code
                                        );
                                      }
                                    }}
                                    isDisabled={
                                      isSelectDisabled || !customerDate
                                    }
                                    onBlur={() => setIsSelectDisabled(true)}
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        border: "none",
                                        boxShadow: "none",
                                        backgroundColor: "transparent",
                                      }),
                                      menu: (provided) => ({
                                        ...provided,
                                        width: "33em",
                                      }),

                                      singleValue: (provided, state) => ({
                                        ...provided,
                                        color: "#04444F",
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
                              <>
                                <input
                                  type={inputTypes[column]}
                                  ref={inputRefs[column][rowIndex]}
                                  data-field-name={column}
                                  className={`pl-2 h-[30px] outline-none w-full ${
                                    inputTypes[column] === "number"
                                      ? "hide-number-arrows"
                                      : ""
                                  } `}
                                  value={row[column] || ""}
                                  onFocus={(e) => {
                                    if (column === "quantity") {
                                      handleInputFocus(e, "quantity");
                                    }
                                  }}
                                  onChange={(e) => {
                                    if (column === "Net") {
                                      let newValue = parseFloat(e.target.value);

                                      newValue = newValue.toFixed(2);
                                    }

                                    setCurrentValues((prevValues) => ({
                                      [column]: e.target.value,
                                    }));
                                    const updatedRows = [...rows];
                                    updatedRows[rowIndex][column] =
                                      e.target.value;
                                    setRows(updatedRows);
                                    handleCodeChange(e, rowIndex, column);
                                  }}
                                  step={0.1}
                                  onKeyDown={(e) => {
                                    handleKeyDown(e, rowIndex, column);
                                  }}
                                  onKeyPress={(e) => {
                                    if (column === "Net" && e.charCode === 46) {
                                      return;
                                    }
                                    if (column === "quantity") {
                                      handleKeyPress(e, column);
                                    }
                                    if (
                                      inputTypes[column] === "number" &&
                                      (e.charCode < 48 || e.charCode > 57)
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                  readOnly={
                                    (column === "Net" && isReadOnly) ||
                                    !customerDate
                                  }
                                  onDoubleClick={() => setIsReadOnly(false)}
                                  onBlur={() => setIsReadOnly(true)}
                                />
                              </>
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
              className="absolute p-2 border rounded bg-white"
              style={{
                top: `${mouseCoords.y}px`,
                left: `${mouseCoords.x}px`,
              }}
            >
              <h4 className="font-bold mb-2">Show/Hide Columns</h4>
              {columns.map((column, columnIndex) => (
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
      {/* <div className="flex justify-center mb-20 w-full mt-5">
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
          onClick={() => setConfirmCreateOrder(true)}
          className="bg-primary-blue py-2 px-4 rounded-lg text-white font-medium mr-2 w-[15%]"
        >
          Send order
        </button> 
      </div>*/}

      <ModalSuccessfull
        isvisible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Congratulations"
        text="Your order has been shipped, thank you for using"
        textGrownet="Grownet"
        button=" Close"
        confirmed={true}
      />

      {confirmCreateOrder && customerDate !== undefined && (
        <ModalSuccessfull
          isvisible={confirmCreateOrder}
          onClose={() => setConfirmCreateOrder(false)}
          title="Confirmation!"
          text="Are you sure about creating this order?"
          textGrownet=""
          button="Confirm"
          sendOrder={createOrder}
        />
      )}

      <ModalOrderError
        isvisible={showErrorOrderModal}
        onClose={() => setShowErrorOrderModal(false)}
        error={orderError}
        title={"Sorry"}
      />
      <ModalOrderError
        isvisible={showErrorCode}
        onClose={() => setShowErrorCode(false)}
        error={orderError}
        title={"Incorrect code"}
        message={
          "The entered code is incorrect. Please verify and try again with a valid code."
        }
      />
      <ModalOrderError
        isvisible={showErrorDuplicate}
        onClose={() => setShowErrorDuplicate(false)}
        error={orderError}
        title={"Duplicate code"}
        message={"The product you are entering is duplicate."}
      />
      <ModalOrderError
        isvisible={showErrorRoutes}
        onClose={() => setShowErrorRoutes(false)}
        title={"Date without routes"}
        message={
          "There are no routes assigned for the selected date. Please change the date to an available day."
        }
      />
    </div>
  );
}
