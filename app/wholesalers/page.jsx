"use client";
import {
  ExclamationCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import React from "react";
import Layout from "../layoutS";
import { useEffect, useMemo, useState } from "react";
import useTokenStore from "../store/useTokenStore";
import { fetchWholesalerList } from "../api/purchasingRequest";

function Wholesalers() {
  const [wholesalersList, setWholesalerList] = useState([]);
  const { token } = useTokenStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWholesalerList(token, setWholesalerList, setIsLoading);
  }, []);
  console.log(wholesalersList, "hola");
  return (
    <Layout>
      <div className="-mt-16">
        <div className="flex gap-4 mt-2">
          <h1 className="text-2xl text-white font-semibold ml-28 mr-2">
            <span className="text-light-green">Wholesalers </span>list
          </h1>
          <button
            className="flex bg-green -mt-2 py-3 px-4 rounded-full text-white font-medium transition-all hover:bg-dark-blue hover:scale-110"
            // onClick={() => setShowNewCustomers(true)}
          >
            <PlusCircleIcon className="h-6 w-6 mr-1" /> New wholesalers
          </button>
        </div>
        <div className="flex items-center justify-center mb-20 mt-10">
          <table className="w-[95%] bg-white rounded-2xl  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white text-center shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="border-stone-100 border-b-0 text-dark-blue rounded-t-3xl">
                <th
                  className="py-4 rounded-tl-xl cursor-pointer hover:bg-gray-100 transition-all"
                  //onClick={() => requestSort("accountNumber")}
                >
                  Acc Number
                </th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  //onClick={() => requestSort("accountName")}
                >
                  Name
                </th>
                <th className="py-4 ">Telephone</th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  // onClick={() => requestSort("group")}
                >
                  Group
                </th>
                <th className="py-4">Routes</th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  //onClick={() => requestSort("drops")}
                >
                  Drops
                </th>
                <th
                  className="py-4 rounded-tr-xl cursor-pointer hover:bg-gray-100 transition-all"
                  //onClick={() => requestSort("postCode")}
                >
                  Post Code
                </th>
                <th
                  className="py-4 rounded-tr-xl cursor-pointer hover:bg-gray-100 transition-all"
                  //onClick={() => requestSort("last_order_date")}
                >
                  Last Order
                </th>
              </tr>
            </thead>
            {/* <tbody>
              {displayedCustomers.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-dark-blue border-2 border-stone-100 border-t-0"
                  >
                    <p className="flex items-center justify-center text-gray my-10">
                      <ExclamationCircleIcon className="h-12 w-12 mr-10 text-gray" />
                      Results not found. Try a different search!
                    </p>
                  </td>
                </tr>
              ) : (
                displayedCustomers.map((customer, index) => {
                  let matchingRoutes = customer.routes;

                  // Filtro de grupo, si selectedGroup está definido.
                  if (selectedGroup) {
                    matchingRoutes = matchingRoutes.filter((route) =>
                      selectedGroup === "No group"
                        ? !customer.group
                        : customer.group === selectedGroup
                    );
                  }

                  // Filtrar por día y ruta si están seleccionados.
                  if (selectedRoute) {
                    matchingRoutes = matchingRoutes.filter(
                      (route) => route.name === selectedRoute
                    );
                  }

                  if (selectedDay) {
                    matchingRoutes = matchingRoutes.filter(
                      (route) => route.days_id === Number(selectedDay)
                    );
                  }

                  // Eliminar rutas duplicadas y unirlas con una coma y un espacio.
                  const uniqueRouteNames = [
                    ...new Set(matchingRoutes.map((route) => route.name)),
                  ].join(", ");
                  const uniqueDrop =
                    matchingRoutes.length > 0
                      ? [...new Set(matchingRoutes.map((route) => route.drop))]
                      : [];

                  if (
                    matchingRoutes.length > 0 ||
                    (!selectedRoute && !selectedDay)
                  ) {
                    return (
                      <tr
                        key={customer.id}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowEditCustomer(true);
                        }}
                        className="text-dark-blue border-2 border-stone-100 border-t-0 cursor-pointer hover:bg-[#F6F6F6] transition-all"
                      >
                        <td className="py-4 pl-8">{customer.accountNumber}</td>
                        <td className="py-4 pl-8">{customer.accountName}</td>
                        <td className="py-4 pl-8 w-[110px">
                          {customer.telephone}
                        </td>
                        <td className="py-4 pl-8 w-[150px]">
                          {customer.group !== null
                            ? customer.group
                            : "No group"}
                        </td>
                        <td className="py-4 pl-8">
                          {selectedRoute || selectedDay ? (
                            <>{uniqueRouteNames}</>
                          ) : (
                            [
                              ...new Set(
                                customer.routes.map((route) => route.name)
                              ),
                            ].map((name, index, arr) => (
                              <span key={name}>
                                {name}
                                {index < arr.length - 1 && " - "}
                              </span>
                            ))
                          )}
                        </td>
                        <td className="py-4 pl-8">
                          {selectedRoute || selectedDay ? (
                            <>{uniqueDrop}</>
                          ) : (
                            [
                              ...new Set(
                                customer.routes.map((route) => route.drop)
                              ),
                            ].map((name, index, arr) => (
                              <span key={name}>
                                {name}
                                {index < arr.length - 1 && " - "}
                              </span>
                            ))
                          )}
                        </td>
                        <td className="py-4 pl-8 w-[120px]">
                          {customer.postCode}
                        </td>
                        <td className="py-4  w-[120px]">
                          {formatDate(customer.last_order_date)}
                        </td>
                      </tr>
                    );
                  }

                  return null;
                })
              )}
            </tbody> */}
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default Wholesalers;
