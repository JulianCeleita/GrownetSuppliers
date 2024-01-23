"use client";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalDelete from "../components/ModalDelete";
import NewCustomer from "../components/NewCustomer";
import { customersSupplierUrl, customersUrl, deleteCustomer, ordersSupplierUrl, ordersUrl } from "../config/urls.config";
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
    const response = await axios.get(
      customersUrl,
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

const CustomersView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [showNewCustomers, setShowNewCustomers] = useState(false);
  const [status, setStatus] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    var localStorageUser = JSON.parse(localStorage.getItem("user"));
    setUser(localStorageUser);
  }, [setUser]);

  useEffect(() => {
    // TODO: llamar la funcion de la consulta que necesite por si varia el rol
    if (user && user.rol_name === "AdminGrownet") {
      fetchCustomers(token, user, setCustomers, setIsLoading);
      console.log("funcion pendiente")
    } else {
      fetchCustomersSupplier(token, user, setCustomers, setIsLoading);
    }
  }, [user, token]);

  //   TODO: cambiar la lógica para poder filtrar por nombre del customer
  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.accountName.includes(searchTerm) &&
      (status === 'all' || (status === 'active' && customer.stateCustomer_id === 1) || (status === 'inactive' && customer.stateCustomer_id === 2))
    );
  });


  const sortedCustomers = filteredCustomers.slice().sort((a, b) => {
    const customerNameA =
      customers.find((o) => o.id === a.id)?.accountName || "";
    const customerNameB =
      customers.find((o) => o.id === b.id)?.accountName || "";

    // Ahora ordena según el estado si los nombres son iguales
    if (customerNameA === customerNameB) {
      return a.stateCustomer_id - b.stateCustomer_id;
    }

    return customerNameA.localeCompare(customerNameB);
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteCustomer = (customer) => {
    const { accountNumber } = customer;
    console.log(token)
    console.log(accountNumber)
    axios
      .post(`${deleteCustomer}${accountNumber}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error("Error al eliminar el customer: ", error);
      });
  };


  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };


  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 pb-20 bg-primary-blue">
          <h1 className="text-2xl text-white font-semibold">Customers list</h1>
          <Link
            className="flex bg-green py-3 px-4 rounded-lg text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
            href="/customers/create-customer"
          >
            New Customer
          </Link>
        </div>
        <div className="flex relative items-center justify-center mb-16">
          <input
            type="text"
            placeholder="Search customers by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-[90%] max-w-xl"
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
        </div>
        <div className="flex items-center justify-center mb-20 -mt-14">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Name</th>
                <th className="py-4">Telephone</th>
                <th className="py-4">Email</th>
                <th className="py-4">Status</th>
                <th className="py-4">Delete</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="text-dark-blue border-b-2 border-stone-100 cursor-pointer"

                >
                  <td className="py-4"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/customer/${customer.accountNumber}`, undefined, { shallow: true });
                    }}
                  >{customer.accountName}</td>
                  <td className="py-4"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/customer/${customer.accountNumber}`, undefined, { shallow: true });
                    }}
                  >{customer.telephone}</td>
                  <td className="py-4"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/customer/${customer.accountNumber}`, undefined, { shallow: true });
                    }}
                  >{customer.email}</td>
                  <td className="py-4">
                    {customer.stateCustomer_id === 1 ? (
                      <span style={{ color: 'green' }}>Active</span>
                    ) : (
                      <span style={{ color: 'red' }}>Inactive</span>
                    )}
                  </td>
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowDeleteModal(true);
                    }}
                    className="flex justify-center text-primary-blue font-medium hover:scale-110 mt-4 ml-6 hover:text-danger hover:border-danger"
                  >
                    <TrashIcon className="h-6 w-6 mr-1" />
                    Delete
                  </button>
                </tr>
              ))}
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
