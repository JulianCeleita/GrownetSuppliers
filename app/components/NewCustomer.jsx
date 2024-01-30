import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { addSupplierUrl } from "../../app/config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { fetchSuppliers } from "../suppliers/page";

function NewCustomer({ isvisible, onClose, setSuppliers }) {
    const { token } = useTokenStore();
    const [isLoading, setIsLoading] = useState(false);
    const [addSupplier, setAddSupplier] = useState("");
    const [emailSupplier, setEmailSupplier] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isvisible) {
        return null;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };

    const enviarData = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", addSupplier);
        formData.append("email", emailSupplier);
        if (selectedImage !== null) {
            formData.append("image", selectedImage);
        }

        const formDataObject = {};
        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });


        try {
            const response = await axios.post(addSupplierUrl, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            fetchSuppliers(token, setSuppliers, setIsLoading);
            onClose();
            setSelectedImage(null);
            setAddSupplier("");
            setEmailSupplier("");
            setIsLoading(false);
        } catch (error) {
            console.error("Error al agregar el nuevo proveedor:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed mb-16 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded-2xl w-[750px] flex flex-col items-center">
                <button
                    className="text-dark-blue place-self-end "
                    onClick={() => {
                        setSelectedImage(null);
                        setAddSupplier("");
                        setEmailSupplier("");
                        onClose();
                    }}
                >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
                <h1 className="text-2xl font-bold text-dark-blue mb-2">
                    Add <span className="text-primary-blue">new customer</span>
                </h1>
                <form className="text-left" onSubmit={enviarData}>
                    <div className="flex flex-wrap gap-3 mt-3">
                        <div className="flex gap-3">
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
                                    value={emailSupplier}
                                    onChange={(e) => setEmailSupplier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-between">
                            <div className="flex items-center mb-4">
                                <label className="mr-2">Marketing Email:</label>
                                <input
                                    className="border p-3 rounded-md"
                                    placeholder="test_marketing@grownet.com"
                                    type="email"
                                    value={emailSupplier}
                                    onChange={(e) => setEmailSupplier(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center mb-4">
                                <label className="mr-2">Address:</label>
                                <input
                                    className="border p-3 rounded-md"
                                    placeholder="Cl prueba"
                                    type="text"
                                    value=""
                                    // onChange={(e) => setAddressSupplier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex items-center mb-4">
                                <label className="mr-2">Telephone number:</label>
                                <input
                                    className="border p-3 rounded-md"
                                    placeholder="31383394455"
                                    type="number"
                                    value=""
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
                                    value=""
                                    // onChange={(e) => setAddressSupplier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex items-center mb-4">
                                <label className="mr-2">Account Name:</label>
                                <input
                                    className="border p-3 rounded-md"
                                    placeholder="Rest100"
                                    type="text"
                                    value=""
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
                                    value=""
                                    // onChange={(e) => setAddressSupplier(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="flex items-center mb-4">
                                <label className="mr-2">Special Instructions:</label>
                                <input
                                    className="border p-3 rounded-md"
                                    placeholder="170001"
                                    type="number"
                                    value=""
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
                                    value=""
                                    // onChange={(e) => setAddressSupplier(e.target.value)}
                                    required
                                />
                            </div>
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
                            onClick={() => {
                                onClose();
                                setSelectedImage(null);
                                setAddSupplier("");
                                setEmailSupplier("");
                            }}
                            className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default NewCustomer;