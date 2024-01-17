import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useTokenStore from "../store/useTokenStore";

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
    const [suppliers, setSuppliers] = useState([])

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
                <form className="text-left" onSubmit={handleEditAccessUser}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mt-2 mb-2">
                            <label className="mr-3">Orders:</label>
                            <input type="checkbox" className="w-5 h-5" />
                        </div>
                        <div className="mt-2 mb-2">
                            <label className="mr-3">Products:</label>
                            <input type="checkbox" className="w-5 h-5" />
                        </div>
                        <div className="mt-2 mb-2">
                            <label className="mr-3">Presentations:</label>
                            <input type="checkbox" className="w-5 h-5" />
                        </div>
                        <div className="mt-2 mb-2">
                            <label className="mr-3">Categories:</label>
                            <input type="checkbox" className="w-5 h-5" />
                        </div>
                        <div className="mt-2 mb-2">
                            <label className="mr-3">Suppliers:</label>
                            <input type="checkbox" className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="mt-3 text-center">
                        <button
                            type="submit"
                            value="Submit"
                            className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
                        >
                            Edit user access
                        </button>
                        <button
                            onClick={() => onClose()}
                            className="py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
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
