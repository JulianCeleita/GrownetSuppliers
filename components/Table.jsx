"use client";
import React, { useRef, useState } from "react";

const initialRowsState = {
  productCode: "",
  description: "",
  quantity: "",
  net: "",
  tax: "",
  total: "",
};

const inputRefs = {
  productCode: [],
  description: [],
  quantity: [],
  net: [],
  tax: [],
  total: [],
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
      "description",
      "quantity",
      "net",
      "tax",
      "total",
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
                <th
                  scope="col"
                  className="py-3 bg-dark-blue rounded-lg"
                  style={{
                    boxShadow:
                      "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p className="text-xl text-[#ffffff]">Product Code</p>
                </th>

                <th
                  scope="col"
                  className=" bg-dark-blue rounded-lg "
                  style={{
                    boxShadow:
                      "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p className="text-xl text-[#ffffff]">Description</p>
                </th>

                <th
                  scope="col"
                  className="  bg-dark-blue  rounded-lg "
                  style={{
                    boxShadow:
                      "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p className="text-xl text-[#ffffff]">Quantity</p>
                </th>
                <th
                  scope="col"
                  className=" bg-dark-blue rounded-lg   "
                  style={{
                    boxShadow:
                      "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p className="text-[#ffffff] text-xl">Net</p>
                </th>
                <th
                  scope="col"
                  className="  bg-dark-blue rounded-lg "
                  style={{
                    boxShadow:
                      "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p className="text-xl text-[#ffffff]">Tax</p>
                </th>

                <th
                  scope="col"
                  className="  bg-dark-blue rounded-lg "
                  style={{
                    boxShadow:
                      "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <p className="text-xl text-[#ffffff]"> Total</p>
                </th>
              </tr>
            </thead>
            <tbody className="shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] rounded-xl ">
              <tr>
                <td className=""></td>
              </tr>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td
                    className={`w-[14.9%] px-6 py-3    border-r-2 border-r-[#0c547a] border-[#808e94] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.productCode[rowIndex]}
                      value={row.productCode}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].productCode = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) =>
                        handleKeyDown(e, rowIndex, "productCode")
                      }
                      className="w-full outline-none"
                      autoFocus={rowIndex === 0}
                    />
                  </td>
                  <td
                    className={` w-[15%] px-6 py-3  border-r-2  border-r-[#0c547a] border-[#808e94] ${
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
                  <td
                    className={` w-[14.8%] px-6 py-3   border-[#808e94] border-r-[#0c547a]  border-r-2 ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.quantity[rowIndex]}
                      value={row.quantity}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].quantity = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "quantity")}
                      className="w-full outline-none"
                    />
                  </td>
                  <td
                    className={`w-[14.8%] px-6 py-3  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.net[rowIndex]}
                      value={row.net}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].net = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "net")}
                      className="w-full outline-none"
                    />
                  </td>
                  <td
                    className={` w-[14.7%] px-6 py-3  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.tax[rowIndex]}
                      value={row.tax}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].tax = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "tax")}
                      className="w-full outline-none"
                    />
                  </td>
                  <td
                    className={`w-[14.8%] px-6 py-3   border-[#808e94] -mt-20 ${
                      rowIndex === 0 ? "border-t-0" : "border-t-2"
                    }`}
                  >
                    <input
                      ref={inputRefs.total[rowIndex]}
                      value={row.total}
                      onChange={(e) => {
                        const updatedRows = [...rows];
                        updatedRows[rowIndex].total = e.target.value;
                        setRows(updatedRows);
                      }}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, "total")}
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
            <button className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-2">
              Send order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
