"use client";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModalDelete from "../components/ModalDelete";
import NewCustomer from "../components/NewCustomer";
import { customersSupplierUrl, customersUrl, deleteCustomer, ordersSupplierUrl, ordersUrl, pricesUrl } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";

export const fetchPrices = async (
    token,
    user,
    setPrices,
    setIsLoading
) => {
    try {
        const response = await axios.get(
            pricesUrl,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(response)

        const newPrice = Array.isArray(response.data.prices)
            ? response.data.prices
            : [];
        setPrices(newPrice);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener los prices:", error);
    }
};

const CustomersView = () => {
    const router = useRouter();
    const { token } = useTokenStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [prices, setPrices] = useState([]);
    const [showNewCustomers, setShowNewCustomers] = useState(false);
    const [status, setStatus] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const { user, setUser } = useUserStore();

    useEffect(() => {
        var localStorageUser = JSON.parse(localStorage.getItem("user"));
        setUser(localStorageUser);
    }, [setUser]);

    useEffect(() => {
        fetchPrices(token, user, setPrices, setIsLoading);
    }, [user, token]);

    const sortedPrices = prices.slice().sort((a, b) => {
        const priceNameA =
            prices.find((o) => o.id === a.id)?.accountName || "";
        const priceNameB =
            prices.find((o) => o.id === b.id)?.accountName || "";

        return priceNameA.localeCompare(priceNameB);
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
                setShowDeleteModal(false);
                fetchPrices(token, setPrices, setIsLoading);
            })
            .catch((error) => {
                console.error("Error al eliminar el price: ", error);
            });
    };



    return (
        <Layout>
            <div>
                <div className="flex justify-between p-8 pb-20 bg-primary-blue">
                    <h1 className="text-2xl text-white font-semibold">Prices list</h1>
                    <Link
                        className="flex bg-green py-3 px-4 rounded-lg text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
                        href="/customers/create-customer"
                    >
                        New Price
                    </Link>
                </div>

                <div className="flex items-center justify-center mb-20 -mt-14">
                    <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
                            <tr className="border-b-2 border-stone-100 text-dark-blue">
                                <th className="py-4 rounded-tl-lg">Customer Number</th>
                                <th className="py-4">Presentation</th>
                                <th className="py-4">Price</th>
                                {/* <th className="py-4">Status</th> */}
                                <th className="py-4">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPrices.map((price) => (
                                <tr
                                    key={price.id}
                                    className="text-dark-blue border-b-2 border-stone-100 cursor-pointer"

                                >
                                    <td className="py-4"
                                    // onClick={(e) => {
                                    //     e.preventDefault();
                                    //     router.push(`/customer/${customer.accountNumber}`, undefined, { shallow: true });
                                    // }}
                                    >{price.customers_accountNumber
                                        }</td>
                                    <td className="py-4"
                                    // onClick={(e) => {
                                    //     e.preventDefault();
                                    //     router.push(`/customer/${customer.accountNumber}`, undefined, { shallow: true });
                                    // }}
                                    >{price.product} - {price.presentation}</td>
                                    <td className="py-4"
                                    // onClick={(e) => {
                                    //     e.preventDefault();
                                    //     router.push(`/customer/${customer.accountNumber}`, undefined, { shallow: true });
                                    // }}
                                    >{price.price}</td>
                                    {/* <td className="py-4">
                                        {price.stateCustomer_id === 1 ? (
                                            <span style={{ color: 'green' }}>Active</span>
                                        ) : (
                                            <span style={{ color: 'red' }}>Inactive</span>
                                        )}
                                    </td> */}
                                    <td>
                                        <button
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setShowDeleteModal(true);
                                            }}
                                            className="flex justify-center text-primary-blue font-medium hover:scale-110 transition-all hover:text-danger hover:border-danger"
                                        >
                                            <TrashIcon className="h-6 w-6" />
                                            Delete
                                        </button>
                                    </td>
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
