"use client";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  countOrdersForDate,
  fetchOrders,
  fetchOrdersSupplier,
} from "../api/ordersRequest";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

const formatDate = (dateString) => {
  const formattedDate = format(new Date(dateString), "yyyy-MM-dd");
  return formattedDate;
};
// TODO: revisar por qué se dañó la filtración por fechas y calendario
const OrderView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
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

  const [filterType, setFilterType] = useState('range');

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
      const today = subtractDays(new Date(), 1);
      return isSameDay(deliveryDate, today);
    }
    if (dateFilter === "range" && startDate && endDate) {
      const start = new Date(startDate);
      const startFormatted = subtractDays(start, 1);
      startFormatted.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      const endFormatted = subtractDays(end, 1)
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
  }

  const handleOrderSelect = (order, checked) => {
    setSelectedOrders(prevState => ({
      ...prevState,
      [order.reference]: checked
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

    console.log('ordersToPrint', ordersToPrint);
    //TODO: implementar lógica para imprimir las ordenes seleccionadas
  }

  const totalOrders = orders.length;

  const filteredOrders = orders.filter((order) => filterOrdersByDate(order));

  const sortedOrders = orders
    .filter((order) => filterOrdersByDate(order))
    .sort((a, b) => {
      const dateA = new Date(a.date_delivery);
      const dateB = new Date(b.date_delivery);
      return dateA - dateB;
    });

  const statusColorClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green';
      case 'Dispute':
        return 'bg-red-500';
      case 'Generated':
        return 'bg-orange-500';
      case 'Preparing':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="-mt-24">
        <div className="flex gap-6 p-8">
          <h1 className="text-2xl text-green font-semibold mt-1 ml-24">Orders <span className="text-white">list</span></h1>
          <Link
            className="flex bg-green py-3 px-4 rounded-full text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
            href="/orders/create-order"
          >
            <PlusCircleIcon className="h-6 w-6 mr-1" /> New Order
          </Link>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select px-4 py-3 rounded-md border border-gray-300"
          >
            <option value="range">Filter by range</option>
            <option value="date">Filter per date</option>
          </select>
          {filterType === 'range' && (
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

          {filterType === 'date' && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setStartDate(date);
                setEndDate(date);
                setDateFilter("range")
              }}
              className="form-input px-4 py-3 rounded-md border border-gray-300"
              placeholderText="Select a date"
            />
          )}
          <button
            className="text-white bg-primary-blue border-b-2 border-stone-100 cursor-pointer rounded-xl px-5"
            onClick={() => printOrders()}
          >
            Print
          </button>
        </div>
        <div className="flex items-center justify-center mb-20">
          <table className="w-[90%] bg-white rounded-2xl text-center border-b-0">
            <thead className="sticky top-0 bg-white rounded-tl-lg">
              <tr className="border-2 border-stone-100 border-b-0 text-dark-blue rounded-t-3xl">
                <th className="py-4 flex items-center justify-center">
                  Select all
                  <label className="inline-flex items-center ml-3">
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
                <th className="py-4">Profit</th>
                <th className="py-4">Route</th>
                <th className="py-4">Responsable</th>
                <th className="py-4">Delivery date</th>
                <th className="py-4">Order status</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr
                  key={index}
                  className="text-dark-blue border-2 border-stone-100 border-t-0  cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/order/${order.reference}`, undefined, {
                      shallow: true,
                    });
                  }}
                >
                  <td className="py-4">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-500"
                        checked={!!selectedOrders[order.reference]}
                        onChange={(e) => handleOrderSelect(order, e.target.checked)}
                      />
                    </label>
                  </td>
                  <td
                    className="py-4 cursor-pointer hover:bg-primary-blue hover:text-white"
                    onClick={(e) => goToOrder(e, order)}
                  >
                    {order.accountName}
                  </td>
                  <td className="py-4">#5</td>
                  <td className="py-4">Amount</td>
                  <td className="py-4">10%</td>
                  <td className="py-4">R1</td>
                  <td className="py-4">Santiago Arango</td>
                  <td className="py-4">{order.date_delivery}</td>
                  <td className="py-4 flex gap-2 justify-center">
                    <div className={`inline-block mt-1 rounded-full text-white ${statusColorClass(order.name_status)} w-3 h-3 flex items-center justify-center`}>
                    </div>
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
    </Layout >
  );
};
export default OrderView;
