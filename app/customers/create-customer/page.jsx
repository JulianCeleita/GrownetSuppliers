"use client";
import Table from "@/app/components/Table";
import { ArrowLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { createCustomer, customersData, customerSupplier, restaurantsData } from "../../config/urls.config";
import Layout from "../../layoutS";
import { useTableStore } from "../../store/useTableStore";
import useTokenStore from "../../store/useTokenStore";
import useUserStore from "../../store/useUserStore";

const CreateOrderView = () => {
    const router = useRouter();
    const { token } = useTokenStore();
    const [isLoading, setIsLoading] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [emailCustomer, setEmailCustomer] = useState("");
    const [marketingEmail, setMarketingEmail] = useState("");
    const [addressCustomer, setAddressCustomer] = useState("");
    const [telephoneCustomer, setTelephoneCustomer] = useState("");
    const [postCode, setPostCode] = useState("");
    const [specialInstructions, setSpecialInstructions] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const enviarData = (e) => {
        e.preventDefault();
        const postData = {
            accountNumber: accountNumber,
            accountName: accountName,
            postCode: postCode,
            address: addressCustomer,
            specialInstructions: specialInstructions,
            typeCustomers_id: 1,
            deliverysPatterns_id: 1,
            telephone: telephoneCustomer,
            email: emailCustomer,
            marketing_email: marketingEmail,
            countries_indicative: 57,
            stateCustomer_id: 1,
            image: ""
        };
        console.log(postData);
        axios
            .post(createCustomer, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response)
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Client created successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    router.push("/customers")
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
                    href="/customers"
                >
                    <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" /> Customers
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
                <form className="text-left mt-10 w-[50%] mb-20" onSubmit={enviarData}>
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-dark-blue mb-2">
                            Add <span className="text-primary-blue">new customer</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Account Name:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="Rest100"
                                type="text"
                                maxLength={45}
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Account Number:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="RK100"
                                type="text"
                                maxLength={15}
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                            />
                        </div>


                        <div className="flex items-center mb-4">
                            <label className="mr-2">Email:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="test@grownet.com"
                                type="email"
                                value={emailCustomer}
                                maxLength={85}
                                onChange={(e) => setEmailCustomer(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Marketing Email:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="test_marketing@grownet.com"
                                type="email"
                                value={marketingEmail}
                                onChange={(e) => setMarketingEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Address:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="Cl prueba"
                                type="text"
                                maxLength={100}
                                value={addressCustomer}
                                onChange={(e) => setAddressCustomer(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Telephone number:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="31383394455"
                                type="number"
                                value={telephoneCustomer}
                                onChange={(e) => setTelephoneCustomer(e.target.value)}
                                required
                            />
                        </div>





                        <div className="flex items-center mb-4">
                            <label className="mr-2">Post Code:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="170001"
                                type="text"
                                maxLength={45}
                                value={postCode}
                                onChange={(e) => setPostCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex items-center mb-4">
                            <label className="mr-2">Special Instructions:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="Some special instruction"
                                type="text"
                                maxLength={100}
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
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
export default CreateOrderView;
