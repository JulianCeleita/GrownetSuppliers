"use client";
import {
  fetchCustomerDetail,
  fetchGroups,
  fetchRoutes,
} from "@/app/api/customerRequest";
import { assignCustomer, customerUpdate } from "@/app/config/urls.config";
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

const CustomerDetailPage = () => {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const { token, setToken } = useTokenStore();
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

  const params = useParams();

  let customerId;
  if (params) {
    customerId = params.customerId;
  }

  useEffect(() => {
          fetchCustomerDetail(
            token,
            setDetailCustomer,
            setIsLoading,
            customerId
          );
          fetchRoutes(token, user, setRoutes, setIsLoading);
          fetchGroups(token, user, setGroups, setIsLoading);
  }, [customerId, setDetailCustomer]);

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
      const { start, end } = handleGetHours(
        detailCustomer[0]?.delivery_window || ""
      );
      setStartHour(start);
      setEndHour(end);
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

  const mapDayNumberToName = (dayNumber) => {
    switch (dayNumber) {
      case 1:
        return "monday";
      case 2:
        return "tuesday";
      case 3:
        return "wednesday";
      case 4:
        return "thursday";
      case 5:
        return "friday";
      default:
        return "";
    }
  };
  const handleGetHours = (deliveryWindow) => {
    const [start, end] = deliveryWindow.split(" - ");
    return { start, end };
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
      case "monday":
        return "1";
      case "tuesday":
        return "2";
      case "wednesday":
        return "3";
      case "thursday":
        return "4";
      case "friday":
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
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Client created successfully",
              showConfirmButton: false,
              timer: 1500,
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

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      {token ? (
        <Layout>
          <div className="flex justify-between p-8 bg-primary-blue">
            <Link
              className="flex bg-dark-blue py-3 px-4 rounded-lg text-white font-medium transition-all hover:scale-110 "
              href="/customers"
            >
              <ArrowLeftIcon className="w-5 h-5 mt-0.5 mr-1 inline-block" />{" "}
              Customers
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center">
            {isLoading && (
              <div className="flex justify-center items-center mb-20">
                <div className="loader"></div>
              </div>
            )}
            {!isLoading && (
              <form
                className="text-left mt-10 w-[80%] mb-20"
                onSubmit={enviarData}
              >
                <div className="flex items-center justify-center">
                  <h1 className="text-2xl font-bold text-dark-blue mb-2">
                    Edit <span className="text-primary-blue"></span>
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
                    <h4 className="underline decoration-2 decoration-green">
                      {accountNumber}
                    </h4>
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
                      <option key="yes" value="yes">
                        Yes
                      </option>
                      <option key="no" value="no">
                        No
                      </option>
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
                      {groups &&
                        groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.group}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex items-center mb-4">
                    <label className="mr-2">Routes:</label>
                    <table className="ml-2 border p-2 rounded-md">
                      <thead></thead>
                      <tbody>
                        {[
                          "monday",
                          "tuesday",
                          "wednesday",
                          "thursday",
                          "friday",
                        ].map((day) => (
                          <tr key={day}>
                            <td>{day}</td>
                            {routes.map((route) => (
                              <td key={route.id}>
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedRoutes[day]?.[route.id] || false
                                  }
                                  onChange={() => {
                                    handleRouteCheckboxChange(route.id, day);
                                  }}
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
                    className={`bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 ${
                      isLoading === true ? "bg-gray-500/50" : ""
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
            )}
          </div>
        </Layout>
      ) : (
        <RootLayout></RootLayout>
      )}
    </>
  );
};
export default CustomerDetailPage;
