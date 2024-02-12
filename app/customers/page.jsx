"use client";
import {
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

const CustomersView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [status, setStatus] = useState("all");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { user } = useUserStore();
  const [showNewCustomers, setShowNewCustomers] = useState(false);
  const [showEditCustomer, setShowEditCustomer] = useState(false);
  const [updateCustomers, setUpdateCustomers] = useState(false);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);

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
    const sortedCustomers = customers.sort((a, b) =>
      a.accountName.localeCompare(b.accountName)
    );
    const filteredCustomers = sortedCustomers.filter((customer) =>
      customer.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setDisplayedCustomers(filteredCustomers);
  }, [searchTerm, customers]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const statusColorClass = (status) => {
    switch (status) {
      case 1:
        return "bg-green";
      default:
        return "bg-gray-500";
    }
  };

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
        <div className="w-full flex items-center justify-center mb-8 mt-2 mr-5 ml-2 ">
          <div className="relative w-[55%] max-w-[65%] ">
            <input
              type="text"
              placeholder="Search customers by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 h-[45px] w-full rounded-lg border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none shadow-md hover:shadow-lg transition-shadow duration-150 ease-in-out"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-5" />
            </div>
          </div>
          <select
            value={status}
            onChange={handleStatusChange}
            className="ml-2 border p-2 rounded-md bg-white bg-clip-padding bg-no-repeat
            w-auto border-gray-200 px-4 py-2 pr-8 leading-tight
            focus:outline-none focus:shadow-outline text-gray-400 hover:border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-150 ease-in-out"
          >
            <option value="all">All status</option>
            <option value="active" className="text-black">
              Active
            </option>
            <option value="inactive" className="text-black">
              Inactive
            </option>
          </select>
          <select
            value={selectedRoute}
            onChange={handleRouteChange}
            className="ml-2 border p-2 rounded-md bg-white bg-clip-padding bg-no-repeat
            w-auto border-gray-200 px-4 py-2 pr-8 leading-tight
            focus:outline-none focus:shadow-outline text-gray-400 hover:border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-150 ease-in-out"
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
            className="ml-2 border p-2 rounded-md bg-white bg-clip-padding bg-no-repeat
            w-auto border-gray-200 px-4 py-2 pr-8 leading-tight
            focus:outline-none focus:shadow-outline text-gray-400 hover:border-gray-300 shadow-md hover:shadow-lg transition-shadow duration-150 ease-in-out"
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
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="border-stone-100 border-b-0 text-dark-blue rounded-t-3xl">
                <th className="py-4 rounded-tl-lg">Name</th>
                <th className="py-4 ">Telephone</th>
                <th className="py-4">Group</th>
                <th className="py-4">Routes</th>
                <th className="py-4">Post Code</th>
                <th className="py-4">Status</th>
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
                displayedCustomers.map((customer) => {
                  const shouldShow =
                    (status === "all" ||
                      (status === "active" &&
                        customer.stateCustomer_id === 1) ||
                      (status === "inactive" &&
                        customer.stateCustomer_id === 2)) &&
                    (!selectedRoute ||
                      customer.routes.some(
                        (route) => route.name === selectedRoute
                      )) &&
                    (!selectedGroup ||
                      (selectedGroup === "No group" && !customer.group) ||
                      (customer.group && customer.group === selectedGroup));
                  if (shouldShow) {
                    return (
                      <tr
                        key={customer.id}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowEditCustomer(true);
                        }}
                        className="text-dark-blue border-2 border-stone-100 border-t-0 cursor-pointer hover:bg-gray-50 transition-all"
                      >
                        <td className="py-4">{customer.accountName}</td>
                        <td className="py-4 w-[110px">{customer.telephone}</td>
                        <td className="py-4 w-[150px]">
                          {customer.group !== null
                            ? customer.group
                            : "No group"}
                        </td>
                        <td className="py-4">
                          {customer.routes && customer.routes.length > 0 ? (
                            customer.routes.map((route, index) => (
                              <span key={route.id}>
                                {route.name}
                                {index < customer.routes.length - 1 && " - "}
                              </span>
                            ))
                          ) : (
                            <span>No routes</span>
                          )}
                        </td>
                        <td className="py-4 w-[120px]">{customer.postCode}</td>
                        <td className="py-4 flex gap-2 justify-center">
                          <div
                            className={`inline-block mt-1 rounded-full text-white ${statusColorClass(
                              customer.stateCustomer_id
                            )} w-3 h-3 flex items-center justify-center`}
                          ></div>
                          {customer.stateCustomer_id === 1 ? (
                            <span>Active</span>
                          ) : (
                            <span>Inactive</span>
                          )}
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
