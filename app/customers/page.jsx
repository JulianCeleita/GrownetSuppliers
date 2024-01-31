"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalDelete from "../components/ModalDelete";
import {
  customersSupplierUrl,
  customersUrl,
  deleteCustomer,
  routesUrl,
} from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";

export const fetchCustomers = async (
  token,
  user,
  setCustomers,
  setIsLoading
) => {
  try {
    const response = await axios.get(customersUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newCustomer = Array.isArray(response.data.customers)
      ? response.data.customers
      : [];
    setCustomers(newCustomer);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los customers:", error);
  }
};

export const fetchCustomersSupplier = async (
  token,
  user,
  setCustomers,
  setIsLoading
) => {
  try {
    const response = await axios.get(
      `${customersSupplierUrl}${user.id_supplier}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newCustomer = Array.isArray(response.data.customers)
      ? response.data.customers
      : [];
    setCustomers(newCustomer);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los customers:", error);
  }
};
export const fetchRoutes = async (token, user, setRoutes, setIsLoading) => {
  try {
    const response = await axios.get(routesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newRoute = Array.isArray(response.data.routes)
      ? response.data.routes
      : [];
    setRoutes(newRoute);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los routes:", error);
  }
};

const CustomersView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showNewCustomers, setShowNewCustomers] = useState(false);
  const [status, setStatus] = useState("all");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { user, setUser } = useUserStore();
  useEffect(() => {
    var localStorageUser = JSON.parse(localStorage.getItem("user"));
    setUser(localStorageUser);
  }, [setUser]);

  useEffect(() => {
    if (user && user.rol_name === "AdminGrownet") {
      fetchCustomers(token, user, setCustomers, setIsLoading);
    } else {
      fetchCustomersSupplier(token, user, setCustomers, setIsLoading);
    }
    fetchRoutes(token, user, setRoutes, setIsLoading);
  }, [user, token]);

  useEffect(() => {
    const routesMatchingSearchTerm = routes.filter((route) =>
      route.name.includes(searchTerm)
    );

    setFilteredRoutes(routesMatchingSearchTerm);
  }, [searchTerm, routes]);

  const filteredCustomers = customers.filter((customer) => {
    return customer.accountName.toLowerCase().includes(searchTerm);
  });

  const sortedCustomers = filteredCustomers.slice().sort((a, b) => {
    const routeA = a.route.toUpperCase();
    const routeB = b.route.toUpperCase();

    const numberA = parseInt(routeA.substring(1));
    const numberB = parseInt(routeB.substring(1));

    if (numberA < numberB) {
      return -1;
    }
    if (numberA > numberB) {
      return 1;
    }

    return routeA.localeCompare(routeB);
  });

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

  const groups = [
    { id: 0, name: "No group" },
    { id: 1, name: "Redirect" },
    { id: 2, name: "Efoods" },
    { id: 3, name: "Market" },
    { id: 4, name: "UFC" },
  ];

  const getGroupNameById = (groupId) => {
    const group = groups.find((group) => group.id === groupId);
    return group ? group.name : "Unknown";
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 bg-primary-blue">
          <h1 className="text-2xl text-white font-semibold">Customers list</h1>
          <Link
            className="flex bg-green py-3 px-4 rounded-lg text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
            href="/customers/create-customer"
          >
            New Customer
          </Link>
        </div>
        <div className="flex relative items-center justify-center mb-16 mt-2 mr-5 ml-5 ">
          <input
            type="text"
            placeholder="Search customers by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-xl w-[80%] pl-10 max-w-[72%]"
          />
          <select
            value={status}
            onChange={handleStatusChange}
            className="ml-2 border p-2 rounded-md"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={selectedRoute}
            onChange={handleRouteChange}
            className="ml-2 border p-2 rounded-md"
          >
            <option value="">All Routes</option>
            {routes &&
              routes.map((route) => (
                <option key={route.id} value={route.name}>
                  {route.name}
                </option>
              ))}
          </select>
          <select
            value={selectedGroup}
            onChange={handleGroupChange}
            className="ml-2 border p-2 rounded-md"
          >
            <option value="">All groups</option>
            {groups.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center mb-20 -mt-14">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Name</th>
                <th className="py-4">Telephone</th>
                <th className="py-4">Group</th>
                <th className="py-4">Route</th>
                <th className="py-4">Post Code</th>
                <th className="py-4">Status</th>
                <th className="py-4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((customer) => {
                const shouldShow =
                  (status === "all" ||
                    (status === "active" && customer.stateCustomer_id === 1) ||
                    (status === "inactive" &&
                      customer.stateCustomer_id === 2)) &&
                  (!selectedRoute || customer.route === selectedRoute) &&
                  (!selectedGroup ||
                    getGroupNameById(customer.group_id) === selectedGroup);
                if (shouldShow) {
                  return (
                    <tr
                      key={customer.id}
                      className="text-dark-blue border-b-2 border-stone-100 cursor-pointer"
                    >
                      <td
                        className="py-4"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(
                            `/customer/${customer.accountNumber}`,
                            undefined,
                            { shallow: true }
                          );
                        }}
                      >
                        {customer.accountName}
                      </td>
                      <td
                        className="py-4"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(
                            `/customer/${customer.accountNumber}`,
                            undefined,
                            { shallow: true }
                          );
                        }}
                      >
                        {customer.telephone}
                      </td>
                      <td
                        className="py-4"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(
                            `/customer/${customer.accountNumber}`,
                            undefined,
                            { shallow: true }
                          );
                        }}
                      >
                        {getGroupNameById(customer.group_id)}
                      </td>
                      <td
                        className="py-4"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(
                            `/customer/${customer.accountNumber}`,
                            undefined,
                            { shallow: true }
                          );
                        }}
                      >
                        {customer.route}
                      </td>
                      <td
                        className="py-4"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(
                            `/customer/${customer.accountNumber}`,
                            undefined,
                            { shallow: true }
                          );
                        }}
                      >
                        {customer.postCode}
                      </td>
                      <td className="py-4">
                        {customer.stateCustomer_id === 1 ? (
                          <span style={{ color: "green" }}>Active</span>
                        ) : (
                          <span style={{ color: "red" }}>Inactive</span>
                        )}
                      </td>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowDeleteModal(true);
                        }}
                        className="flex justify-center text-primary-blue font-medium hover:scale-110 mt-4 ml-6 transition-all hover:text-danger hover:border-danger"
                      >
                        <TrashIcon className="h-6 w-6 mr-1" />
                        Delete
                      </button>
                    </tr>
                  );
                }

                return null;
              })}
            </tbody>
          </table>
        </div>
        <ModalDelete
          isvisible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteCustomer(selectedCustomer)}
        />
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default CustomersView;
