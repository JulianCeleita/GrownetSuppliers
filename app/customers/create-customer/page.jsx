"use client";
import useUserStore from "@/app/store/useUserStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { assignCustomer, createCustomer, groupsUrl, routesUrl } from "../../config/urls.config";
import Layout from "../../layoutS";
import useTokenStore from "../../store/useTokenStore";

export const fetchRoutes = async (
    token,
    user,
    setRoutes,
    setIsLoading
) => {
    try {
        const response = await axios.get(
            routesUrl,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const newRoute = Array.isArray(response.data.routes)
            ? response.data.routes
            : [];
        setRoutes(newRoute);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener los routes:", error);
    }
};

export const fetchGroups = async (
    token,
    user,
    setGroups,
    setIsLoading
) => {
    try {
        const response = await axios.get(
            groupsUrl,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const newGroup = Array.isArray(response.data.groups)
            ? response.data.groups
            : [];
        setGroups(newGroup);
        setIsLoading(false);
    } catch (error) {
        console.error("Error al obtener los groups:", error);
    }
};

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
    const [mainContact, setMainContact] = useState("");
    const [accountEmail, setAccountEmail] = useState("");
    const [drop, setDrop] = useState("");
    const [crates, setCrates] = useState("");
    const [cratesSelected, setCratesSelected] = useState("");
    const [vip, setVip] = useState("");
    const [vipSelected, setVipSelected] = useState("");
    const [deliveryWindow, setDeliveryWindow] = useState("");
    const [group, setGroup] = useState("");
    const [route, setRoute] = useState("");
    const [routes, setRoutes] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const { user, setUser } = useUserStore();
    const [startHour, setStartHour] = useState('');
    const [endHour, setEndHour] = useState('');
    const [error, setError] = useState('');
    const [selectedRoutes, setSelectedRoutes] = useState({});

    useEffect(() => {
        fetchRoutes(token, user, setRoutes, setIsLoading);
        fetchGroups(token, user, setGroups, setIsLoading);
    }, [])



    const handleRouteCheckboxChange = (routeId, day) => {
        setSelectedRoutes((prevSelectedRoutes) => {
            const updatedRoutes = { ...prevSelectedRoutes };

            // Toggle the selected checkbox for the current route and day
            updatedRoutes[day] = { [routeId]: !updatedRoutes[day]?.[routeId] };

            return updatedRoutes;
        });
    };


    const prepareDataForBackend = () => {
        const daysData = {};

        Object.keys(selectedRoutes).forEach((day) => {
            const routesForDay = Object.values(selectedRoutes[day]);
            if (routesForDay.some(isSelected => isSelected)) {
                daysData[getDayNumber(day)] = Object.entries(selectedRoutes[day])
                    .filter(([_, isSelected]) => isSelected)
                    .map(([routeId, _]) => routeId)
                    .join(',');
            }
        });

        return { days_routes: daysData };
    };

    const getDayNumber = (day) => {
        switch (day.toLowerCase()) {
            case 'lunes':
                return "1";
            case 'martes':
                return "2";
            case 'miercoles':
                return "3";
            case 'jueves':
                return "4";
            case 'viernes':
                return "5";
            default:
                return null;
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
    };
    const handleRouteChange = (e) => {
        setSelectedRoute(e.target.value);
    };
    const handleGroupChange = (e) => {
        setSelectedGroup(e.target.value);
    };

    const handleCratesChange = (e) => {
        const value = e.target.value;
        setCrates(value);
        const isYes = value === 'yes';
        setCratesSelected(isYes);
    };

    const handleVipChange = (e) => {
        const value = e.target.value;
        setVip(value);
        const isYes = value === 'yes';
        setVipSelected(isYes);
    };

    const validateHourFormat = (input) => {
        return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(input) || input === '';
    };

    const handleStartHourChange = (e) => {
        const input = e.target.value;
        setStartHour(input);
        setError(validateHourFormat(input) ? '' : 'Wrong time format');
    };

    const handleEndHourChange = (e) => {
        const input = e.target.value;
        setEndHour(input);
        setError(validateHourFormat(input) ? '' : 'Wrong time format');
    };

    const handleBlur = () => {
        if (!validateHourFormat(startHour) || !validateHourFormat(endHour)) {
            setError('Both fields must be in valid time format');
        } else {
            setError('');
        }
    };

    const handleDropChange = (e) => {
        const inputValue = e.target.value;
        const newValue = inputValue <= 100 ? inputValue : 100;
        setDrop(newValue);
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
            stateCustomer_id: 1,
            image: "",
            main_contact: mainContact,
            account_email: accountEmail,
            drop: drop,
            crates: cratesSelected,
            vip: vipSelected,
            delivery_window: `${startHour} - ${endHour}`,
            group_id: selectedGroup
        };
        const postDataAssign = {
            ...prepareDataForBackend()
        };
        axios
            .post(createCustomer, postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const customerAccountNumber = response?.data?.accountNumber;
                postDataAssign.customer = customerAccountNumber;
                axios
                    .post(assignCustomer, postDataAssign, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    .then((assignResponse) => {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Client created successfully",
                            showConfirmButton: false,
                            timer: 1500
                        });

                        setTimeout(() => {
                            router.push("/customers");
                        }, 1500);
                    })
                    .catch((assignError) => {
                        console.error("Error en la asignación del cliente: ", assignError);
                    });
            })
            .catch((error) => {
                console.error("Error al agregar el nuevo cliente: ", error);
            });
    };



    return (
        <Layout>
            <div className="flex justify-between p-8 bg-primary-blue">
                <Link
                    className="flex bg-dark-blue py-3 px-4 rounded-lg text-white font-medium transition-all hover:scale-110 "
                    href="/customers"
                >
                    <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" /> Customers
                </Link>
            </div>
            <div className="flex flex-col items-center justify-center">
                <form className="text-left mt-10 mx-auto w-[80%] mb-20" onSubmit={enviarData}>
                    <div className="flex items-center justify-center">
                        <h1 className="text-2xl font-bold text-dark-blue mb-2">
                            Add <span className="text-primary-blue">new customer</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Account Name:</label>
                            <input
                                className="border p-3 rounded-md w-[60%]"
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
                                className="border p-3 rounded-md w-[60%]"
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
                                className="border p-3 rounded-md w-[60%]"
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
                                className="border p-3 rounded-md w-[60%]"
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
                                className="border p-3 rounded-md w-[60%]"
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
                                className="border p-3 rounded-md w-[60%]"
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
                                className="border p-3 rounded-md w-[60%]"
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
                                className="border p-3 rounded-md w-[60%]"
                                placeholder="Some special instruction"
                                type="text"
                                maxLength={100}
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Main Contact:</label>
                            <input
                                className="border p-3 rounded-md w-[60%]"
                                placeholder="Your name"
                                type="text"
                                maxLength={100}
                                value={mainContact}
                                onChange={(e) => setMainContact(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Account Email:</label>
                            <input
                                className="border p-3 rounded-md w-[60%]"
                                placeholder="email@gmail.com"
                                type="email"
                                maxLength={100}
                                value={accountEmail}
                                onChange={(e) => setAccountEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Drop:</label>
                            <input
                                className="border p-3 rounded-md"
                                placeholder="5"
                                type="number"
                                maxLength={3}
                                value={drop}
                                onChange={handleDropChange}
                                required
                            />
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Crates:</label>
                            <select
                                value={crates}
                                onChange={handleCratesChange}
                                className="ml-2 border p-2 rounded-md"
                            >
                                <option value="">Select Option</option>
                                <option key="yes" value="yes">Yes</option>
                                <option key="no" value="no">No</option>
                            </select>
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">VIP:</label>
                            <select
                                value={vip}
                                onChange={handleVipChange}
                                className="ml-2 border p-2 rounded-md"
                            >
                                <option value="">Select Option</option>
                                <option key="yes" value="yes">Yes</option>
                                <option key="no" value="no">No</option>
                            </select>
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Delivery Window:</label>
                            <div>
                                <input
                                    className="border p-3 rounded-md w-[30%]"
                                    placeholder="hh:mm:ss"
                                    type="text"
                                    maxLength={8}
                                    value={startHour}
                                    onChange={handleStartHourChange}
                                    onBlur={handleBlur}
                                    required
                                />
                                <span className="mx-2">-</span>
                                <input
                                    className="border p-3 rounded-md w-[30%]"
                                    placeholder="hh:mm:ss"
                                    type="text"
                                    maxLength={8}
                                    value={endHour}
                                    onChange={handleEndHourChange}
                                    onBlur={handleBlur}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Group:</label>
                            <select
                                value={selectedGroup}
                                onChange={handleGroupChange}
                                className="ml-2 border p-2 rounded-md"
                            >
                                <option value="">Select Group</option>
                                {groups && groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.group}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="mr-2">Routes:</label>
                            <table className="ml-2 border p-2 rounded-md">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {routes.map((route) => (
                                            <th className="p-1" key={route.id}>{route.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>

                                    {['lunes', 'martes', 'miercoles', 'jueves', 'viernes'].map((day) => (
                                        <tr key={day}>
                                            <td>{day}</td>
                                            {routes.map((route) => (
                                                <td key={route.id}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRoutes[day]?.[route.id] || false}
                                                        onChange={() => handleRouteCheckboxChange(route.id, day)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
