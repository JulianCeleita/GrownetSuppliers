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
    <div className="flex flex-col p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rounded-lg">
          <thead className="text-xs text-white uppercase bg-blue-700 rounded-b-lg">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 border-2 bg-[#0c547a] rounded-lg"
              >
                ProductCode
              </th>
              <th
                scope="col"
                className="px-6 py-3 border bg-[#0c547a] rounded-lg"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 border bg-[#0c547a] rounded-lg"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 border bg-[#0c547a] rounded-lg"
              >
                Net
              </th>
              <th
                scope="col"
                className="px-6 py-3 border bg-[#0c547a] rounded-lg"
              >
                Tax
              </th>
              <th
                scope="col"
                className="px-6 py-4 border bg-[#0c547a] rounded-lg"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="px-6 py-6 border-2 border-[#808e94]">
                  {row.productCode}
                </td>
                <td className="px-6 py-6 border-2 border-[#808e94]">
                  {row.description}
                </td>
                <td className="px-6 py-6 border-2 border-[#808e94]">
                  {row.quantity}
                </td>
                <td className="px-6 py-6 border-2 border-[#808e94]">
                  {row.net}
                </td>
                <td className="px-6 py-6 border-2 border-[#808e94]">
                  {row.tax}
                </td>
                <td className="px-6 py-6 border-2 border-[#808e94] rounded-xl">
                  {row.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end gap-4 p-4">
        <div>
          <label>Total</label>
          <input className="rounded p-2 border" />
        </div>
        <div>
          <label>Total Im</label>
          <input className="rounded p-2 border" />
        </div>
        <button className="bg-blue-500 text-white rounded px-6 py-2">
          save
        </button>
      </div>
    </div>
  );
}
