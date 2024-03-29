import useUserStore from "@/app/store/useUserStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchGroups, fetchRoutes } from "../api/customerRequest";
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
  const [referenceCustomer, setReferenceCustomer] = useState("");
  const [postCode, setPostCode] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [mainContact, setMainContact] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [drop, setDrop] = useState("");
  const [crates, setCrates] = useState(false);
  const [cratesSelected, setCratesSelected] = useState("");
  const [vip, setVip] = useState(false);
  const [vipSelected, setVipSelected] = useState("");
  const [routes, setRoutes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(1);
  const { user, setUser } = useUserStore();
  const [startHour, setStartHour] = useState({ hour: "12", minute: "00" });
  const [endHour, setEndHour] = useState({ hour: "12", minute: "30" });
  const [error, setError] = useState("");
  const [selectedRoutes, setSelectedRoutes] = useState({});
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchRoutes(token, user, setRoutes, setIsLoading);
    fetchGroups(token, user, setGroups, setIsLoading);
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      const directGroup = groups.find((group) => group.group === "Direct");
      if (directGroup) {
        setSelectedGroup(directGroup.id);
      }
    }
  }, [groups]);

  if (!isvisible) {
    return null;
  }

  const prepareDataForBackend = () => {
    const allDays = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

    const daysRoutesArray = allDays.map((day) => {
      const routeInfo = selectedRoutes[day];

      const routeData = {
        route_id: routeInfo?.routeId || "12",
        drop: routeInfo?.drop || 0,
        days_id: getDayNumber(day.toLowerCase()),
      };

      return routeData;
    });

    return { days_routes: daysRoutesArray };
  };

  const handleRouteAndDropSelection = (day, routeId, dropValue) => {
    if (dropValue === "") {
      setSelectedRoutes((prevRoutes) => ({
        ...prevRoutes,
        [day]: {
          routeId: routeId || "12",
          drop: "",
        },
      }));
      return;
    }

    const numericDropValue = parseInt(dropValue, 10);
    const validatedDropValue = !isNaN(numericDropValue)
      ? Math.max(-1, Math.min(100, numericDropValue))
      : "";

    setSelectedRoutes((prevRoutes) => ({
      ...prevRoutes,
      [day]: {
        routeId: routeId || "12",
        drop: validatedDropValue.toString() || prevRoutes[day]?.drop || "",
      },
    }));
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
    setCrates("");
    setVip("");
    setSelectedGroup(1);
    setSelectedRoutes({});
    setStartHour({ hour: "12", minute: "00" });
    setEndHour({ hour: "12", minute: "30" });
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
      stateCustomer_id: 1,
      image: "",
      main_contact: mainContact,
      account_email: accountEmail,
      drop: safeDropValue,
      crates: safeCratesValue,
      ext_account_ref: referenceCustomer,
      vip: safeVipValue,
      delivery_window: `${startHour.hour + ":" + startHour.minute} - ${
        endHour.hour + ":" + endHour.minute
      }`,
      group_id: selectedGroup,
      countries_indicative: user?.country_indicative,
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

  const handleHour = (event, start) => {
    if (start) {
      setStartHour((prev) => ({ ...prev, hour: event.target.value }));
    } else {
      setEndHour((prev) => ({ ...prev, hour: event.target.value }));
    }
  };

  const handleMinute = (event, start) => {
    if (start) {
      setStartHour((prev) => ({ ...prev, minute: event.target.value }));
    } else {
      setEndHour((prev) => ({ ...prev, minute: event.target.value }));
    }
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
                    <option key="no" value={0}>
                      No
                    </option>
                    <option key="yes" value={1}>
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
                  <label className="mr-2">External customer reference: </label>
                  <input
                    type="text"
                    className="border p-3 rounded-md w-full hide-number-arrows"
                    placeholder="Reference"
                    value={referenceCustomer}
                    onChange={(e) => setReferenceCustomer(e.target.value)}
                  />
                  <label className="mx-2">Crates:</label>
                  <select
                    value={crates}
                    onChange={handleCratesChange}
                    className="ml-2 border p-2 rounded-md w-full"
                  >
                    <option key="no" value={0}>
                      No
                    </option>
                    <option key="yes" value={1}>
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
                    <div className="border p-3 rounded-md w-full flex justify-center gap-3">
                      <select
                        value={startHour.hour}
                        onChange={(value) => handleHour(value, true)}
                        required
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      :
                      <select
                        value={startHour.minute}
                        onChange={(value) => handleMinute(value, true)}
                        required
                      >
                        <option value="00">00</option>
                        <option value="30">30</option>
                      </select>
                    </div>
                    <span className="mx-3">-</span>
                    <div className="border p-3 rounded-md w-full flex justify-center gap-3">
                      <select
                        value={endHour.hour}
                        onChange={(value) => handleHour(value, false)}
                        required
                      >
                        {Array.from({ length: 24 }, (_, i) => i).map((i) => (
                          <option key={i} value={i}>
                            {i.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      :
                      <select
                        value={endHour.minute}
                        onChange={(value) => handleMinute(value, false)}
                        required
                      >
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
                      <div
                        key={day}
                        className="flex flex-col my-1 items-center"
                      >
                        <div className="flex items-center w-full">
                          <label className="mx-2 w-[90px]">{day}:</label>
                          <select
                            className="border rounded-md bg-white bg-clip-padding bg-no-repeat border-gray-200 p-1 leading-tight focus:outline-none text-dark-blue hover:border-gray-300 duration-150 ease-in-out w-[100px]"
                            value={selectedRoutes[day]?.routeId || ""}
                            onChange={(e) => {
                              const selectedRouteId = e.target.value;
                              const dropValue = selectedRoutes[day]?.drop || "";
                              handleRouteAndDropSelection(
                                day,
                                selectedRouteId,
                                dropValue
                              );
                            }}
                          >
                            <option value="">R100</option>
                            {routes.map((route) => (
                              <option key={route.id} value={route.id}>
                                {route.name}
                              </option>
                            ))}
                          </select>
                          <input
                            placeholder="# Drop"
                            className="border rounded-md bg-white border-gray-200 p-1 text-dark-blue w-full ml-2"
                            value={selectedRoutes[day]?.drop || ""}
                            onChange={(e) =>
                              handleRouteAndDropSelection(
                                day,
                                selectedRoutes[day]?.routeId,
                                e.target.value
                              )
                            }
                          />
                        </div>
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
