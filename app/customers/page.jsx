"use client";
import {
  ExclamationCircleIcon,
  PlusCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ModalDelete from "../components/ModalDelete";
import { deleteCustomer } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import {
  fetchCustomers,
  fetchCustomersSupplier,
  fetchRoutes,
} from "../api/customerRequest";
import NewCustomer from "../components/NewCustomer";
import CustomerDetailPage from "../customer/[customerId]/page";
import Editcustomer from "../components/EditCustomer";
import Select from "react-select";
import React, { useRef } from "react";

const CustomersView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [status, setStatus] = useState("all");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const { user } = useUserStore();
  const [showNewCustomers, setShowNewCustomers] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [updateCustomers, setUpdateCustomers] = useState(false);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    if (user && user?.rol_name === "AdminGrownet") {
      fetchCustomers(token, user, setCustomers, setIsLoading);
    } else {
      fetchCustomersSupplier(token, user, setCustomers, setIsLoading);
    }
    fetchRoutes(token, user, setRoutes, setIsLoading);
  }, [user, token, updateCustomers]);

  useEffect(() => {
    const routesMatchingSearchTerm = routes.filter((route) =>
      route.name.includes(searchTerm)
    );

    setFilteredRoutes(routesMatchingSearchTerm);
  }, [searchTerm, routes, updateCustomers]);

  useEffect(() => {
    let filteredBySearchTerm = customers.filter(
      (customer) =>
        customer.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    let filteredByGroup = filteredBySearchTerm.filter(
      (customer) =>
        !selectedGroup ||
        (selectedGroup === "No group" && !customer.group) ||
        customer.group === selectedGroup
    );

    let filteredByRoute = filteredByGroup.filter(
      (customer) =>
        !selectedRoute ||
        customer.routes.some((route) => route.name === selectedRoute)
    );

    let filteredByDay = filteredByRoute.filter(
      (customer) =>
        !selectedDay ||
        customer.routes.some((route) => route.days_id === Number(selectedDay))
    );

    const getDropForDay = (customer, dayId) => {
      const routeForDay = customer.routes.find(
        (route) => Number(route.days_id) === Number(dayId)
      );
      return routeForDay ? routeForDay.drop : 0;
    };

    filteredByDay.sort((a, b) => {
      if (sortConfig.key === "last_order_date") {
        const dateA = new Date(a.last_order_date);
        const dateB = new Date(b.last_order_date);
        if (sortConfig.direction === "ascending") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else if (sortConfig.key === "drops" && selectedDay) {
        const dropA = getDropForDay(a, selectedDay);
        const dropB = getDropForDay(b, selectedDay);

        const numDropA = Number(dropA);
        const numDropB = Number(dropB);

        if (sortConfig.direction === "ascending") {
          return numDropA - numDropB;
        } else {
          return numDropB - numDropA;
        }
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      }
    });

    setDisplayedCustomers(filteredByDay);
  }, [customers, sortConfig, searchTerm, selectedGroup, selectedRoute, selectedDay]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const handleDeleteCustomer = (customer) => {
    const { accountNumber } = customer;
    axios
      .post(`${deleteCustomer}${accountNumber}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowDeleteModal(false);
        if (user && user.rol_name === "AdminGrownet") {
          fetchCustomers(token, setCustomers, setIsLoading);
        } else {
          fetchCustomersSupplier(token, user, setCustomers, setIsLoading);
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el customer: ", error);
      });
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleRouteChange = (e) => {
    setSelectedRoute(e.target.value);
  };
  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };


  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const statusColorClass = (status) => {
    switch (status) {
      case 1:
        return "bg-green";
      default:
        return "bg-gray-500";
    }
  };

  const daysMapping = [
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];
  return (
    <Layout>
      <div className="-mt-16">
        <div className="flex gap-4 mt-2">
          <h1 className="text-2xl text-white font-semibold ml-28 mr-2">
            Customers <span className="text-light-green">list</span>
          </h1>
          <button
            className="flex bg-green mb-4 py-2 px-4 rounded-full text-white font-medium transition-all hover:bg-dark-blue hover:scale-110"
            onClick={() => setShowNewCustomers(true)}
          >
            <PlusCircleIcon className="h-6 w-6 mr-1" /> New Customer
          </button>
        </div>
        <div className="flex items-center justify-center mb-5 mt-5">
          <div className="w-[65%]  rounded-lg border border-gray-200 bg-white py-3 flex">
            <input
              type="text"
              placeholder="Search customers by name or account number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-5 w-full text-dark-blue placeholder-gray-400 outline-none"
            />
            {searchTerm != "" && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRoute("");
                  setSelectedGroup("");
                  setSelectedDay("");
                }}
              >
                <TrashIcon className="h-6 w-6 text-danger mr-2" />
              </button>
            )}
          </div>
          {/* 
          TODO: si se decide implementar filtro por status, descomentar este codigo
          <select
            value={status}
            onChange={handleStatusChange}
            className="ml-2 border p-2 rounded-md bg-white bg-clip-padding bg-no-repeat w-auto border-gray-200 px-4 py-2 pr-8 leading-tight h-[50px] text-dark-blue"
          >
            <option value="all" key={1}>
              All status
            </option>
            <option value="active" key={2} className="text-black">
              Active
            </option>
            <option value="inactive" key={3} className="text-black">
              Inactive
            </option>
          </select> */}
          <select
            value={selectedDay}
            onChange={handleDayChange}
            className="ml-2 border p-2 rounded-md bg-white bg-clip-padding bg-no-repeat w-auto border-gray-200 px-4 py-2 pr-8 leading-tight h-[50px] text-dark-blue"
          >
            <option value="">All days</option>
            {daysMapping &&
              daysMapping.map((day) => (
                <option key={day.id} value={day.id} className="text-black">
                  {day.name}
                </option>
              ))}
          </select>
          <select
            value={selectedRoute}
            onChange={handleRouteChange}
            className="ml-2 border p-2 rounded-md bg-white bg-clip-padding bg-no-repeat w-auto border-gray-200 px-4 py-2 pr-8 leading-tight h-[50px] text-dark-blue"
          >
            <option value="">All routes</option>
            {routes &&
              routes.map((route) => (
                <option
                  key={route.id}
                  value={route.name}
                  className="text-black"
                >
                  {route.name}
                </option>
              ))}
          </select>
          <select
            value={selectedGroup}
            onChange={handleGroupChange}
            className="ml-2 border p-2 rounded-md bg-white bg-clip-padding bg-no-repeat w-auto border-gray-200 px-4 py-2 pr-8 leading-tight h-[50px] text-dark-blue placeholder-gray-input"
          >
            <option value="">All groups</option>
            {[
              ...new Set(
                customers.map((customer) =>
                  customer.group !== null ? customer.group : "No group"
                )
              ),
            ].map((uniqueGroup) => (
              <option key={uniqueGroup} className="text-black">
                {uniqueGroup}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center mb-20 ">
          <table className="w-[95%] bg-white rounded-2xl  shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white text-center shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="border-stone-100 border-b-0 text-dark-blue rounded-t-3xl">
                <th
                  className="py-4 rounded-tl-xl cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => requestSort("accountNumber")}
                >
                  Acc Number
                </th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => requestSort("accountName")}
                >
                  Name
                </th>
                <th className="py-4 ">Telephone</th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => requestSort("group")}
                >
                  Group
                </th>
                <th className="py-4">Routes</th>
                <th
                  className="py-4 cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => requestSort("drops")}
                >
                  Drops
                </th>
                <th
                  className="py-4 rounded-tr-xl cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => requestSort("postCode")}
                >
                  Post Code
                </th>
                <th
                  className="py-4 rounded-tr-xl cursor-pointer hover:bg-gray-100 transition-all"
                  onClick={() => requestSort("last_order_date")}
                >
                  Last Order
                </th>
                {/* <th className="py-4">Status</th> */}
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </table>
        </div>
        <NewCustomer
          isvisible={showNewCustomers}
          onClose={() => setShowNewCustomers(false)}
          setUpdateCustomers={setUpdateCustomers}
        />
        <Editcustomer
          isvisible={showEditCustomer}
          onClose={() => setShowEditCustomer(false)}
          customer={selectedCustomer}
          setUpdateCustomers={setUpdateCustomers}
        />
        <ModalDelete
          isvisible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteCustomer(selectedCustomer)}
        />
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default CustomersView;
