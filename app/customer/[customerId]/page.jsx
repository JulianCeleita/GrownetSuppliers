"use client";
import {
    customerDetail, customerUpdate
} from "@/app/config/urls.config";
import RootLayout from "@/app/layout";
import Layout from "@/app/layoutS";
import useTokenStore from "@/app/store/useTokenStore";
import useUserStore from "@/app/store/useUserStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export const fetchCustomerDetail = async (
    token,
    setDetailCustomer,
    setIsLoading,
    customerId,
) => {
    try {
        const response = await axios.get(`${customerDetail}${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setDetailCustomer(response.data.customer);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener el detalle:", error);
    }
};

const CustomerDetailPage = () => {
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const { token, setToken } = useTokenStore();
    const { user, setUser } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [detailCustomer, setDetailCustomer] = useState();
    const [accountNumber, setAccountNumber] = useState(detailCustomer ? detailCustomer.accountNumber : "");
    const [accountName, setAccountName] = useState(detailCustomer ? detailCustomer.accountName : "");
    const [emailCustomer, setEmailCustomer] = useState(detailCustomer ? detailCustomer.email : "");
    const [marketingEmail, setMarketingEmail] = useState(detailCustomer ? detailCustomer.marketing_email : "");
    const [addressCustomer, setAddressCustomer] = useState(detailCustomer ? detailCustomer.address : "");
    const [telephoneCustomer, setTelephoneCustomer] = useState(detailCustomer ? detailCustomer.telephone : "");
    const [postCode, setPostCode] = useState(detailCustomer ? detailCustomer.postCode : "");
    const [specialInstructions, setSpecialInstructions] = useState(detailCustomer ? detailCustomer.specialInstructions : "");

    const params = useParams();

    let customerId;
    if (params) {
        customerId = params.customerId
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) {
            router.push("/");
        } else {
            if (storedToken != null) {
                setToken(storedToken);
                if (token !== null && customerId !== undefined) {
                    fetchCustomerDetail(token, setDetailCustomer, setIsLoading, customerId);
                }
            }
        }
    }, [customerId, setDetailCustomer, token, setToken]);

    useEffect(() => {
        setAccountNumber(detailCustomer?.accountNumber)
        setAccountName(detailCustomer?.accountName)
        setEmailCustomer(detailCustomer?.email)
        setMarketingEmail(detailCustomer?.marketing_email)
        setAddressCustomer(detailCustomer?.address)
        setTelephoneCustomer(detailCustomer?.telephone)
        setPostCode(detailCustomer?.postCode)
        setSpecialInstructions(detailCustomer?.specialInstructions)
    }, [detailCustomer])


    useEffect(() => {
        setHasMounted(true);
    }, []);

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
            countries_indicative: detailCustomer.countries_indicative,
            stateCustomer_id: 1,
            image: ""
        };
        axios
            .post(`${customerUpdate}${customerId}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Client update successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(() => {
                    router.push("/customers")
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
                            href="/customers"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" /> Customers
                        </Link>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <form className="text-left mt-10 w-[50%] mb-20" onSubmit={enviarData}>
                            <div className="flex items-center justify-center">
                                <h1 className="text-2xl font-bold text-dark-blue mb-2">
                                    Edit <span className="text-primary-blue">customer</span>
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
                                    Edit customer
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
