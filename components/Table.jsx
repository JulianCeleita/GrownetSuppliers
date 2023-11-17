"use client";
import React, { useState } from "react";

export default function Table() {
  const [data, setData] = useState([
    {
      productCode: "P1",
      description: "Product 1",
      quantity: 10,
      net: 100,
      tax: 10,
      total: 110,
    },
    {
      productCode: "P2",
      description: "Product 2",
      quantity: 20,
      net: 200,
      tax: 20,
      total: 220,
    },
    {
      productCode: "P3",
      description: "Product 3",
      quantity: 10,
      net: 100,
      tax: 10,
      total: 110,
    },
    {
      productCode: "P4",
      description: "Product 4",
      quantity: 20,
      net: 200,
      tax: 20,
      total: 220,
    },
    {
      productCode: "P5",
      description: "Product 5",
      quantity: 10,
      net: 100,
      tax: 10,
      total: 110,
    },
  ]);

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
            {data.map((row, index) => (
              <tr key={index}>
                <td
                  className={`w-[16.6%] px-6 py-3  border-r-2 border-r-[#0c547a] border-[#808e94] ${
                    index === 0 ? "border-t-0 " : "border-t-2 "
                  }`}
                >
                  {row.productCode}
                </td>
                <td
                  className={` w-[16.6%]px-6 py-3  border-r-2 border-r-[#0c547a] border-[#808e94] ${
                    index === 0 ? "border-t-0" : "border-t-2"
                  }`}
                >
                  {row.description}
                </td>
                <td
                  className={` w-[16.6%] px-6 py-3  border-[#808e94] border-r-[#0c547a]  border-r-2 ${
                    index === 0 ? "border-t-0" : "border-t-2"
                  }`}
                >
                  {row.quantity}
                </td>
                <td
                  className={`w-[16.6%] px-6 py-3  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                    index === 0 ? "border-t-0" : "border-t-2"
                  }`}
                >
                  {row.net}
                </td>
                <td
                  className={` w-[16.6%] px-6 py-3  border-r-2 border-[#808e94] border-r-[#0c547a] ${
                    index === 0 ? "border-t-0" : "border-t-2"
                  }`}
                >
                  {row.tax}
                </td>
                <td
                  className={`w-[16.6%] px-6 py-3   border-[#808e94] -mt-20 ${
                    index === 0 ? "border-t-0" : "border-t-2"
                  }`}
                >
                  {row.total}
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
