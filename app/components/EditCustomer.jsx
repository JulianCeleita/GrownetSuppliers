"use client";
import {
  fetchCustomerDetail,
  fetchGroups,
  fetchRoutes,
} from "@/app/api/customerRequest";
import {
  assignCustomer,
  customerUpdate,
  disableCustomer,
} from "@/app/config/urls.config";
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
  const [startHour, setStartHour] = useState({ hour: "12", minute: "00" });
  const [endHour, setEndHour] = useState({ hour: "12", minute: "30" });
  const [error, setError] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState("");

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

      if (inicio !== "" && fin !== "") {
        const sHour = inicio.split(":");
        const eHour = fin.split(":");
        setStartHour({ hour: sHour[0], minute: Number(sHour[1]) < 30 ? "00" : "30" });
        setEndHour({ hour: eHour[0], minute: Number(eHour[1]) < 30 ? "00" : "30" });
      }

      const selectedRoutesData = {};
      detailCustomer[0].routes.forEach((route) => {
        const day = mapDayNumberToName(route.days_id);
        selectedRoutesData[day] = route.route_id.toString();
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
        return "Wed";
      case 4:
        return "Thur";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
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

    const allDays = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

    allDays.forEach((day) => {
      const dayNumber = getDayNumber(day.toLowerCase());
      daysData[dayNumber] = selectedRoutes[day] || "R100";
    });

    return { days_routes: daysData };
  };

  const getDayNumber = (day) => {
    const daysMap = {
      mon: "1",
      tues: "2",
      wed: "3",
      thur: "4",
      fri: "5",
      sat: "6",
    };

    return daysMap[day.toLowerCase()] || null;
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

  const handleDropChange = (e) => {
    const inputValue = e.target.value;
    const newValue = inputValue <= 100 ? inputValue : 100;
    setDrop(newValue);
  };

  const clearStates = () => {
    setDetailCustomer(null);
  };

  const enviarData = (e) => {
    e.preventDefault();
    const safeDropValue = drop === "" ? "0" : drop;
    const safeCratesValue = cratesSelected === "" ? "0" : cratesSelected;
    const safeVipValue = vipSelected === "" ? "0" : vipSelected;
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
      drop: safeDropValue,
      crates: safeCratesValue,
      vip: safeVipValue,
      delivery_window: `${startHour.hour + ':' + startHour.minute} - ${endHour.hour + ':' + endHour.minute}`,
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
            setUpdateCustomers(true);
            Swal.fire({
              customClass: {
                container: "fixed inset-0 flex items-center justify-center",
              },
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
    setUpdateCustomers(false);
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

  const handleHour = (event, start) => {
    if (start) {
      setStartHour(prev => ({ ...prev, hour: event.target.value }));
    } else {
      setEndHour(prev => ({ ...prev, hour: event.target.value }));
    }
  };

  const handleMinute = (event, start) => {
    if (start) {
      setStartHour(prev => ({ ...prev, minute: event.target.value }));
    } else {
      setEndHour(prev => ({ ...prev, minute: event.target.value }));
    }
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {token ? (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center font-poppins">
          <div className="bg-white p-8 rounded-2xl w-[1100px] 2xl:w-[900px] flex flex-col items-center 2xl:h-hidden max-h-screen">
            <div className="overflow-y-auto">
              {!isLoading && (
                <div className="flex justify-end">
                  <button
                    className="text-dark-blue place-self-end  flex justify-end"
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
              )}

              <h1 className="text-2xl font-bold text-dark-blue mb-2 flex justify-center">
                Edit <span className="text-primary-blue">&nbsp;customer</span>
              </h1>
              {isLoading ? (
                <div className="flex justify-center items-center mb-20">
                  <div class="loader"></div>
                </div>
              ) : (
                <form className="text-left mt-6" onSubmit={enviarData}>
                  <div className="flex">
                    <div className="flex flex-col  w-[50%]">
                      <div className="flex items-center">
                        <label className="mr-2">
                          Account name:{" "}
                          <span className="text-primary-blue">*</span>
                        </label>
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
                          placeholder="your-email@grownetapp.com"
                          type="email"
                          value={emailCustomer}
                          onChange={(e) => setEmailCustomer(e.target.value)}
                        />
                      </div>
                      <div className="flex mt-3 items-center">
                        <label className="mr-2 w-[115px]">
                          Address: <span className="text-primary-blue">*</span>
                        </label>
                        <input
                          className="border p-3 rounded-md w-full"
                          placeholder="Street 1234"
                          type="text"
                          value={addressCustomer}
                          onChange={(e) => setAddressCustomer(e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex mt-3 items-center">
                        <label className="mr-2">
                          Post code:{" "}
                          <span className="text-primary-blue">*</span>
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
                                <option key={group.id} value={group.id}>
                                  {group.group}
                                </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex items-center mt-3 ">
                        <label className="mr-2">Special Instructions:</label>
                        <textarea
                          className="border p-3 rounded-md w-full h-[150px]"
                          placeholder="Special instructions"
                          type="text"
                          value={specialInstructions}
                          onChange={(e) =>
                            setSpecialInstructions(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="ml-5 flex flex-col w-[50%] ">
                      <div className="flex items-center mb-3">
                        <label className="mr-2">
                          Account number:{" "}
                          <span className="text-primary-blue">*</span>
                        </label>
                        <input
                          className="border p-3 rounded-md w-full"
                          placeholder="RK100"
                          type="text"
                          value={accountNumber}
                          readOnly
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
                      <div className="flex items-center mb-3">
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
                        <div className="flex items-center w-full">
                          <div className="border p-3 rounded-md w-full flex justify-center gap-3" >
                            <select value={startHour.hour} onChange={(value) => handleHour(value, true)} required>
                              {Array.from({ length: 24 }, (_, i) => i).map((i) => (
                                <option key={i} value={i}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            :
                            <select value={startHour.minute} onChange={(value) => handleMinute(value, true)} required>
                              <option value="00">00</option>
                              <option value="30">30</option>
                            </select>
                          </div>
                          <span className="mx-3">-</span>
                          <div className="border p-3 rounded-md w-full flex justify-center gap-3" >
                            <select value={endHour.hour} onChange={(value) => handleHour(value, false)} required>
                              {Array.from({ length: 24 }, (_, i) => i).map((i) => (
                                <option key={i} value={i}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            :
                            <select value={endHour.minute} onChange={(value) => handleMinute(value, false)} required>
                              <option value="00">00</option>
                              <option value="30">30</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        <label className="mr-2 w-[90px]">
                          Route: <span className="text-primary-blue">*</span>
                        </label>
                        <div className="grid grid-cols-2 border p-2 w-full rounded-lg">
                          {["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"].map((day) => (

                            <div key={day} className="flex flex-col my-1 items-center">

                              <div className="flex items-center w-full">
                                <label className="mx-2 w-[90px]">{day}:</label>
                                <select
                                  className="border rounded-md bg-white bg-clip-padding bg-no-repeat border-gray-200 p-1 leading-tight focus:outline-none text-dark-blue hover:border-gray-300 duration-150 ease-in-out w-[100px]"
                                  value={selectedRoutes[day]?.toString() || ""}
                                  onChange={(e) => {
                                    const selectedRouteId = e.target.value;
                                    setSelectedRoutes((prevSelectedRoutes) => ({
                                      ...prevSelectedRoutes,
                                      [day]: selectedRouteId,
                                    }));
                                  }}
                                >
                                  <option value="">R100</option>
                                  {routes.map((route) => (
                                    <option key={route.id} value={route.id.toString()}>
                                      {route.name}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  placeholder="# Drop"
                                  className="border rounded-md bg-white border-gray-200 p-1 text-dark-blue w-full ml-2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 text-center flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteModal(true);
                      }}
                      className="flex bg-danger py-3 px-4 rounded-lg text-white font-medium mr-3"
                    >
                      <TrashIcon className="h-6 w-6 mr-1" />
                      Delete
                    </button>
                    <button
                      type="submit"
                      value="Submit"
                      className={`bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 ${isLoading === true ? "bg-gray-500/50" : ""
                        }`}
                      disabled={isLoading}
                    >
                      Save changes
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
