import useUserStore from "@/app/store/useUserStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  fetchCustomers,
  fetchCustomersSupplier,
  fetchGroups,
  fetchRoutes,
} from "../api/customerRequest";
import { assignCustomer, createCustomer } from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";

function NewCustomer({ isvisible, onClose, setUpdateCustomers }) {
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
  const [mainContact, setMainContact] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [drop, setDrop] = useState("");
  const [crates, setCrates] = useState("no");
  const [cratesSelected, setCratesSelected] = useState("");
  const [vip, setVip] = useState("no");
  const [vipSelected, setVipSelected] = useState("");
  const [routes, setRoutes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { user, setUser } = useUserStore();
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [error, setError] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState({});
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    fetchRoutes(token, user, setRoutes, setIsLoading);
    fetchGroups(token, user, setGroups, setIsLoading);
  }, []);

  if (!isvisible) {
    return null;
  }

  // const handleRouteCheckboxChange = (routeId, day) => {
  //   setSelectedRoutes((prevSelectedRoutes) => {
  //     const updatedRoutes = { ...prevSelectedRoutes };

  //     // Toggle the selected checkbox for the current route and day
  //     updatedRoutes[day] = { [routeId]: !updatedRoutes[day]?.[routeId] };

  //     return updatedRoutes;
  //   });
  // };

  const prepareDataForBackend = () => {
    const daysData = {};

    Object.keys(selectedRoutes).forEach((day) => {
      const routesForDay = Object.values(selectedRoutes[day]);
      if (routesForDay.some((isSelected) => isSelected)) {
        daysData[getDayNumber(day)] = Object.entries(selectedRoutes[day])
          .filter(([_, isSelected]) => isSelected)
          .map(([routeId, _]) => routeId)
          .join(",");
      }
    });

    return { days_routes: daysData };
  };

  const getDayNumber = (day) => {
    switch (day.toLowerCase()) {
      case "mon":
        return "1";
      case "tues":
        return "2";
      case "wen":
        return "3";
      case "truh":
        return "4";
      case "frid":
        return "5";
      default:
        return null;
    }
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   setSelectedImage(file);
  // };
  // const handleRouteChange = (e) => {
  //   setSelectedRoute(e.target.value);
  // };
  // const handleGroupChange = (e) => {
  //   setSelectedGroup(e.target.value);
  // };

  const handleCratesChange = (e) => {
    const value = e.target.value;
    setCrates(value);
    const isYes = value === "yes";
    setCratesSelected(isYes);
  };

  const handleVipChange = (e) => {
    const value = e.target.value;
    setVip(value);
    const isYes = value === "yes";
    setVipSelected(isYes);
  };

  const validateHourFormat = (input) => {
    return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(input) || input === "";
  };

  const handleStartHourChange = (e) => {
    const input = e.target.value;
    setStartHour(input);
    setError(validateHourFormat(input) ? "" : "Wrong time format");
  };

  const handleEndHourChange = (e) => {
    const input = e.target.value;
    setEndHour(input);
    setError(validateHourFormat(input) ? "" : "Wrong time format");
  };

  const handleBlur = () => {
    if (!validateHourFormat(startHour) || !validateHourFormat(endHour)) {
      setError("Both fields must be in valid time format");
    } else {
      setError("");
    }
  };

  const handleDropChange = (e) => {
    const inputValue = e.target.value;
    const newValue = inputValue <= 100 ? inputValue : 100;
    setDrop(newValue);
  };

  const clearStates = () => {
    setAccountNumber("");
    setAccountName("");
    setPostCode("");
    setAddressCustomer("");
    setSpecialInstructions("");
    setTelephoneCustomer("");
    setEmailCustomer("");
    setMarketingEmail("");
    setMainContact("");
    setAccountEmail("");
    setDrop("");
    // Reset crates and vip to their initial "unselected" state
    setCrates("");
    setVip("");
    // Reset selectedGroup to null which represents no group selected
    setSelectedGroup(null);
    // Reset routes to an empty object, assuming no routes are selected initially
    setSelectedRoutes({});
    setStartHour("");
    setEndHour("");
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
      group_id: selectedGroup,
      countries_indicative: user?.countries_indicactive,
    };
    const postDataAssign = {
      ...prepareDataForBackend(),
    };
    axios
      .post(createCustomer, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("🚀 ~ .then ~ response:", response);
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
              timer: 1500,
            });
            setUpdateCustomers(true);
            clearStates();
            onClose();
          })
          .catch((assignError) => {
            console.error("Error en la asignación del cliente: ", assignError);
          });
      })
      .catch((error) => {
        console.error("Error al agregar el nuevo cliente: ", error);
      });

    setUpdateCustomers(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[1100px] flex flex-col items-center  max-h-screen 2xl:h-hidden">
        <div className="overflow-y-auto ">
          <div className=" flex justify-end">
            <button
              className="text-dark-blue place-self-end "
              onClick={() => {
                setAccountName("");
                setEmailCustomer("");
                clearStates();
                onClose();
              }}
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <h1 className="text-2xl font-bold text-dark-blue mb-2 flex justify-center">
            New <span className="text-primary-blue">&nbsp;customer</span>
          </h1>

          <form className="text-left mt-8 " onSubmit={enviarData}>
            <div className="flex">
              <div className="flex flex-col  w-[50%]">
                <div className="flex items-center">
                  <label className="mr-2">
                    Account name: <span className="text-primary-blue">*</span>
                  </label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="Name"
                    maxLength={45}
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex mt-3 items-center">
                  <label className="mr-2">Email:</label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="your-email@grownetapp.com"
                    type="email"
                    value={emailCustomer}
                    maxLength={85}
                    onChange={(e) => setEmailCustomer(e.target.value)}
                  />
                </div>
                <div className="flex mt-3 items-center">
                  <label className="mr-2 w-[115px]">
                    Address: <span className="text-primary-blue">*</span>
                  </label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="Street 123"
                    type="text"
                    maxLength={100}
                    value={addressCustomer}
                    onChange={(e) => setAddressCustomer(e.target.value)}
                    required
                  />
                </div>
                <div className="flex mt-3 items-center">
                  <label className="mr-2">
                    Post code: <span className="text-primary-blue">*</span>
                  </label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="170001"
                    type="text"
                    maxLength={45}
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    required
                  />
                </div>
                <div className="flex mt-3 items-center">
                  <label className="mr-2">Main Contact:</label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="Your name"
                    type="text"
                    maxLength={100}
                    value={mainContact}
                    onChange={(e) => setMainContact(e.target.value)}
                  />
                </div>
                <div className="flex mt-3 items-center">
                  <label className="mr-2">VIP:</label>
                  <select
                    value={vip}
                    onChange={handleVipChange}
                    className="ml-2 border p-2 rounded-md w-full"
                  >
                    <option key="no" value="no">
                      No
                    </option>
                    <option key="yes" value="yes">
                      Yes
                    </option>
                  </select>
                  <label className="mx-2">Group:</label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="ml-2 border p-2 rounded-md w-full"
                  >
                    {groups &&
                      groups.map((group) => (
                        <>
                          <option key={group.id} value={group.id}>
                            {group.group}
                          </option>
                        </>
                      ))}
                  </select>
                </div>

                <div className="flex items-center mt-3">
                  <label className="mr-2">Special Instructions:</label>
                  <textarea
                    className="border p-3 rounded-md w-full h-[150px]"
                    placeholder="Special instructions"
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                  />
                </div>
              </div>
              <div className="ml-5 flex flex-col w-[50%] ">
                <div className="flex items-center mb-3">
                  <label className="mr-2">
                    Account number: <span className="text-primary-blue">*</span>
                  </label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="RK100"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-2">Marketing Email:</label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="your-email@grownetapp.com"
                    type="email"
                    value={marketingEmail}
                    onChange={(e) => setMarketingEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center mb-3 appearance-none">
                  <label className="mr-2">
                    Telephone number:{" "}
                    <span className="text-primary-blue">*</span>
                  </label>
                  <input
                    className="border p-3 rounded-md w-full hide-number-arrows"
                    placeholder="31383394455"
                    type="number"
                    value={telephoneCustomer}
                    onChange={(e) => setTelephoneCustomer(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-2">Drop:</label>
                  <input
                    className="border p-3 rounded-md w-full hide-number-arrows"
                    placeholder="557"
                    type="number"
                    maxLength={3}
                    value={drop}
                    onChange={handleDropChange}
                  />
                  <label className="mx-2">Crates:</label>
                  <select
                    value={crates}
                    onChange={handleCratesChange}
                    className="ml-2 border p-2 rounded-md w-full"
                  >
                    <option key="no" value="no">
                      No
                    </option>
                    <option key="yes" value="yes">
                      Yes
                    </option>
                  </select>
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-2">Account email:</label>
                  <input
                    className="border p-3 rounded-md w-full"
                    placeholder="your-email@grownetapp.com"
                    type="email"
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-2">
                    Delivery Window:{" "}
                    <span className="text-primary-blue">*</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      className="border p-3 rounded-md w-full"
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
                      className="border p-3 rounded-md w-full"
                      placeholder="hh:mm:ss"
                      type="text"
                      maxLength={8}
                      value={endHour}
                      onChange={handleEndHourChange}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <label className="mr-2">Route:</label>
                  <div className="flex flex-wrap border p-2 w-full rounded-lg ">
                    {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (
                      <div key={day} className="flex items-center my-1 w-[50%]">
                        <label className="mx-2">{day}:</label>
                        <select
                          value={selectedRoutes[day]}
                          onChange={(e) => {
                            const selectedRouteId = e.target.value;
                            setSelectedRoutes((prevSelectedRoutes) => ({
                              ...prevSelectedRoutes,
                              [day]: selectedRouteId,
                            }));
                          }}
                          className="ml-2 border rounded-md bg-white bg-clip-padding bg-no-repeat w-full border-gray-200 p-1 leading-tight focus:outline-none text-dark-blue hover:border-gray-300 duration-150 ease-in-out"
                        >
                          <option value="">Select route</option>
                          {routes.map((route) => (
                            <option key={route.id} value={route.id}>
                              {route.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-center ">
              <button
                type="submit"
                value="Submit"
                className={`bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 ${
                  isLoading === true ? "bg-gray-500/50" : ""
                }`}
                disabled={isLoading}
              >
                Add customer
              </button>
              <button
                onClick={() => {
                  clearStates();
                  onClose();
                }}
                className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default NewCustomer;
