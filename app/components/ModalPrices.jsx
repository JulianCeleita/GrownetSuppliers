import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
    addPresentationUrl,
    priceUpdate,
    productsUrl,
    taxexUrl,
    uomUrl,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import {
    fetchPresentations,
    fetchPresentationsSupplier,
} from "../api/presentationsRequest";
import { fetchPrices, fetchPricesBySupplier } from "../api/catalogRequest";
import Swal from "sweetalert2";

function ModalPrices({
    isvisible,
    onClose,
    price,
    setIsLoading,
    setPrices
}) {
    const { token } = useTokenStore();
    const { user } = useUserStore();


    useEffect(() => {
        console.log(price)
    }, [])

    const enviarData = (price, band_id, newPrice) => {
        const priceId = price.price_id;
        const postData = {
            customers_accountNumber: price.customers_accountNumber,
            price: newPrice,
            bands_id: null,
            presentations_id: price.presentations_id,
            products_id: price.products_id,
        };
        // console.log("postData", postData);
        axios
            .post(`${priceUpdate}${price.price_id}`, postData, {
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
                    timer: 1500,
                });
                if (user?.rol_name == "AdminGrownet") {
                    fetchPrices(token, user, setPrices, setIsLoading);
                } else {
                    fetchPricesBySupplier(token, user, setPrices, setIsLoading);
                }
                setTimeout(() => {
                    onClose(true);
                }, 1000);
            })
            .catch((error) => {
                console.error("Error al editar el customer: ", error);
            });
    };

    const calculateBandValue = (cost, marginPercentage) => {
        const costValue = parseFloat(cost);
        const marginDecimal = marginPercentage / 100;

        const revenue = costValue / (1 - marginDecimal);
        const profit = revenue - costValue;

        return {
            revenue: revenue.toFixed(2),
            profit: profit.toFixed(2)
        };
    };

    const bands = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((marginPercentage) => {
        const { revenue, profit } = calculateBandValue(price.cost, marginPercentage);
        return {
            id: marginPercentage,
            value: revenue,
            profit: profit
        };
    });


    return (
        <div className={`fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ${isvisible ? '' : 'hidden'}`}>
            <div className="bg-white p-8 rounded-2xl w-[800px] flex flex-col items-center">
                <button
                    className="self-end mb-4"
                    onClick={() => onClose()}
                >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
                <h1 className="text-2xl font-bold text-dark-blue mb-2">
                    Recommended prices
                </h1>
                <p className="text-lg mb-4">Actual price: {price.price}</p>
                <div className="grid grid-rows-2 grid-cols-5 gap-4 w-full">
                    {bands.map((band) => (
                        <div key={band.id} className="flex flex-col items-center">
                            <button
                                className="text-sm py-1 w-full bg-blue-500 text-white rounded-t transition-all hover:bg-blue-700"
                                onClick={(e) => {
                                    e.preventDefault();
                                    enviarData(price, band.id, band.value);
                                }}
                            >
                                {band.id}%
                            </button>
                            <button
                                className="text-lg py-2 w-full bg-blue-500 text-white rounded-b transition-all hover:bg-blue-700"
                                onClick={(e) => {
                                    e.preventDefault();
                                    enviarData(price, band.id, band.value);
                                }}
                            >
                                {band.value}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default ModalPrices;
