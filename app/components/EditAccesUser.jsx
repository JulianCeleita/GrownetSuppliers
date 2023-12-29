import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    productsUrl,
    uomUrl,
    updatePresentationUrl,
    taxexUrl,
} from "../config/urls.config";
import { fetchPresentations } from "../presentations/page";
import useTokenStore from "../store/useTokenStore";
import ReactCountryFlag from "react-country-flag";

function EditAccessUser({
    isvisible,
    onClose,
    //   user,
    //   setUser,
    setIsLoading,
}) {
    const { token } = useTokenStore();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [presentations, setPresentations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    //Variables formulario

    //   useEffect(() => {
    //     setUserAccess(() => {
    //         return user.name;
    //     });
    //     setEditedCost(user ? user.orders : "");
    //     setEditedQuantity(user ? user.products : "");
    //     setSelectedUomsStatus(user ? user.presentations : "");
    //     setSelectedProductsStatus(user ? categories : "");
    //     setCodeuser(user ? user.suppliers : "");
    //     console.log("Accesos del usuario:", user);
    //   }, [user]);

    //Api editar
    const handleEditAccessUser = (event) => {
        event.preventDefault();

        const postData = {
            uoms_id: selectedUomsStatus,
            quantity: editedQuantity,
            name: `${editedName} - ${selecteUomsStatus2}`,
            cost: editedCost,
            products_id: selectedProductsStatus,
            code: codePresentation,
            tax: selectedTax,
        };
        console.log("Esto es lo que envio:", postData);
        axios
            .post(`${updatePresentationUrl}${presentation.id}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                fetchPresentations(token, setPresentations, setIsLoading);
                setSelectedUomsStatus("");
                setSelectedProductsStatus("");
                onClose();
                console.log("Respuesta de editar presentación:", response.data);
            })
            .catch((error) => {
                console.error("Error editando la presentación:", error);
            });
    };

    if (!isvisible) {
        return null;
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded-2xl w-[800px] flex flex-col items-center">
                <button
                    className="text-dark-blue place-self-end "
                    onClick={() => onClose()}
                >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
                <ExclamationCircleIcon className="h-8 w-8 text-green mb-2" />
                <h1 className="text-2xl font-bold text-green mb-2">
                    Edit user access
                </h1>
                <form
                    className="text-left  flex flex-col"
                    onSubmit={handleEditAccessUser}
                >
                    <div className="grid grid-cols-2 mt-2 mb-2">
                        <label>Orders: </label>
                        <input type="checkbox" className="w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-2 mt-2 mb-2">
                        <label>Products: </label>
                        <input type="checkbox" className="w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-2 mt-2 mb-2">
                        <label>Presentations: </label>
                        <input type="checkbox" className="w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-2 mt-2 mb-2">
                        <label>Categories: </label>
                        <input type="checkbox" className="w-6 h-6" />
                    </div>
                    <div className="grid grid-cols-2 mt-2 mb-2">
                        <label>Suppliers: </label>
                        <input type="checkbox" className="w-6 h-6" />
                    </div>

                    <div className="mt-3 text-center">
                        <button
                            type="submit"
                            value="Submit"
                            className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
                        >
                            Adit user access
                        </button>
                        <button
                            onClick={() => onClose()}
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
export default EditAccessUser;
