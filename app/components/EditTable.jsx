"use client";
import {
  editStorageOrder,
  orderDetail,
  presentationData,
  presentationsCode,
} from "@/app/config/urls.config";
import { useTableStore } from "@/app/store/useTableStore";
import useTokenStore from "@/app/store/useTokenStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { fetchPresentationsSupplier } from "../api/presentationsRequest";
import useUserStore from "../store/useUserStore";
import ModalOrderError from "./ModalOrderError";
import ModalSuccessfull from "./ModalSuccessfull";

export const fetchOrderDetail = async (
  token,
  setOrderDetail,
  setIsLoading,
  orderId
) => {
  setIsLoading(true);
  try {
    const response = await axios.get(`${orderDetail}${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const newOrderDetail = Array.isArray(response.data.order)
      ? response.data.order
      : [];
    setOrderDetail(response.data.order);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener el detalle:", error);
  }
};

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

export default function EditTable({
  orderId,
  dateDelivery,
  confirmCreateOrder,
  setConfirmCreateOrder,
  specialRequirements,
  setSpecialRequirements,
  percentageDetail,
  dataLoaded,
}) {
  // const [rows, setRows] = useState(
  //   Array.from({ length: 0 }, () => ({ ...initialRowsState }))
  // );

  const [rows, setRows] = useState([
    { ...initialRowsState, isExistingProduct: false },
  ]);

  const form = useRef();
  const { onEnterKey } = useFocusOnEnter(form);
  const { token, setToken } = useTokenStore();
  const [products, setProducts] = useState([]);
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const {
    initialColumns,
    toggleColumnVisibility,
    setTotalNetSum,
    setTotalPriceSum,
    setTotalTaxSum,
    setTotalCostSum,
    setTotalProfit,
    setTotalProfitPercentage,
    orderDetail,
    setOrderDetail,
  } = useTableStore();

  const menuRef = useRef(null);
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false);
  const [currentValues, setCurrentValues] = useState({});
  const [productByCode, setProductByCode] = useState({});
  const [DescriptionData, setDescriptionData] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showErrorOrderModal, setShowErrorOrderModal] = useState(false);
  const [showErrorCode, setShowErrorCode] = useState(false);

  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [orderError, setOrderError] = useState("");
  const [isSelectDisabled, setIsSelectDisabled] = useState(true);
  const isEditable = orderDetail?.state_name === "Preparing";

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
    console.log("🚀 ~ sortData ~ data:", data);
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

  useEffect(() => {
    fetchPresentationsSupplier(
      token,
      user,
      setPresentations,
      setIsLoading(false)
    );
    fetchOrderDetail(token, setOrderDetail, setIsLoading, orderId);
  }, [orderId, token, setOrderDetail]);

  useEffect(() => {
    if (
      dataLoaded &&
      orderDetail &&
      orderDetail.products &&
      orderDetail.products.length > 0
    ) {
      const initialRows = orderDetail.products.map((product) => {
        const quantity = !product.state_definitive
          ? product.quantity
          : product.state_definitive
            ? product.quantity_definitive
            : product.state_definitive === "N/A"
              ? product.quantity_definitive
              : "";

        return {
          state: product.state_definitive,
          isExistingProduct: true,
          Code: product.presentations_code,
          Description: product.name,
          Packsize: product.presentation_name,
          UOM: product.uom,
          quantity: quantity?.toString(),
          price: product.price + product.price * product.tax,
          Net: (product.price || 0).toFixed(2),
          "Total Net": "",
          "VAT %": product.tax,
          "VAT £": "",
          "Total Price": "",
          "Unit Cost": product.cost,
          Profit: "",
          "Price Band": "",
          "Total Cost": "",
        };
      });

      if (percentageDetail == 0) {
        setRows([
          ...initialRows.map((row) => ({ ...row, isExistingProduct: true })),
          { ...initialRowsState, isExistingProduct: false },
        ]);
      } else {
        setRows(initialRows);
      }
      setSpecialRequirements(orderDetail.observation);
    }
  }, [orderDetail, percentageDetail, dataLoaded]);

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
            concatenatedName: `${item.code} - ${item.productName} - ${item.presentationName}`,
            product_name: item.productName,
            name: item.presentationName,
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
    orderDetail.products?.push(productByCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productByCode]);

  // AGREGAR NUEVA FILA
  const addNewRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      { ...initialRowsState, isExistingProduct: false }, // Aquí se agrega la nueva fila sin marcar como existente
    ]);
  };
  // OBTENER NOMBRE DEL CAMPO SIGUIENTE
  // const getNextFieldName = (currentFieldName, rowIndex) => {
  //   const currentIndex = initialColumns.indexOf(currentFieldName);

  //   if (currentIndex !== -1) {
  //     const nextIndex = currentIndex + 1;
  //     if (nextIndex < initialColumns.length) {
  //       return initialColumns[nextIndex];
  //     } else {
  //       return rowIndex === rows.length - 1 ? null : initialColumns[0];
  //     }
  //   }

  //   return null;
  // };

  // FUNCIONALIDAD TECLA ENTER

  const handleKeyDown = (e, rowIndex, fieldName) => {
    if (e.key === "Enter" && e.target.tagName.toLowerCase() !== "textarea") {
      e.preventDefault();

      let productCode = "";

      if (fieldName === "Code" && currentValues["Code"]?.trim() !== "") {
        productCode = currentValues["Code"];
      } else if (
        fieldName === "Description" &&
        currentValues["Description"].trim() !== ""
      ) {
        const selectedProduct = DescriptionData.find(
          (item) => item.productName === currentValues["Description"]
        );
        productCode = selectedProduct ? selectedProduct.code : "";
      }

      if (productCode) {
        fetchProductCode(rowIndex, productCode);
      }

      const nextRowIndex = rowIndex + 1;
      if (nextRowIndex < rows.length) {
        form.current[nextRowIndex].querySelector('input[type="text"]')?.focus();
      } else {
        addNewRow();
      }
    }
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
      const currentProductCode = rows[rowIndex]["Code"] || "0";
      console.log(
        "🚀 ~ fetchProductCode ~ currentProductCode:",
        currentProductCode
      );
      if (currentProductCode != 0) {
        setShowErrorCode(true);
      }
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

  const editOrder = async () => {
    setConfirmCreateOrder(false);
    try {
      const filteredProducts = rows
        .filter((row) => parseFloat(row.quantity) > 0)
        .map((row) => {
          const product = orderDetail.products.find(
            (product) =>
              product.presentations_code === row.Code ||
              product.presentation_code === row.Code
          );

          return {
            quantity: parseFloat(row.quantity),
            id_presentations: product ? product.id_presentations : undefined,
            price: Number(row.Net),
          };
        });
      if (!filteredProducts || filteredProducts.length === 0) {
        setShowErrorOrderModal(true);
        setOrderError("You must leave at least one product in the order.");
        return;
      }

      const jsonOrderData = {
        date_delivery: dateDelivery,
        id_suppliers: orderDetail.id_suppliers,
        net: parseFloat(totalNetSum),
        observation: specialRequirements,
        total: parseFloat(totalPriceSum),
        total_tax: parseFloat(totalTaxSum),
        products: filteredProducts,
      };
      const response = await axios.post(
        `${editStorageOrder}${orderDetail.reference}`,
        jsonOrderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSpecialRequirements("");
      setShowConfirmModal(true);
      setTimeout(() => {
        router.push("/");
      }, 1000);
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

    // Si la columna es "Code" y el nuevo valor está en blanco, elimina completamente la fila
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
      {isLoading ? (
        <div className="flex justify-center items-center mt-24">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <form
              ref={form}
              onKeyUp={(event) => onEnterKey(event)}
              className="m-1 whitespace-nowrap"
            >
              <table className="w-full text-sm text-center table-auto">
                <thead className="text-white">
                  <tr>
                    {columns.map((column, index) => {
                      const isColumnVisible = initialColumns.includes(column);
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
                        isColumnVisible && (
                          <th
                            key={index}
                            scope="col"
                            className={`py-3 px-2 bg-white capitalize ${index === firstVisibleColumnIndex
                              ? "rounded-tl-lg"
                              : ""
                              } ${index === lastVisibleColumnIndex
                                ? "rounded-tr-lg"
                                : ""
                              } ${column === "quantity" ||
                                column === "VAT %" ||
                                column === "UOM" ||
                                column === "Net"
                                ? "w-20"
                                : column === "Packsize" ||
                                  column === "Total Price"
                                  ? "w-40"
                                  : column === "Code"
                                    ? "w-[8em]"
                                    : ""
                              }`}
                            onContextMenu={(e) => handleContextMenu(e)}
                          >
                            <p className="text-lg text-dark-blue">{column}</p>
                          </th>
                        )
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="border border-1 bg-white">
                  {rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={`${row.state === "N/A"
                        ? " line-through text-primary-blue decoration-dark-blue"
                        : ""
                        }`}
                    >
                      {/* CODIGO DE PRODUCTO */}
                      {columns.map(
                        (column, columnIndex) =>
                          initialColumns.includes(column) && (
                            <React.Fragment key={columnIndex}>
                              <td
                                className={`px-3 py-[0.2em] border border-1 border-x-0 `}
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
                                  <span
                                    onClick={() => setIsSelectDisabled(false)}
                                  >
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
                                    {column === "Profit" &&
                                      calculateProfit(row)}
                                    {column === "Price Band" && row[column]}
                                    {column === "Total Cost" &&
                                      calculateTotalCost(row)}
                                    {column === "Description" && (
                                      <Select
                                        className="w-full"
                                        menuPortalTarget={document.body}
                                        menuPlacement="auto"
                                        onInputChange={(newValue) => {
                                          const sortedAndFilteredData =
                                            sortData(presentations, newValue);
                                          setDescriptionData(
                                            sortedAndFilteredData
                                          );
                                        }}
                                        options={
                                          DescriptionData
                                            ? DescriptionData.map((item) => ({
                                              value: item.productName,
                                              label: `${(item.code && item.product_name && item.name) ? `${item.code} - ${item.product_name} - ${item.name}` : "Loading..."}`,
                                              code: item.code,
                                            }))
                                            : []
                                        }
                                        value={{
                                          label: row[column] || "",
                                          value: row[column] || "",
                                        }}
                                        onChange={(selectedDescription, e) => {
                                          console.log(DescriptionData);
                                          setCurrentValues((prevValues) => ({
                                            // ...prevValues,
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
                                        styles={{
                                          control: (provided) => ({
                                            ...provided,
                                            border: "none",
                                            boxShadow: "none",
                                            backgroundColor: isEditable
                                              ? "white"
                                              : "",
                                          }),
                                          menu: (provided) => ({
                                            ...provided,
                                            width: "33em",
                                          }),
                                          singleValue: (provided, state) => ({
                                            ...provided,
                                            color:
                                              row.state === "N/A"
                                                ? "#026CD2"
                                                : "#04444F",
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
                                        isDisabled={isSelectDisabled}
                                        onBlur={() => setIsSelectDisabled(true)}
                                      />
                                    )}
                                  </span>
                                ) : (
                                  <input
                                    type={inputTypes[column]}
                                    ref={inputRefs[column][rowIndex]}
                                    data-field-name={column}
                                    disabled={
                                      row.isExistingProduct && isEditable
                                    }
                                    className={`pl-2 h-[30px] outline-none w-full ${inputTypes[column] === "number"
                                      ? "hide-number-arrows"
                                      : ""
                                      } ${row.state === "N/A"
                                        ? " line-through text-primary-blue decoration-black"
                                        : ""
                                      }`}
                                    value={row[column] || ""}
                                    onChange={(e) => {
                                      if (column === "Net") {
                                        let newValue = parseFloat(
                                          e.target.value
                                        );

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
                                      if (
                                        column === "Net" &&
                                        e.charCode === 46
                                      ) {
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
                                    readOnly={column === "Net" && isReadOnly}
                                    onDoubleClick={() => setIsReadOnly(false)}
                                    onBlur={() => setIsReadOnly(true)}
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
          {/*  <div className="flex justify-center mb-20 w-full mt-5">
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
              Save changes
            </button> 
          </div>*/}
        </>
      )}
      <ModalSuccessfull
        isvisible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Congratulations"
        text="Your request has been edited, thank you for using"
        textGrownet="Grownet"
        button=" Close"
        confirmed={true}
      />
      {confirmCreateOrder && (
        <ModalSuccessfull
          isvisible={confirmCreateOrder}
          onClose={() => setConfirmCreateOrder(false)}
          title="Confirmation!"
          text="Are you sure to edit this order?"
          textGrownet=""
          button="Confirm"
          sendOrder={editOrder}
        />
      )}

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
        isvisible={showErrorOrderModal}
        onClose={() => setShowErrorOrderModal(false)}
        error={orderError}
      />
    </div>
  );
}
