"use client";
import Table from "@/app/components/Table";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { customersData, customerSupplier, restaurantsData } from "../../config/urls.config";
import Layout from "../../layoutS";
import { useTableStore } from "../../store/useTableStore";
import useTokenStore from "../../store/useTokenStore";
import useUserStore from "../../store/useUserStore";

const CreateOrderView = () => {
    const { token } = useTokenStore();
    const [isLoading, setIsLoading] = useState(false);
    const [addSupplier, setAddSupplier] = useState("");
    const [emailSupplier, setEmailSupplier] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    // const enviarData = (e) => {
    //     e.preventDefault();
    //     const postData = {
    //         uoms_id: selecteUomsStatus,
    //         products_id: selecteProductsStatus,
    //         quantity: quantityPresentation,
    //         name: `${namePresentation} ${selecteUomsStatus2}`,
    //         cost: costPresentation,
    //         code: codePresentation,
    //         tax: selectedTax,
    //         supplier_id: user.id_supplier
    //     };
    //     axios
    //         .post(addPresentationUrl, postData, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })
    //         .then((response) => {
    //             if (user.id_supplier) {
    //                 fetchPresentationsSupplier(token, user, setPresentations, setIsLoading);
    //             } else {
    //                 fetchPresentations(token, setPresentations, setIsLoading);
    //             }
    //             setSelectedUomsStatus("");
    //             setSelectedProductsStatus("");
    //             onClose();
    //         })
    //         .catch((error) => {
    //             console.error("Error al agregar la nueva presentación: ", error);
    //         });
    // };



    return (
        <Layout>
            <div className="flex justify-between p-8 pb-20 bg-primary-blue">
                <Link
                    className="flex bg-dark-blue py-3 px-4 rounded-lg text-white font-medium transition-all hover:scale-110 "
                    href="/customers"
                >
                    <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" /> Customers
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
                <form className="text-left mt-10 w-[50%] mb-20">
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-dark-blue mb-2">
                            Add <span className="text-primary-blue">new customer</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Name:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="test name"
                                type="text"
                                value={addSupplier}
                                onChange={(e) => setAddSupplier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Email:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="test@grownet.com"
                                type="email"
                                // value={emailSupplier}
                                // onChange={(e) => setEmailSupplier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Marketing Email:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="test_marketing@grownet.com"
                                type="email"
                                // value={emailSupplier}
                                // onChange={(e) => setEmailSupplier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Address:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="Cl prueba"
                                type="text"
                                // value=""
                                // onChange={(e) => setAddressSupplier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Telephone number:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="31383394455"
                                type="number"
                                // value=""
                                // onChange={(e) => setAddressSupplier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Account Number:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="RK100"
                                type="text"
                                // value=""
                                // onChange={(e) => setAddressSupplier(e.target.value)}
                                required
                            />
                        </div>


                        <div className="flex items-center mb-4">
                            <label className="mr-2">Account Name:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="Rest100"
                                type="text"
                                // value=""
                                // onChange={(e) => setAddressSupplier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Post Code:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="170001"
                                type="number"
                                // value=""
                                // onChange={(e) => setAddressSupplier(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Special Instructions:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="170001"
                                type="number"
                                // value=""
                                // onChange={(e) => setAddressSupplier(e.target.value)}
                                required
                            />
                        </div>


                        <div className="flex items-center mb-4">
                            <label className="mr-2">Countries indicative:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="57"
                                type="number"
                                // value=""
                                // onChange={(e) => setAddressSupplier(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-3 text-center">
                        <button
                            type="submit"
                            value="Submit"
                            className={`bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 ${isLoading === true ? "bg-gray-500/50" : ""
                                }`}
                            disabled={isLoading}
                        >
                            Add customer
                        </button>
                        <button
                            className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div >
        </Layout >
    );
};
export default CreateOrderView;
