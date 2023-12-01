"use client";
import React, { useRef, useState } from "react";

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

export default function Table() {
  const [rows, setRows] = useState(
    Array.from({ length: 5 }, () => ({ ...initialRowsState }))
  );
  const form = useRef();
  const { onEnterKey } = useFocusOnEnter(form);

  const addNewRow = () => {
    setRows((prevRows) => [...prevRows, { ...initialRowsState }]);
  };

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
      <div className="overflow-x-auto  ">
        <form ref={form} onKeyUp={(event) => onEnterKey(event)} className="m-1">
          <table className="w-full text-sm text-center">
            <thead className="text-white">
              <tr className="text-lg">
                {[
              "Product Code",
              "Presentation",
              "Description",
              "UOM",
              "Qty",
              "Price",
              "Total Price"
            ].map((heading, index) => (
              <th
                key={index}
                scope="col"
                className="py-2 bg-dark-blue rounded-lg"
                style={{
                  boxShadow:
                    "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)"
                }}
              >
                <p className="text-xl text-[#ffffff]">{heading}</p>
              </th>
            ))}
              </tr>
            </thead>
            <tbody className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl ">
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>

                  {/*  *********** CODIGO DE PRODUCTO *********** */}
                  <td
  className={`w-[14.2%] px-6 py-2 border-r-2 border-r-[#0c547a] border-[#808e94] ${
    rowIndex === 0 ? "border-t-0" : "border-t-2"
  }`}
>
  <input
    ref={inputRefs.productCode[rowIndex]}
    value={row.productCode}
    onChange={(e) => {
      const updatedRows = [...rows];
      const newProductCode = e.target.value;

      if (newProductCode.includes("*")) {
        updatedRows[rowIndex].presentation = "Box";
      } else if (newProductCode.includes("/")) {
        updatedRows[rowIndex].presentation = "Weight";
      } else if (newProductCode.includes("+")) {
        updatedRows[rowIndex].presentation = "Each";
      }

      updatedRows[rowIndex].productCode = newProductCode;
      setRows(updatedRows);
    }}
    onKeyDown={(e) => handleKeyDown(e, rowIndex, "productCode")}
    className="w-full outline-none"
    autoFocus={rowIndex === 0}
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
                </tr>
              ))}
            </tbody>
          </table>
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