"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/*const totalRefs = useMemo(() => {
  return Array.from({ length: 5 }, () => useRef(null));
}, []);*/

export default function Table() {
  const [rows, setRows] = useState(
    Array.from({ length: 5 }, () => ({
      productCode: "",
      description: "",
      quantity: "",
      net: "",
      tax: "",
      total: "",
    }))
  );

  const inputRefs = {
    productCode: Array.from({ length: rows.length }, () => useRef(null)),
    description: Array.from({ length: rows.length }, () => useRef(null)),
    quantity: Array.from({ length: rows.length }, () => useRef(null)),
    net: Array.from({ length: rows.length }, () => useRef(null)),
    tax: Array.from({ length: rows.length }, () => useRef(null)),
    total: Array.from({ length: rows.length }, () => useRef(null)),
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
          setRows((prevRows) => [
            ...prevRows,
            {
              productCode: "",
              description: "",
              quantity: "",
              net: "",
              tax: "",
              total: "",
            },
          ]);

          setTimeout(() => {
            inputRefs.productCode[newRowIndex].current.focus();
          });
        } else {
          if (inputRefs.productCode[newRowIndex]) {
            inputRefs.productCode[newRowIndex].current.focus();
          }
        }
      }
    }
  };
  useEffect(() => {
    inputRefs.productCode[0].current.focus();
  }, []);

  return (
    <div className="flex flex-col p-16 relative">
      <div className="overflow-x-auto ">
        <table className="w-full text-sm text-center  bg-white rounded-2xl table-auto  ">
          <thead className=" text-white  ">
            <tr className="text-lg  ">
              <th
                scope="col"
                className="px-6 py-3 bg-dark-blue rounded-lg w-[14.9%]  absolute -mt-7 flex items-center 2xl:"
                style={{
                  boxShadow:
                    "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <p className="text-xl text-[#ffffff]">Product Code</p>
              </th>

              <th
                scope="col"
                className="px-6 py-3 bg-dark-blue rounded-lg w-[15%]  absolute -mt-7 ml-[15.2%] flex items-center justify-center 2xl:ml-[15.7%]"
                style={{
                  boxShadow:
                    "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <p className="text-xl text-[#ffffff]">Description</p>
              </th>

              <th
                scope="col"
                className="px-6 py-3  bg-dark-blue  rounded-lg w-[14.8%]  absolute -mt-7 ml-[30.5%] flex items-center justify-center 2xl:ml-[31.3%]"
                style={{
                  boxShadow:
                    "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <p className="text-xl text-[#ffffff]">Quantity</p>
              </th>
              <th
                scope="col"
                className="px-6 py-3  bg-dark-blue rounded-lg w-[14.8%]  absolute -mt-7 ml-[45.6%] flex items-center justify-center 2xl:ml-[46.5%]"
                style={{
                  boxShadow:
                    "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <p className="text-[#ffffff] text-xl">Net</p>
              </th>
              <th
                scope="col"
                className="px-6 py-3  bg-dark-blue rounded-lg w-[14.7%]  absolute -mt-7  ml-[60.7%] flex items-center justify-center 2xl:ml-[62%]"
                style={{
                  boxShadow:
                    "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <p className="text-xl text-[#ffffff]">Tax</p>
              </th>

              <th
                scope="col"
                className="px-6 py-3  bg-dark-blue rounded-lg w-[14.8%]  absolute -mt-7 ml-[75.7%] flex items-center justify-center 2xl:ml-[77.5%]"
                style={{
                  boxShadow:
                    "0px 5px 5px rgba(0, 0, 0, 0.5), 0px 0px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <p className="text-xl text-[#ffffff]"> Total</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="h-[25px]"></td>
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
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "productCode")}
                    className="w-full outline-none"
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
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, "description")}
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
      </div>
      <div className="w-ful flex justify-end   items-center">
        <div className=" flex-col w-[30%]  gap-4 p-4 mt-10 bg-[#ffffff] rounded-2xl">
          <div className="flex justify-end items-center mt-2 mr-8">
            <label className="text-xl text-[#04444F] font-bold mr-5">
              Total
            </label>
            <input
              className="rounded-xl h-7 p-2 border w-[50%] border-[#85FE9D]  "
              style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.8)" }}
            />
          </div>
          <div className="flex justify-end items-center mt-6 mr-8">
            <label className="text-xl text-[#04444F] font-bold mr-5">
              Total Im
            </label>
            <input
              className="rounded-xl p-2 h-7 border w-[50%] border-[#85FE9D] "
              style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.8)" }}
            />
          </div>
          <div className="w-full flex justify-end ">
            <button className=" w-[80px] bg-primary-blue text-white rounded-2xl px-6 py-2 mt-5  mr-8">
              save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
