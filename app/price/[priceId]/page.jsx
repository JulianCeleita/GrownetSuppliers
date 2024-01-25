"use client";
import EditTable from "@/app/components/EditTable";
import {
    bandsUrl,
    customerDetail,
    customersData, customerSupplier, customerUpdate, orderDetail,
    presentationsSupplierUrl,
    priceDetail,
    priceUpdate,
    restaurantsData
} from "@/app/config/urls.config";
import RootLayout from "@/app/layout";
import Layout from "@/app/layoutS";
import { useTableStore } from "@/app/store/useTableStore";
import useTokenStore from "@/app/store/useTokenStore";
import useUserStore from "@/app/store/useUserStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
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


export const fetchPriceDetail = async (
    token,
    setDetailPrice,
    setIsLoading,
    priceId,
    setShowPriceSection,
    setBands
) => {
    try {
        const response = await axios.get(`${priceDetail}${priceId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response)


        setDetailPrice(response.data.price);
        setShowPriceSection(!response.data.price.bands_id);
        if (!response.data.price.bands_id) {
            setBands({ id: "priceOption", name: "Price" });
        }
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener el detalle del precio:", error);
    }
};

const CustomerDetailPage = () => {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [showPriceSection, setShowPriceSection] = useState(false);
    const { token, setToken } = useTokenStore();
    const { user, setUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [detailPrice, setDetailPrice] = useState({});
    const [accountNumber, setAccountNumber] = useState(null);
    const [price, setPrice] = useState("");
    const [bands, setBands] = useState("");
    const [product, setProduct] = useState("");
    const [productsList, setProductsList] = useState("");
    const [presentation, setPresentation] = useState("");
    const [presentations, setPresentations] = useState(null);
    const [bandsList, setBandsList] = useState(null);
    const [restaurants, setRestaurants] = useState(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const params = useParams();

    let priceId;
    if (params) {
        priceId = params.priceId
    }

    const handleBandSelect = (selectedOption) => {
        const selectedBand = selectedOption.value;
        console.log("🚀 ~ handleBandSelect ~ selectedBand:", selectedBand)
        setBands(selectedBand);

        if (selectedBand.id === "priceOption") {
            setShowPriceSection(true);
        } else {
            setShowPriceSection(false);
        }

        setIsDropdownVisible(false);
    };

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/");
        } else {
            if (storedToken != null) {
                setToken(storedToken);
                if (token !== null && priceId !== undefined) {
                    fetchPriceDetail(token, setDetailPrice, setIsLoading, priceId, setShowPriceSection, setBands);
                }
            }
        }
    }, [token, setToken]);

    useEffect(() => {
        if (typeof detailPrice === "object") {
            console.log(detailPrice);

        }
        console.log("🚀 ~ useEffect ~ typeof detailPrice:", typeof detailPrice)
        console.log("🚀 ~ useEffect ~ detailPrice?.price:", detailPrice[0]?.price)
        setAccountNumber(detailPrice[0]?.customers_accountNumber)
        setPresentation(detailPrice[0]?.presentations_id)
        setProduct(detailPrice[0]?.products_id)
        setPrice(detailPrice[0]?.price)
        console.log(accountNumber);
        console.log(presentation);
        console.log(product);
        console.log(price);

        console.log("🚀 ~ useEffect ~ detailPrice[0]?.customers_accountNumber:", detailPrice[0]?.customers_accountNumber)
    }, [detailPrice])

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

                console.log(sortedBands)
                const bandsWithPriceOption = [
                    { id: "priceOption", name: "Price" },
                    ...sortedBands,
                ];


                setBandsList(bandsWithPriceOption);
            } catch (error) {
                console.error("Error fetching restaurants data", error);
            }
        };

        fetchBands();

        if (user && user.rol_name === "AdminGrownet") {
            fetchPresentations(token, setPresentations, setIsLoading);
        } else {
            fetchPresentationsSupplier(token, user, setPresentations, setIsLoading);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const restaurantList = Array.isArray(restaurants) ? restaurants : [];
    const bandList = Array.isArray(bandsList) ? bandsList : [];


    useEffect(() => {
        setHasMounted(true);
    }, []);

    const enviarData = (e) => {
        e.preventDefault();
        let modifiedBandsId = bands.id;
        if (bands.id == "priceOption") {
            console.log("este es con price")
            modifiedBandsId = null;
        }
        const postData = {
            customers_accountNumber: accountNumber.accountNumber,
            price: price,
            bands_id: modifiedBandsId,
            presentations_id: presentation.id,
            products_id: presentation.products_id,
        };
        console.log(postData);
        axios
            .post(`${priceUpdate}${priceId}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Client update successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    router.push("/prices")
                }, 1500);
            })
            .catch((error) => {
                console.error("Error al editar el customer: ", error);
            });
    };

    if (!hasMounted) {
        return null;
    }

    return (
        <>
            {token ? (
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
                        <form className="text-left mt-10 w-[60%] mb-20 mx-auto" onSubmit={enviarData}>
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
                                                accountNumber?.accountNumber ? accountNumber.accountNumber : detailPrice[0]?.customers_accountNumber,
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
                                            label: bands?.name ? bands.name : detailPrice[0]?.name,
                                        }}
                                        isSearchable
                                    />
                                </div>

                                <div className="flex items-center mb-4">
                                    <label className="mr-2">Presentation:</label>
                                    <Select
                                        className="w-[70%]"
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
                                            label: presentation?.product_name ? `${presentation.product_name} - ${presentation.name}` : `${detailPrice[0]?.product} - ${detailPrice[0]?.presentation}`,
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
                </Layout>
            ) : (
                <RootLayout></RootLayout>
            )}
        </>
    );
};
export default CustomerDetailPage;
