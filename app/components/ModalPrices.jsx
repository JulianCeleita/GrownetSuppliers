import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
    addPresentationUrl,
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

function ModalPrices({
    isvisible,
    onClose,
    price,
    setIsLoading,
}) {
    const { token } = useTokenStore();

    // useEffect(() => {
    //     console.log(price)
    // }, [])

    const calculateBandValue = (cost, percentage) => {
        const costValue = parseFloat(cost);
        const percentageValue = parseFloat(percentage);

        const markupMargin =
            (costValue * percentageValue) / (100 - percentageValue);

        const result = costValue + markupMargin;

        return result.toFixed(2);
    };

    const bands = [1, 2, 3, 4, 5].map((band) => ({
        id: band,
        value: calculateBandValue(price.cost, band)
    }));


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
                <p className="text-lg mb-4">Price actual: {price.price}</p>
                {bands.map((band) => (
                    <button
                        key={band.id}
                        className="text-lg py-2 px-4 mb-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        // onClick={(e) => {
                        //     e.preventDefault();
                        //     enviarData(price, band.id);
                        // }}
                    >
                        Band {band.id}: {band.value}
                    </button>
                ))}
            </div>
        </div>
    );
}
export default ModalPrices;
