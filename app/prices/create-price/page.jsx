"use client";
import Table from "@/app/components/Table";
import useUserStore from "@/app/store/useUserStore";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { bandsUrl, createCustomer, createPrice, customersData, customerSupplier, presentationsSupplierUrl, presentationsUrl, productsUrl, restaurantsData } from "../../config/urls.config";
import Layout from "../../layoutS";
import useTokenStore from "../../store/useTokenStore";
import Select from "react-select";

export const fetchPresentations = async (
    token,
    setPresentations,
    setIsLoading
) => {
    try {
        const response = await axios.get(presentationsUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const newPresentation = Array.isArray(response?.data?.presentations)
            ? response?.data?.presentations
            : [];
        setPresentations(newPresentation);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener las presentaciones:", error);
    }
};



export const fetchPresentationsSupplier = async (
    token,
    user,
    setPresentations,
    setIsLoading
) => {
    try {
        const response = await axios.get(`${presentationsSupplierUrl}${user.id_supplier}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const newPresentation = Array.isArray(response.data.presentations)
            ? response.data.presentations
            : [];
        setPresentations(newPresentation);
        console.log(newPresentation);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener las presentaciones:", error);
    }
};

const CreatePriceView = () => {
    const router = useRouter();
    const { token } = useTokenStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPriceSection, setShowPriceSection] = useState(false);
    const [accountNumber, setAccountNumber] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [bands, setBands] = useState("");
    const [product, setProduct] = useState("");
    const [productsList, setProductsList] = useState("");
    const [presentation, setPresentation] = useState("");
    const [presentations, setPresentations] = useState(null);
    const [bandsList, setBandsList] = useState(null);
    const [restaurants, setRestaurants] = useState(null);
    const { user, setUser } = useUserStore();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseRestaurants = await axios.get(restaurantsData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const sortedRestaurants = responseRestaurants.data.customers.sort(
                    (a, b) => a.accountName.localeCompare(b.accountName)
                );

                setRestaurants(sortedRestaurants);
            } catch (error) {
                console.error("Error fetching restaurants data", error);
            }
        };

        const fetchDataBySupplier = async () => {
            try {
                const responseRestaurants = await axios.get(`${customerSupplier}${user.id_supplier}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log(responseRestaurants);

                const sortedRestaurants = responseRestaurants.data.customers.sort(
                    (a, b) => a.accountName.localeCompare(b.accountName)
                );

                setRestaurants(sortedRestaurants);
            } catch (error) {
                console.error("Error fetching restaurants data by supplier", error);
            }
        };

        console.log(restaurants);

        if (user.rol_name !== "AdminGrownet") {
            fetchDataBySupplier();
        } else {
            fetchData();
        }

        const fetchBands = async () => {
            try {
                const responseBands = await axios.get(bandsUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const sortedBands = responseBands.data.bands.sort(
                    (a, b) => a.name.localeCompare(b.name)
                );

                const bandsWithPriceOption = [
                    { id: "priceOption", name: "Price" },
                    ...sortedBands,
                ];

                console.log(sortedBands)

                setBandsList(bandsWithPriceOption);
            } catch (error) {
                console.error("Error fetching restaurants data", error);
            }
        };

        fetchBands();

        const fetchProducts = async () => {
            try {
                const response = await axios.get(productsUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const newProducts = Array.isArray(response.data.products)
                    ? response.data.products
                    : [];

                const sortedProducts = newProducts.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                console.log("🚀 ~ fetchProducts ~ sortedProducts:", sortedProducts)
                setProductsList(sortedProducts);
            } catch (error) {
                console.error("Error al obtener los productos:", error);
            }
        };

        fetchProducts();

        if (user && user.rol_name === "AdminGrownet") {
            fetchPresentations(token, setPresentations, setIsLoading);
        } else {
            fetchPresentationsSupplier(token, user, setPresentations, setIsLoading);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const restaurantList = Array.isArray(restaurants) ? restaurants : [];
    const bandList = Array.isArray(bandsList) ? bandsList : [];
    const productList = Array.isArray(productsList) ? productsList : [];

    const handleBandSelect = (selectedOption) => {
        const selectedBand = selectedOption.value;
        setBands(selectedBand);

        if (selectedBand.id === "priceOption") {
            setShowPriceSection(true);
        } else {
            setShowPriceSection(false);
        }

        setIsDropdownVisible(false);
    };

    const enviarData = (e) => {
        e.preventDefault();
        let modifiedBandsId = bands.id;
        if (bands.id == "priceOption") {
            console.log("este es con price")
            modifiedBandsId = null;
        }
        const postData = {
            customers_accountNumber: accountNumber.accountNumber,
            type: type,
            price: price,
            bands_id: modifiedBandsId,
            presentations_id: presentation.id,
            products_id: presentation.products_id,
        };
        console.log(postData);
        axios
            .post(createPrice, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Price created successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    router.push("/prices")
                }, 1500);
            })
            .catch((error) => {
                console.error("Error al agregar el nuevo customer: ", error);
            });
    };



    return (
        <Layout>
            <div className="flex justify-between p-8 pb-20 bg-primary-blue">
                <Link
                    className="flex bg-dark-blue py-3 px-4 rounded-lg text-white font-medium transition-all hover:scale-110 "
                    href="/prices"
                >
                    <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" /> Prices
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
                <form className="text-left mt-10 w-[70%] mb-20 mx-auto" onSubmit={enviarData}>
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-dark-blue mb-2">
                            Add <span className="text-primary-blue">new price</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Account Number:</label>
                            <Select
                                className="w-[70%]"
                                instanceId
                                options={restaurantList.map((restaurant) => ({
                                    value: restaurant,
                                    label: restaurant.accountNumber,
                                }))}
                                onChange={(selectedOption) => {
                                    setAccountNumber(selectedOption.value);
                                    setIsDropdownVisible(false);
                                }}
                                value={{
                                    value: accountNumber,
                                    label:
                                        accountNumber ? accountNumber.accountNumber : "Search...",
                                }}
                                isSearchable
                            />
                        </div>


                        <div className="flex items-center mb-4">
                            <label className="mr-2">Bands:</label>
                            <Select
                                className="w-[70%]"
                                instanceId
                                options={bandList.map((band) => ({
                                    value: band,
                                    label: band.name,
                                }))}
                                onChange={handleBandSelect}
                                value={{
                                    value: bands,
                                    label: bands ? bands.name : "Search...",
                                }}
                                isSearchable
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Product:</label>
                            <Select
                                className="w-[80%]"
                                instanceId
                                options={presentations?.map((presentation) => ({
                                    value: presentation,
                                    label: `${presentation.product_name} - ${presentation.name}`,
                                }))}
                                onChange={(selectedOption) => {
                                    console.log(selectedOption.value)
                                    setPresentation(selectedOption.value);
                                    setIsDropdownVisible(false);
                                }}
                                value={{
                                    value: presentation,
                                    label: presentation ? `${presentation.product_name} - ${presentation.name}` : "Search...",
                                }}
                                isSearchable
                            />
                        </div>

                        {showPriceSection && (
                            <div className="flex items-center mb-4">
                                <label className="mr-2">Price:</label>
                                <input
                                    className="border p-3 rounded-md"
                                    placeholder="31383394455"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                    </div>
                    <div className="mt-3 text-center">
                        <button
                            type="submit"
                            value="Submit"
                            className={`bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 ${isLoading === true ? "bg-gray-500/50" : ""
                                }`}
                            disabled={isLoading}
                        >
                            Add price
                        </button>
                        <Link
                            className="py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium "
                            href="/customers"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div >
        </Layout >
    );
};
export default CreatePriceView;
