"use client";
import {
  ExclamationCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import Layout from "../layoutS";
import { useEffect, useMemo, useState } from "react";
import useTokenStore from "../store/useTokenStore";
import { fetchWholesalerList } from "../api/purchasingRequest";
import NewWholesalers from "../components/NewWholesalers";

function Wholesalers() {
  const [wholesalersList, setWholesalerList] = useState([]);
  const { token } = useTokenStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showNewWholesalers, setShowNewWholesalers] = useState(false);

  useEffect(() => {
    fetchWholesalerList(token, setWholesalerList);
  }, []);

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 -mt-24 overflow">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            <span className="text-light-green">Wholesalers </span>list
          </h1>

          <div className="flex gap-4">
            <button
              className="flex bg-green py-3 px-4 rounded-full text-white font-medium transition-all hover:bg-dark-blue hover:scale-110"
              onClick={() => setShowNewWholesalers(true)}
            >
              <PlusCircleIcon className="h-6 w-6 mr-1" /> New wholesalers
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center mb-20 mt-5">
          <table className="w-[95%] bg-white rounded-2xl  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white text-center shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="border-stone-100 border-b-0 text-dark-blue rounded-t-3xl">
                <th className="py-4 rounded-tl-xl cursor-pointer hover:bg-gray-100 transition-all">
                  Account number
                </th>
                <th className="py-4 cursor-pointer hover:bg-gray-100 transition-all">
                  Name
                </th>
                <th className="py-4 cursor-pointer hover:bg-gray-100 transition-all">
                  Prefix
                </th>
                <th className="py-4 cursor-pointer hover:bg-gray-100 transition-all">
                  Contact
                </th>
                <th className="py-4">Phone</th>

                <th className="py-4 rounded-tr-xl cursor-pointer hover:bg-gray-100 transition-all">
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {wholesalersList.map((wholesaler) => (
                <tr
                  key={wholesaler.id}
                  className="text-dark-blue  border-b-2 border-stone-100"
                >
                  <td className="py-4 pl-4">{wholesaler.account_number}</td>
                  <td className="py-4">{wholesaler.name}</td>
                  <td className="py-4">{wholesaler.prefix}Test</td>
                  <td className="py-4">{wholesaler.contact}</td>
                  <td className="py-4">{wholesaler.phone}</td>
                  <td className="py-4 pl-4">
                    <div>
                      {wholesaler.email.split(";").map((email, index) => (
                        <div key={index} className="whitespace-pre-wrap">
                          {email}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <NewWholesalers
        isvisible={showNewWholesalers}
        onClose={() => setShowNewWholesalers(false)}
        setWholesalerList={setWholesalerList}
      />
    </Layout>
  );
}

export default Wholesalers;
