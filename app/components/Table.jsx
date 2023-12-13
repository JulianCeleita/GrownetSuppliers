"use client";
import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { presentationsCode, productsUrl } from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import { useTableStore } from "@/app/store/useTableStore";

const initialRowsState = {
  "Product Code": "",
  Description: "",
  Packsize: "",
  UOM: "",
  Qty: "",
  Price: "",
  "Total Price": "",
  "Unit Cost": "",
  Profit: "",
  "Price Band": "",
  "Total Cost": "",
  Tax: "",
  "Taxt Calculation": "",
};

const inputRefs = {
  "Product Code": [],
  Description: [],
  Packsize: [],
  UOM: [],
  Qty: [],
  Price: [],
  "Total Price": [],
  "Unit Cost": [],
  Profit: [],
  "Price Band": [],
  "Total Cost": [],
  Tax: [],
  "Taxt Calculation": [],
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

const AutocompleteInput = ({ options, value, onChange }) => {
  return (
    <Select
      options={options}
      value={options.find((option) => option.value === value)}
      onChange={(selectedOption) => onChange(selectedOption.value)}
      isSearchable
    />
  );
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
  const lastActiveColumn = initialColumns[initialColumns.length - 1];

  const columns = [
    "Product Code",
    "Description",
    "Packsize",
    "UOM",
    "Qty",
    "Price",
    "Total Price",
    "Unit Cost",
    "Profit",
    "Price Band",
    "Total Cost",
    "Tax",
    "Taxt Calculation",
  ];
  const inputTypes = {
    "Product Code": "text",
    Description: "text",
    Packsize: "text",
    UOM: "text",
    Qty: "number",
    Price: "number",
    "Total Price": "number",
    "Unit Cost": "number",
    Profit: "number",
    "Price Band": "text",
    "Total Cost": "number",
    Tax: "number",
    "Taxt Calculation": "text",
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
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (productByCode) {
      const updatedRows = rows.map((row, index) => {
        if (row["Product Code"] === currentValues["Product Code"]) {
          return {
            ...row,

            "Product Code": productByCode.product_code,
            Presentation: productByCode.presentation_name,
            Description: "",
            UOM: productByCode.uom,
            Qty: "",
            "Unit Cost": productByCode.cost,
            Tax: productByCode.tax,
            Price: productByCode.price,
            "Total Price": "",
            Profit: "",
            "Price Band": "",
            "Total Cost": "",

            "Taxt Calculation": "",
          };
        }
        return row;
      });
      setRows(updatedRows);
    }
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
        fieldName === "Product Code" &&
        currentValues["Product Code"].trim() !== ""
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
      // Obtener el valor del input de "Product Code" desde currentValues
      const currentProductCode = currentValues["Product Code"];
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

  return (
    <div className="flex flex-col p-8">
      <div className="overflow-x-auto">
        <form ref={form} onKeyUp={(event) => onEnterKey(event)} className="m-1">
          <table className="w-full text-sm text-center">
            <thead className="text-white">
              <tr className="text-lg">
                {columns.map(
                  (column, index) =>
                    initialColumns.includes(column) && (
                      <th
                        key={index}
                        scope="col"
                        className="py-2 bg-dark-blue rounded-lg"
                        onContextMenu={(e) => handleContextMenu(e)}
                        style={{
                          boxShadow:
                            "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <p className="text-xl text-white">{column}</p>
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
                            className={`w-[14.2%] px-6 py-2 border-r-2 border-r-[#0c547a] border-[#808e94] ${
                              rowIndex === 0 ? "border-t-0" : "border-t-2"
                            }`}
                            tabIndex={0}
                          >
                            {/* {column !== "Product Code" &&
                            column !== "Packsize" ? ( */}
                            <input
                              type={inputTypes[column]}
                              ref={inputRefs[column][rowIndex]}
                              className="pl-2 h-[30px] outline-none"
                              value={row[column]}
                              onChange={(e) => {
                                setCurrentValues((prevValues) => ({
                                  ...prevValues,
                                  [column]: e.target.value,
                                }));
                                const updatedRows = [...rows];
                                updatedRows[rowIndex][column] = e.target.value;
                                setRows(updatedRows);
                              }}
                              onKeyDown={(e) =>
                                handleKeyDown(e, rowIndex, column)
                              }
                            />
                            {/* ) : ( */}
                            {/* <AutocompleteInput
                                options={products}
                                value={row.productCode}
                                onChange={(selectedProductCode) => {
                                  const updatedRows = [...rows];
                                  const selectedProduct = products.find(
                                    (product) =>
                                      product.value === selectedProductCode
                                  );

                                  if (selectedProduct) {
                                    updatedRows[rowIndex].presentation =
                                      selectedProduct.label;
                                    updatedRows[rowIndex].productCode =
                                      selectedProductCode;
                                    setRows(updatedRows);
                                  }
                                }}
                              // /> */}
                            {/* )} */}
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
                <div key={column} className="flex items-center">
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
                <div key={index} className=" flex items-center mt-2">
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
