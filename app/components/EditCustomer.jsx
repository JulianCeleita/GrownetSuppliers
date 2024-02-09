"use client";
import {
  fetchCustomerDetail,
  fetchGroups,
  fetchRoutes,
} from "@/app/api/customerRequest";
import { assignCustomer, customerUpdate, disableCustomer } from "@/app/config/urls.config";
import RootLayout from "@/app/layout";
import useTokenStore from "@/app/store/useTokenStore";
import useUserStore from "@/app/store/useUserStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ModalDelete from "./ModalDelete";

const CustomerDetailPage = ({
  isvisible,
  onClose,
  customer,
  setUpdateCustomers,
}) => {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const { token } = useTokenStore();
  const { user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [detailCustomer, setDetailCustomer] = useState();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [emailCustomer, setEmailCustomer] = useState("");
  const [marketingEmail, setMarketingEmail] = useState("");
  const [addressCustomer, setAddressCustomer] = useState("");
  const [telephoneCustomer, setTelephoneCustomer] = useState("");
  const [postCode, setPostCode] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [mainContact, setMainContact] = useState("");
  const [countriesIndicative, setCountriesIndicative] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [drop, setDrop] = useState("");
  const [crates, setCrates] = useState("");
  const [cratesSelected, setCratesSelected] = useState("");
  const [vip, setVip] = useState("");
  const [vipSelected, setVipSelected] = useState("");
  const [deliveryWindow, setDeliveryWindow] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [startHour, setStartHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [error, setError] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState("")

  const customerId = customer?.accountNumber;

  useEffect(() => {
    if (isvisible) {
      setIsLoading(true);
      fetchCustomerDetail(token, setDetailCustomer, setIsLoading, customerId);
      fetchRoutes(token, user, setRoutes, setIsLoading);
      fetchGroups(token, user, setGroups, setIsLoading);
    }
  }, [isvisible, customerId, token, user]);

  useEffect(() => {
    if (!isvisible) {
      setDetailCustomer(undefined);
      setAccountNumber("");
      setAccountName("");
    }
  }, [isvisible]);

  useEffect(() => {
    if (detailCustomer && detailCustomer.length > 0) {
      setAccountNumber(detailCustomer[0]?.accountNumber);
      setAccountName(detailCustomer[0]?.accountName);
      setEmailCustomer(detailCustomer[0]?.email);
      setCountriesIndicative(detailCustomer[0]?.countries_indicative);
      setMarketingEmail(detailCustomer[0]?.marketing_email);
      setAddressCustomer(detailCustomer[0]?.address);
      setTelephoneCustomer(detailCustomer[0]?.telephone);
      setPostCode(detailCustomer[0]?.postCode);
      setSpecialInstructions(detailCustomer[0]?.specialInstructions);
      setMainContact(detailCustomer[0]?.main_contact);
      setAccountEmail(detailCustomer[0]?.account_email);
      setDrop(detailCustomer[0]?.drop);
      setDeliveryWindow(detailCustomer[0]?.delivery_window);
      setCrates(detailCustomer[0]?.crates === 1 ? "yes" : "no");
      setVip(detailCustomer[0]?.vip === 1 ? "yes" : "no");
      setCratesSelected(detailCustomer[0]?.crates);
      setVipSelected(detailCustomer[0]?.vip);
      setSelectedGroup(detailCustomer[0]?.group_id);
      setRouteName(detailCustomer[0]?.route);
      setGroupName(detailCustomer[0]?.group);
      const { inicio, fin } = extraerHoras(
        detailCustomer[0]?.delivery_window || ""
      );
      setStartHour(inicio);
      setEndHour(fin);
      const selectedRoutesData = {};
      detailCustomer[0].routes.forEach((route) => {
        const day = mapDayNumberToName(route.days_id);
        const routeId = route.route_id.toString();

        if (!selectedRoutesData[day]) {
          selectedRoutesData[day] = {};
        }
        selectedRoutesData[day][routeId] = true;
      });

      setSelectedRoutes(selectedRoutesData);
    }
  }, [detailCustomer]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!isvisible) {
    return null;
  }

  const mapDayNumberToName = (dayNumber) => {
    switch (dayNumber) {
      case 1:
        return "Mon";
      case 2:
        return "Tues";
      case 3:
        return "Wen";
      case 4:
        return "Truh";
      case 5:
        return "Frid";
      default:
        return "";
    }
  };
  const extraerHoras = (deliveryWindow) => {
    const [inicio, fin] = deliveryWindow.split(" - ");
    return { inicio, fin };
  };

  const handleRouteCheckboxChange = (routeId, day) => {
    setSelectedRoutes((prevSelectedRoutes) => {
      const updatedRoutes = { ...prevSelectedRoutes };

      updatedRoutes[day] = { [routeId]: !updatedRoutes[day]?.[routeId] };

      return updatedRoutes;
    });
  };

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

    return { customer: customerId, days_routes: daysData };
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

  const handleRouteChange = (e) => {
    setSelectedRoute(e.target.value);
  };
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
  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const validateHourFormat = (input) => {
    return /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(input) || input === "";
  };

  const handleStartHourChange = (e) => {
    const input = e.target.value;
    setStartHour(input);
    setError(validateHourFormat(input) ? "" : "Formato de hora incorrecto");
  };

  const handleEndHourChange = (e) => {
    const input = e.target.value;
    setEndHour(input);
    setError(validateHourFormat(input) ? "" : "Formato de hora incorrecto");
  };

  const handleBlur = () => {
    if (!validateHourFormat(startHour) || !validateHourFormat(endHour)) {
      setError("Ambos campos deben tener un formato de hora válido");
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
    setDetailCustomer(null);
  }

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
      countries_indicative: countriesIndicative,
      stateCustomer_id: 1,
      image: "",
      main_contact: mainContact,
      account_email: accountEmail,
      drop: drop,
      crates: cratesSelected,
      vip: vipSelected,
      delivery_window: `${startHour} - ${endHour}`,
      group_id: selectedGroup,
    };
    const postDataAssign = {
      customer: customerId,
      ...prepareDataForBackend(),
    };
    axios
      .post(`${customerUpdate}${customerId}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        axios
          .post(assignCustomer, postDataAssign, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((assignResponse) => {
            console.log("🚀 ~ .then ~ edited:")
            setUpdateCustomers(true);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Client edited successfully",
              showConfirmButton: false,
              timer: 1500,
            });
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
  };

  const handleDeleteCustomer = (customerId) => {
    const id = customerId;
    axios
      .post(`${disableCustomer}${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUpdateCustomers(true);
        setShowDeleteModal(false);
        clearStates();
        onClose();
      })
      .catch((error) => {
        console.error("Error al eliminar la presentación:", error);
      });
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {token ? (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center font-poppins">
          <div className="bg-white p-8 rounded-2xl w-[900px] flex flex-col items-center overflow-y-auto max-h-screen">
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
            <h1 className="text-2xl font-bold text-dark-blue mb-2">
              Edit <span className="text-primary-blue">customer</span>
            </h1>
            {isLoading ? (
              <div className="flex justify-center items-center mb-20">
                <div class="loader"></div>
              </div>
            ) : (

              <form className="text-left " onSubmit={enviarData}>
                <div className="flex">
                  <div className="flex flex-col  w-[50%]">
                    <div className="flex items-center">
                      <label className="mr-2">Account name:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="Name"
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex mt-3 items-center">
                      <label className="mr-2">Email:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="test@grownet.com"
                        type="email"
                        value={emailCustomer}
                        onChange={(e) => setEmailCustomer(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex mt-3 items-center">
                      <label className="mr-2">Address:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="test@grownet.com"
                        type="text"
                        value={addressCustomer}
                        onChange={(e) => setAddressCustomer(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex mt-3 items-center">
                      <label className="mr-2">Post code:</label>
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
                        required
                      />
                    </div>
                    <div className="flex mt-3 items-center">
                      <label className="mr-2">Drop:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="5"
                        type="number"
                        maxLength={3}
                        value={drop}
                        onChange={handleDropChange}
                        required
                      />
                    </div>
                    <div className="flex mt-3 items-center">
                      <label className="mr-2">VIP:</label>
                      <select
                        value={vip}
                        onChange={handleVipChange}
                        className="ml-2 border p-2 rounded-md w-full"
                      >
                        <option value="">Select Option</option>
                        <option key="yes" value="yes">
                          Yes
                        </option>
                        <option key="no" value="no">
                          No
                        </option>
                      </select>
                    </div>
                    <div className="flex mt-3 items-center">
                      <label className="mr-2">Group:</label>
                      <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="ml-2 border p-2 rounded-md w-full"
                      >
                        <option value="">Select Group</option>
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
                  </div>
                  <div className="ml-5 flex flex-col w-[50%] ">
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Account number:</label>
                      <input
                        className="border p-3 rounded-md"
                        placeholder="RK100"
                        type="text"
                        value={accountNumber}
                        readOnly
                        required
                      />
                    </div>
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Marketing Email:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="test_marketing@grownet.com"
                        type="email"
                        value={marketingEmail}
                        onChange={(e) => setMarketingEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Telephone number:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="31383394455"
                        type="number"
                        value={telephoneCustomer}
                        onChange={(e) => setTelephoneCustomer(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Special Instructions:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="Special instructions"
                        type="text"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Account email:</label>
                      <input
                        className="border p-3 rounded-md w-full"
                        placeholder="suppliers@grownet.com"
                        type="email"
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Crates:</label>
                      <select
                        value={crates}
                        onChange={handleCratesChange}
                        className="ml-2 border p-2 rounded-md w-full"
                      >
                        <option value="">Select Option</option>
                        <option key="yes" value="yes">
                          Yes
                        </option>
                        <option key="no" value="no">
                          No
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Delivery Window:</label>
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
                    <div className="flex items-center mb-4">
                      <label className="mr-2">Routes:</label>
                      <table className="ml-2 border p-2 rounded-md">
                        <thead>
                          <tr>
                            <th></th>
                            {routes.map((route) => (
                              <th className="p-1" key={route.id}>
                                {route.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {["Mon", "Tues", "Wen", "Truh", "Frid"].map((day) => (
                            <tr key={day}>
                              <td>{day}</td>
                              {routes.map((route) => (
                                <td key={route.id}>
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedRoutes[day]?.[route.id] || false
                                    }
                                    onChange={() =>
                                      handleRouteCheckboxChange(route.id, day)
                                    }
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                    className="flex text-primary-blue font-medium hover:scale-110 hover:text-danger hover:border-danger"
                  >
                    <TrashIcon className="h-6 w-6 mr-1" />
                    Delete
                  </button>
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
            )}
          </div>
          <ModalDelete
            isvisible={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={() => handleDeleteCustomer(customerId)}
          />
        </div>
      ) : (
        <RootLayout></RootLayout>
      )}
    </>
  );
};
export default CustomerDetailPage;
