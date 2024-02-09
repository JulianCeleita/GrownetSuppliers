"use client";
import { PlusCircleIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { fetchOrders, fetchOrdersSupplier } from "../api/ordersRequest";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import { CircleProgressBar } from "../components/CircleProgressBar";
import useWorkDateStore from "../store/useWorkDateStore";
import usePercentageStore from "../store/usePercentageStore";

const formatDate = (dateString) => {
  const formattedDate = format(new Date(dateString), "yyyy-MM-dd");
  return formattedDate;
};
export const customStyles = {
  placeholder: (provided) => ({
    ...provided,
    color: "dark-blue",
  }),
  control: (base) => ({
    ...base,
    border: 0,
    boxShadow: "none",
    "&:hover": {
      border: 0,
    },
  }),
};
// TODO: revisar por qué se dañó la filtración por fechas y calendario
const OrderView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const { routePercentages, setRoutePercentages, setFetchRoutePercentages } =
    usePercentageStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const { user, setUser } = useUserStore();
  const [dateFilter, setDateFilter] = useState("today");
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedRoute, setSelectedRoute] = useState("");
  const [filterType, setFilterType] = useState("range");
  const [showPercentage, setShowPercentage] = useState(null);

  const formatDateToShow = (dateString) => {
    if (!dateString) return "Loading...";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (user && user.rol_name === "AdminGrownet") {
      fetchOrders(token, setOrders, setIsLoading);
    } else {
      fetchOrdersSupplier(token, user, setOrders, setIsLoading);
    }

    const handleOutsideClick = (e) => {
      if (showDatePicker && !e.target.closest(".react-datepicker")) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [user, token, showDatePicker]);

  useEffect(() => {
    setFetchWorkDate(token, user.id_supplier);
  }, [user]);

  useEffect(() => {
    if (routePercentages) {
      const result = routePercentages.find(
        (item) => item.nameRoute === selectedRoute
      );
      if (result) {
        setShowPercentage(
          result.percentage_loading > 0
            ? result.percentage_loading
            : result.percentage_packing
        );
      } else {
        setShowPercentage(null);
      }
    }
  }, [routePercentages]);

  const subtractDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };

  const filterOrdersByDate = (order) => {
    if (showAllOrders) {
      return true;
    }

    const deliveryDate = new Date(order.date_delivery);
    deliveryDate.setHours(0, 0, 0, 0);

    if (dateFilter === "today") {
      const workDateFormatted = new Date(workDate);
      return isSameDay(deliveryDate, workDateFormatted);
    }
    if (dateFilter === "range" && startDate && endDate) {
      const start = new Date(startDate);
      const startFormatted = subtractDays(start, 1);
      startFormatted.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      const endFormatted = subtractDays(end, 1);
      endFormatted.setHours(23, 59, 59, 999);
      return deliveryDate >= startFormatted && deliveryDate <= endFormatted;
    }

    return false;
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const handleDateChange = (date) => {
    setShowAllOrders(false);
    setShowDatePicker(false);
    setSelectedDate(date);
  };

  const goToOrder = (e, order) => {
    e.preventDefault();
    router.push(`/order/${order.reference}`, undefined, {
      shallow: true,
    });
  };

  const handleOrderSelect = (order, checked) => {
    setSelectedOrders((prevState) => ({
      ...prevState,
      [order.reference]: checked,
    }));
  };

  const selectAll = (checked) => {
    const newSelectedOrders = {};
    sortedOrders.forEach((order) => {
      newSelectedOrders[order.reference] = checked;
    });
    setSelectedOrders(newSelectedOrders);
  };

  const printOrders = () => {
    const ordersToPrint = Object.entries(selectedOrders)
      .filter(([reference, checked]) => checked)
      .map(([reference]) => reference);

    //TODO: implementar lógica para imprimir las ordenes seleccionadas
  };

  const sortedOrders = orders
    .filter((order) => filterOrdersByDate(order))
    .sort((a, b) => {
      const dateA = new Date(a.date_delivery);
      const dateB = new Date(b.date_delivery);
      return dateA - dateB;
    });

  const uniqueRoutesArray = [
    ...new Set(sortedOrders.map((order) => order.route)),
  ];

  const options = [
    { value: "", label: "All routes" },
    ...uniqueRoutesArray.map((route) => ({ value: route, label: route })),
  ];

  const getPercentages = async (value) => {
    if (value !== "" || value !== null || value !== undefined) {
      await setFetchRoutePercentages(token, workDate);
    }
  };

  const handleRouteSelection = async (option) => {
    setSelectedRoute(option.value);
    await getPercentages(option.value);
  };

  const filteredOrders = selectedRoute
    ? sortedOrders.filter(
        (order) => order.route.toLowerCase() === selectedRoute.toLowerCase()
      )
    : sortedOrders;

  const statusColorClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green";
      case "Dispute":
        return "bg-red-500";
      case "Generated":
        return "bg-orange-500";
      case "Preparing":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Layout>
      <div className="-mt-24">
        <div className="flex gap-6 p-8">
          <h1 className="text-2xl text-light-green font-semibold mt-1 ml-24">
            Orders <span className="text-white">list</span>
          </h1>
          <Link
            className="flex bg-green py-3 px-4 rounded-full text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
            href="/orders/create-order"
          >
            <PlusCircleIcon className="h-6 w-6 mr-1" /> New Order
          </Link>
        </div>
        <div className="flex ml-24 mb-3 items-center space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select px-4 py-3 rounded-md border border-gray-300"
          >
            <option value="range">Filter by range</option>
            <option value="date">Filter per date</option>
          </select>
          {filterType === "range" && (
            <>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setEndDate((currentEndDate) => {
                    if (date && currentEndDate) {
                      setDateFilter("range");
                    }
                    return currentEndDate;
                  });
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-input px-4 py-3 rounded-md border border-gray-300"
                placeholderText="mm/dd/yyyy"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  setStartDate((currentStartDate) => {
                    if (currentStartDate && date) {
                      setDateFilter("range");
                    }
                    return currentStartDate;
                  });
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-input px-4 py-3 rounded-md border border-gray-300"
                placeholderText="mm/dd/yyyy"
              />
            </>
          )}

          {filterType === "date" && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setStartDate(date);
                setEndDate(date);
                setDateFilter("range");
              }}
              className="form-input px-4 py-3 rounded-md border border-gray-300"
              placeholderText="Select a date"
            />
          )}
          <div className=" px-3 py-[0.3em] rounded-md border border-gray-300">
            <Select
              options={options}
              onChange={handleRouteSelection}
              placeholder="Select route"
              placeholderText
              styles={customStyles}
              className="text-dark-blue"
            />
          </div>
          <button
            className="flex bg-primary-blue text-white py-3 px-4 rounded-full font-medium transition-all cursor-pointer hover:bg-dark-blue hover:scale-110"
            onClick={() => printOrders()}
          >
            <PrinterIcon className="h-6 w-6" />
          </button>
        </div>
        <section className="fixed top-0 right-10 mt-8">
          <div className="flex gap-4">
            <div className="grid grid-cols-3 px-1 py-3 shadow-sm rounded-3xl shadow-slate-400 bg-white">
              <div className="col-span-2">
                <h1 className="flex text-xl font-bold items-center justify-center text-black">
                  Today
                </h1>
                <div className="grid grid-cols-2 pl-2 justify-center text-center">
                  <div className="flex items-center justify-end pr-1">
                    <p className="text-5xl font-bold text-primary-blue">20</p>
                  </div>
                  <div className="grid grid-cols-1 text-left">
                    <h2 className="text-sm text-black px-1 font-semibold">
                      Orders
                    </h2>
                    <h2 className="flex items-center text-green-500 text-center px-2 rounded-full text-sm bg-light-green text-dark-green">
                      {formatDateToShow(workDate)}
                    </h2>
                  </div>
                </div>
              </div>
              {/* TODO AGREGAR EN ESTE DIV EL PORCENTAJE DE LOADING PARA RUTA SELECCIONADA */}
              <div className="flex col-span-1 items-center justify-center">
                {showPercentage === null ? (
                  <div className="flex items-center justify-center bg-primary-blue rounded-full w-16 h-16">
                    <img
                      src="./loadingBlanco.png"
                      alt="Percent"
                      className="w-10 h-7"
                    />
                  </div>
                ) : (
                  <CircleProgressBar percentage={showPercentage} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 px-3 py-3 items-center justify-center shadow-sm rounded-3xl bg-white shadow-slate-400">
              <div>
                <h1 className="flex text-xl font-bold items-center justify-center text-black">
                  Total net
                </h1>
                <div className="flex justify-center text-center">
                  <div className="flex items-center">
                    <p className="text-4xl font-bold text-primary-blue">
                      £1,000
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-l border-gray-400">
                <h1 className="flex text-xl font-bold items-center justify-center text-black">
                  Profit
                </h1>
                <div className="flex justify-center text-center">
                  <div>
                    <p className="text-4xl font-bold text-primary-blue">18%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-center mb-20  p-2">
          <table className="w-[90%] bg-white first-line:bg-white rounded-2xl text-center shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0  shadow-[0px_11px_15px_-3px_#edf2f7]">
              <tr className="  text-dark-blue">
                <th className="py-4 flex items-center justify-center rounded-tl-lg">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-blue-500"
                      onChange={(e) => selectAll(e.target.checked)}
                    />
                  </label>
                </th>
                <th className="py-4"># Invoice</th>
                <th className="py-4">Customer</th>
                <th className="py-4">Amount</th>
                <th className="py-4">Profit %</th>
                <th className="py-4">Route</th>
                <th className="py-4">Responsable</th>
                <th className="py-4">Delivery date</th>
                <th className="py-4 rounded-tr-lg">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index} className="text-dark-blue border-b-[1.5px]">
                  <td className="py-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-500"
                        checked={!!selectedOrders[order.reference]}
                        onChange={(e) =>
                          handleOrderSelect(order, e.target.checked)
                        }
                      />
                    </label>
                  </td>
                  <td className="py-4">#5</td>
                  <td
                    className="py-4 cursor-pointer hover:bg-light-blue"
                    onClick={(e) => goToOrder(e, order)}
                  >
                    {order.accountName}
                  </td>
                  <td className="py-4">Amount</td>
                  <td className="py-4">10%</td>
                  <td className="py-4">{order.route}</td>
                  <td className="py-4">Santiago Arango</td>
                  <td className="py-4">{order.date_delivery}</td>
                  <td className="py-4 flex gap-2 justify-center">
                    <div
                      className={`inline-block mt-1 rounded-full text-white ${statusColorClass(
                        order.name_status
                      )} w-3 h-3 flex items-center justify-center`}
                    ></div>
                    {order.name_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default OrderView;
