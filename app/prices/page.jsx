"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ModalDelete from "../components/ModalDelete";
import { priceDelete, pricesBySupplier, pricesUrl, priceUpdate } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";

export const fetchPrices = async (
    token,
    user,
    setPrices,
    setIsLoading,
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

        const newPrice = Array.isArray(response.data.prices)
            ? response.data.prices
            : [];
        setPrices(newPrice);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener los prices:", error);
    }
};

export const fetchPricesBySupplier = async (
    token,
    user,
    setPrices,
    setIsLoading
) => {
    try {
        const response = await axios.get(
            `${pricesBySupplier}${user.id_supplier}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("🚀 ~ response by supplier:", response)

        const newPrice = Array.isArray(response.data.price)
            ? response.data.price
            : [];
        setPrices(newPrice);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener los prices:", error);
    }
};

const PricesView = () => {
    const router = useRouter();
    const { token } = useTokenStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [prices, setPrices] = useState([]);
    const [showNewCustomers, setShowNewCustomers] = useState(false);
    const [status, setStatus] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const { user, setUser } = useUserStore();
    const [editedPrices, setEditedPrices] = useState({});

    const handlePriceChange = (priceId, newValue) => {
        setEditedPrices((prevEditedPrices) => ({
            ...prevEditedPrices,
            [priceId]: newValue,
        }));
    };

    useEffect(() => {
        var localStorageUser = JSON.parse(localStorage.getItem("user"));
        setUser(localStorageUser);
    }, [setUser]);

    useEffect(() => {
        console.log(user)
        if (user.rol_name == "AdminGrownet") {
            fetchPrices(token, user, setPrices, setIsLoading);
        } else {
            fetchPricesBySupplier(token, user, setPrices, setIsLoading)
        }
    }, [user, token]);

    const filteredPrices = prices.filter((price) => {
        return price.customers_accountNumber.toLowerCase().includes(searchTerm);
    });

    const sortedPrices = filteredPrices.slice().sort((a, b) => {
        const priceNameA =
            prices.find((o) => o.id === a.id)?.accountName || "";
        const priceNameB =
            prices.find((o) => o.id === b.id)?.accountName || "";

        return priceNameA.localeCompare(priceNameB);
    });

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeletePrice = (price) => {
        const { id } = price;
        axios
            .post(`${priceDelete}${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setShowDeleteModal(false);
                fetchPrices(token, user, setPrices, setIsLoading);
            })
            .catch((error) => {
                console.error("Error al eliminar el price: ", error);
            });
    };

    const calculateBandValue = (cost, percentage) => {
        const costValue = parseFloat(cost);
        const percentageValue = parseFloat(percentage);

        const markupMargin = (costValue * percentageValue) / (100 - percentageValue);

        const result = costValue + markupMargin;

        return result.toFixed(2);
    };
    const calculateUtilityValue = (cost, percentage) => {
        const costValue = parseFloat(cost);
        const percentageValue = parseFloat(percentage);

        // Calcular el markup margin
        const markupMargin = (costValue * percentageValue) / (100 - percentageValue);
        return markupMargin.toFixed(2);
    };

    const getBandColorClass = (bandId) => {
        switch (bandId) {
            case 1:
                return 'bg-green px-1';
            case 2:
                return 'bg-green px-1';
            case 3:
                return 'bg-green px-1';
            case 4:
                return 'bg-green px-1';
            case 5:
                return 'bg-green px-1';
            default:
                return '';
        }
    };

    const enviarData = (price, band_id) => {
        const priceId = price.id;
        const postData = {
            customers_accountNumber: price.customers_accountNumber,
            price: editedPrices[priceId] || price.price,
            bands_id: band_id,
            presentations_id: price.presentations_id,
            products_id: price.products_id,
        };
        axios
            .post(`${priceUpdate}${price.id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Price update successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchPrices(token, user, setPrices, setIsLoading);
            })
            .catch((error) => {
                console.error("Error al editar el customer: ", error);
            });
    };


    return (
        <Layout>
            <div>
                <div className="flex justify-between p-8 bg-primary-blue">
                    <h1 className="text-2xl text-white font-semibold">Prices list</h1>
                    <Link
                        className="flex bg-green py-3 px-4 rounded-lg text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
                        href="/prices/create-price"
                    >
                        New Price
                    </Link>
                </div>

                <div className="flex relative items-center justify-center ml-5 ">
                    <input
                        type="text"
                        placeholder="Search prices by customer number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border p-2 rounded-xl w-[40%] pl-10 max-w-[72%]"
                    />
                </div>

                <div className="flex items-center justify-center mb-20">
                    <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <thead className="sticky top-0 bg-white">
                            <tr className="border-b-2 border-stone-100 text-dark-blue">
                                <th className="py-4">Presentation</th>
                                <th className="py-4 rounded-tl-lg">Customer Account</th>
                                <th className="py-4">Cost</th>
                                <th className="py-4">Band 1</th>
                                <th className="py-4">Band 2</th>
                                <th className="py-4">Band 3</th>
                                <th className="py-4">Band 4</th>
                                <th className="py-4">Band 5</th>
                                <th className="py-4">Arbitrary</th>
                                {/* TODO: si se decide implementar la columna price descomentar este codigo */}
                                {/* <th className="py-4">Price</th> */}
                                <th className="py-4">Utility %</th>
                                <th className="py-4">Utility $</th>
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/price/${price.id}`, undefined, { shallow: true });
                                        }}
                                    >{price.product} - {price.presentation}</td>
                                    <td className="py-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/price/${price.id}`, undefined, { shallow: true });
                                        }}
                                    >{price.customers_accountNumber
                                        }</td>
                                    <td className="py-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/price/${price.id}`, undefined, { shallow: true });
                                        }}
                                    >{price.cost}</td>
                                    {/* TODO: si se decide implementar la columna price descomentar este codigo */}
                                    {/* <td className="py-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/price/${price.id}`, undefined, { shallow: true });
                                        }}
                                    >{price.price}</td> */}
                                    <td className={`py-4 ${getBandColorClass(price.bands_id)}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 1);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 10)}</div>
                                    </td>
                                    <td className={`py-4`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 2);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 20)}</div>
                                    </td>
                                    <td
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 3);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 30)}</div>
                                    </td>
                                    <td
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 4);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 40)}</div>
                                    </td>
                                    <td
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 5);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 50)}</div>
                                    </td>
                                    <td
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <input
                                            type="text"
                                            value={editedPrices[price.id] !== undefined ? editedPrices[price.id] : price.price}
                                            onChange={(e) => handlePriceChange(price.id, e.target.value)}
                                            className="border-b-black bg-white p-1"
                                        />
                                    </td>
                                    <td className="py-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/price/${price.id}`, undefined, { shallow: true });
                                        }}
                                    >{price.utility}%</td>
                                    <td className="py-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/price/${price.id}`, undefined, { shallow: true });
                                        }}
                                    >{calculateUtilityValue(price.cost, price.utility)}$</td>
                                    <td>
                                        <button
                                            onClick={() => {
                                                setSelectedPrice(price);
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
                    onConfirm={() => handleDeletePrice(selectedPrice)}
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
export default PricesView;
