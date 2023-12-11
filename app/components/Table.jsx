'use client';
import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { productsUrl } from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import { useTableStore } from "@/app/store/useTableStore";

const initialRowsState = {
  productCode: "",
  presentation: "",
  description: "",
  UOM: "",
  Qty: "",
  price: "",
  totalPrice: "",
};

const inputRefs = {
  productCode: [],
  presentation: [],
  description: [],
  UOM: [],
  Qty: [],
  price: [],
  totalPrice: [],
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
  const { initialColumns, toggleColumnVisibility } = useTableStore();
  const [showCheckboxColumn, setShowCheckboxColumn] = useState(false)
  const menuRef = useRef(null);
  const data = [
    { 'Product Code': 'Dato1', Presentation: 'Dato2', Description: 'Dato3', UOM: 'Dato4', Qty: 'Dato5', Price: 'Dato6', 'Total Price': 'Dato7', 'Unit Cost': 'Dato8', Profit: 'Dato9', 'Price Band': 'Dato10', 'Total Cost': 'Dato11', Tax: 'Dato12', 'Text Calculation': 'Dato13' },
    { 'Product Code': 'Dato1', Presentation: 'Dato2', Description: 'Dato3', UOM: 'Dato4', Qty: 'Dato5', Price: 'Dato6', 'Total Price': 'Dato7', 'Unit Cost': 'Dato8', Profit: 'Dato9', 'Price Band': 'Dato10', 'Total Cost': 'Dato11', Tax: 'Dato12', 'Text Calculation': 'Dato13' },
    { 'Product Code': 'Dato1', Presentation: 'Dato2', Description: 'Dato3', UOM: 'Dato4', Qty: 'Dato5', Price: 'Dato6', 'Total Price': 'Dato7', 'Unit Cost': 'Dato8', Profit: 'Dato9', 'Price Band': 'Dato10', 'Total Cost': 'Dato11', Tax: 'Dato12', 'Text Calculation': 'Dato13' },
    { 'Product Code': 'Dato1', Presentation: 'Dato2', Description: 'Dato3', UOM: 'Dato4', Qty: 'Dato5', Price: 'Dato6', 'Total Price': 'Dato7', 'Unit Cost': 'Dato8', Profit: 'Dato9', 'Price Band': 'Dato10', 'Total Cost': 'Dato11', Tax: 'Dato12', 'Text Calculation': 'Dato13' },
  ];
  const columns = ['Product Code', 'Presentation', 'Description', 'UOM', 'Qty', 'Price', 'Total Price', 'Unit Cost', 'Profit', 'Price Band', 'Total Cost', 'Tax', 'Text Calculation'];


  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowCheckboxColumn(!showCheckboxColumn)
  };

  const handleCheckboxChange = (columnName) => {
    toggleColumnVisibility(columnName);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowCheckboxColumn(false)
    }
  };
  console.log('initialColumns:', initialColumns)
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get(productsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(
          response.data.products.map((product) => ({
            value: product.code,
            label: product.code,
          }))
        );
        console.log("Productos:", response.data.products);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AGREGAR NUEVA FILA
  const addNewRow = () => {
    setRows((prevRows) => [...prevRows, { ...initialRowsState }]);
  };

  // OBTENER NOMBRE DEL CAMPO SIGUIENTE
  const getNextFieldName = (currentFieldName) => {
    const fieldNames = [
      "productCode",
      "presentation",
      "description",
      "UOM",
      "Qty",
      "price",
      "totalPrice",
    ];
    const currentIndex = fieldNames.indexOf(currentFieldName);
    const nextIndex = currentIndex + 1;

    return nextIndex < fieldNames.length ? fieldNames[nextIndex] : null;
  };


  // FUNCIONALIDAD TECLA ENTER
  const handleKeyDown = (e, rowIndex, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const nextFieldName = getNextFieldName(fieldName);

      if (nextFieldName) {
        const nextFieldRefs = inputRefs[nextFieldName];
        if (nextFieldRefs && nextFieldRefs[rowIndex]) {
          nextFieldRefs[rowIndex].current.focus();
        }
      } else {
        const newRowIndex = rowIndex + 1;

        if (newRowIndex === rows.length) {
          addNewRow();

          setTimeout(() => {
            inputRefs.productCode[newRowIndex]?.current.focus();
          }, 0);
        } else {
          const currentFieldIndex = Object.keys(inputRefs).indexOf(fieldName);
          const fieldNames = Object.keys(inputRefs);
          const nextFieldInSameRow = fieldNames[currentFieldIndex + 1];

          if (nextFieldInSameRow) {
            const nextFieldRefs = inputRefs[nextFieldInSameRow];
            if (nextFieldRefs && nextFieldRefs[rowIndex]) {
              nextFieldRefs[rowIndex].current.focus();
            }
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col p-8">
      <div className="overflow-x-auto">
        <form ref={form} onKeyUp={(event) => onEnterKey(event)} className="m-1">
          <table className="w-full text-sm text-center">
            <thead className="text-white">
              <tr className="text-lg">
                {columns.map((column, index) => 
                initialColumns.includes(column) &&(
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
                    <p className="text-xl text-[#ffffff]">{column}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl">
              
            {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(
                (column) =>
                  initialColumns.includes(column) && (
                    <td className={`px-2 py-2 border-r-2 border-r-[#0c547a] border-[#808e94] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                    key={column}>{row[column]}</td>
                  )
              )}
            </tr>
          ))}
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {/* CODIGO DE PRODUCTO */}
                  {columns.map(
                    (column, columnIndex) =>
                    initialColumns.includes((column, columnIndex) && (
                    <>
                  <td className={` w-[14.2%] px-6 py-2  border-r-2  border-r-[#0c547a] border-[#808e94] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                    key={columnIndex}>
                      {row[column]}
                      </td>

                  <td
                    className={`w-[14.2%] px-6 py-2 border-r-2 border-r-[#0c547a] border-[#808e94] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <AutocompleteInput
                      options={products}
                      value={row.productCode}
                      onChange={(selectedProductCode) => {
                        const updatedRows = [...rows];
                        const selectedProduct = products.find(
                          (product) => product.value === selectedProductCode
                        );

                        if (selectedProduct) {
                          updatedRows[rowIndex].presentation =
                            selectedProduct.label;
                          updatedRows[rowIndex].productCode =
                            selectedProductCode;
                          setRows(updatedRows);
                        }
                      }}
                    />
                  </td>

                  {/*  *********** PRESENTACION *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2  border-r-2  border-r-[#0c547a] border-[#808e94] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.presentation[rowIndex]}
                      value={row.presentation}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].presentation = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, "presentation")
                      }
                      className="w-full outline-none"
                    />
                  </td>


                  {/*  *********** DESCRIPCION *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2   border-[#808e94] border-r-[#0c547a]  border-r-2 ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.description[rowIndex]}
                      value={row.description}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].description = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, "description")
                      }
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** UOM *********** */}
                  <td
                    className={`w-[14.2%] px-6 py-2  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.UOM[rowIndex]}
                      value={row.UOM}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].UOM = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "UOM")}
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** CANTIDAD *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.Qty[rowIndex]}
                      value={row.Qty}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].Qty = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "Qty")}
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** PRECIO *********** */}
                  <td
                    className={` w-[14.2%] px-6 py-2  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.price[rowIndex]}
                      value={row.price}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].price = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "price")}
                      className="w-full outline-none"
                    />
                  </td>

                  {/*  *********** PRECIO TOTAL *********** */}
                  <td
                    className={`w-[14.2%] px-6 py-2   border-[#808e94]  ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.totalPrice[rowIndex]}
                      value={row.totalPrice}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].totalPrice = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, "totalPrice")
                      }
                      className="w-full outline-none"
                    />
                  </td>
                  </>
                  ))
                  )}
                  
                  </tr>
              ))}
            </tbody>
          </table>
          {showCheckboxColumn === true && (
        <div ref={menuRef} className="absolute bg-white p-2 border rounded">
          <h4 className="font-bold mb-2">Mostrar/Ocultar Columnas</h4>
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
          <button className="mt-2" onClick={()=>setShowCheckboxColumn(false)}>
            Cerrar
          </button>
        </div>
      )}
        </form>
      </div>
      <div className="w-ful flex justify-end items-center mb-60">
        <div className=" flex-col w-auto  gap-4 p-5 mt-10 bg-[#ffffff] rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <div className=" flex items-center mt-2 ">
            <label className="text-xl text-[#04444F] font-semibold mr-5 w-[90px]">
              Total:
            </label>
            <input className="border p-2 rounded-md mr-2 w-[200px]" />
          </div>
          <div className="flex items-center mt-5 ">
            <label className="text-xl text-[#04444F] font-semibold mr-5 w-[90px]">
              Total Im:
            </label>
            <input className="border p-2 rounded-md w-[200px]" />
          </div>
          <div className="w-full flex justify-end mt-5">
            <button className="bg-primary-blue py-2 px-4 rounded-lg text-white font-medium mr-2">
              Send order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
