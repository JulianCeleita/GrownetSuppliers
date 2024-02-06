"use client";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ordersSupplierUrl, ordersUrl } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const fetchOrders = async (token, setOrders, setIsLoading) => {
  try {
    const response = await axios.get(ordersUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newOrder = Array.isArray(response.data.orders)
      ? response.data.orders
      : [];
    setOrders(newOrder);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las ordenes:", error);
  }
};

export const fetchOrdersSupplier = async (
  token,
  user,
  setOrders,
  setIsLoading
) => {
  try {
    const response = await axios.get(
      `${ordersSupplierUrl}${user?.id_supplier}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newOrder = Array.isArray(response.data.orders)
      ? response.data.orders
      : [];
    setOrders(newOrder);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las ordenes por supplier:", error);
  }
};

const countOrdersForDate = (orders, dateFilter) => {
  const currentDate = new Date();

  return orders.filter((order) => {
    const deliveryDate = new Date(order.date_delivery);

    switch (dateFilter) {
      case "today":
        const today = new Date(currentDate);
        today.setDate(currentDate.getDate() - 1);
        return today.toDateString() === deliveryDate.toDateString();
      case "tomorrow":
        const tomorrow = new Date();
        tomorrow.setDate(currentDate.getDate());
        return tomorrow.toDateString() === deliveryDate.toDateString();
      case "dayAfterTomorrow":
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(currentDate.getDate() + 1);
        return dayAfterTomorrow.toDateString() === deliveryDate.toDateString();
      default:
        return false;
    }
  }).length;
};
const formatDate = (dateString) => {
  const formattedDate = format(new Date(dateString), "yyyy-MM-dd");
  return formattedDate;
};

const OrderView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const { user, setUser } = useUserStore();
  const [dateFilter, setDateFilter] = useState("");
  const [showAllOrders, setShowAllOrders] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [today, setToday] = useState(formatDate(new Date()));
  const [tomorrow, setTomorrow] = useState(
    formatDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
  );
  const [dayAfterTomorrow, setdayAfterTomorrow] = useState(
    formatDate(new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000))
  );

  const todayOrdersCount = countOrdersForDate(orders, "today");
  const tomorrowOrdersCount = countOrdersForDate(orders, "tomorrow");
  const dayAfterTomorrowOrdersCount = countOrdersForDate(
    orders,
    "dayAfterTomorrow"
  );

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

  const filterOrdersByDate = (order) => {
    if (showAllOrders) {
      return true;
    }

    const currentDate = new Date();
    const deliveryDate = new Date(order.date_delivery);

    if (dateFilter === "today") {
      const today = new Date(currentDate);
      today.setDate(currentDate.getDate() - 1);
      return today.toDateString() === deliveryDate.toDateString();
    } else if (dateFilter === "tomorrow") {
      const tomorrow = new Date(currentDate);
      tomorrow.setDate(currentDate.getDate());
      return tomorrow.toDateString() === deliveryDate.toDateString();
    } else if (dateFilter === "dayAfterTomorrow") {
      const dayAfterTomorrow = new Date(currentDate);
      dayAfterTomorrow.setDate(currentDate.getDate() + 1);
      return dayAfterTomorrow.toDateString() === deliveryDate.toDateString();
    } else if (dateFilter === "calendarDate") {
      const selectedDateMinusOne = new Date(selectedDate);
      selectedDateMinusOne.setDate(selectedDate.getDate() - 1);

      return (
        selectedDateMinusOne.toDateString() === deliveryDate.toDateString()
      );
    } else {
      return false;
    }
  };

  const handleDateChange = (date) => {
    setShowAllOrders(false);
    setShowDatePicker(false);
    setSelectedDate(date);
  };

  const totalOrders = orders.length;

  const filteredOrders = orders.filter((order) => filterOrdersByDate(order));

  const sortedOrders = filteredOrders.slice().sort((a, b) => {
    const orderNameA =
      orders.find((o) => o.id === a.orders_id)?.accountName || "";
    const orderNameB =
      orders.find((o) => o.id === b.orders_id)?.accountName || "";
    return orderNameA.localeCompare(orderNameB);
  });

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 bg-primary-blue">
          <h1 className="text-2xl text-white font-semibold">Orders list</h1>
          <Link
            className="flex bg-green py-3 px-4 rounded-lg text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 "
            href="/orders/create-order"
          >
            New Order
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <button
            className={`text-dark-blue border-b-2 border-stone-100 cursor-pointer rounded-xl p-1 ${
              showAllOrders ? "font-semibold bg-blue-300 transition-all" : ""
            }`}
            onClick={() => {
              setDateFilter("");
              setShowAllOrders(true);
            }}
          >
            All ({totalOrders})
          </button>
          <button
            className={`text-dark-blue border-b-2 border-stone-100 cursor-pointer rounded-xl p-1 ${
              dateFilter === "today"
                ? "font-semibold bg-blue-300  transition-all"
                : ""
            }`}
            onClick={() => {
              const currentDate = new Date();
              const today = new Date(currentDate);
              today.setDate(currentDate.getDate());
              setSelectedDate(today);
              setDateFilter("today");
              setShowAllOrders(false);
            }}
          >
            {today} ({todayOrdersCount})
          </button>
          <button
            className={`text-dark-blue border-b-2 border-stone-100 cursor-pointer rounded-xl p-1 ${
              dateFilter === "tomorrow"
                ? "font-semibold bg-blue-300 transition-all"
                : ""
            }`}
            onClick={() => {
              const currentDate = new Date();
              const tomorrow = new Date(currentDate);
              tomorrow.setDate(currentDate.getDate() + 1);
              setSelectedDate(tomorrow);
              setDateFilter("tomorrow");
              setShowAllOrders(false);
            }}
          >
            {tomorrow} ({tomorrowOrdersCount})
          </button>
          <button
            className={`text-dark-blue border-b-2 border-stone-100 cursor-pointer rounded-xl p-1 ${
              dateFilter === "dayAfterTomorrow"
                ? "font-semibold bg-blue-300 transition-all"
                : ""
            }`}
            onClick={() => {
              const currentDate = new Date();
              const dayAfterTomorrow = new Date(currentDate);
              dayAfterTomorrow.setDate(currentDate.getDate() + 2);
              setSelectedDate(dayAfterTomorrow);
              setDateFilter("dayAfterTomorrow");
              setShowAllOrders(false);
            }}
          >
            {dayAfterTomorrow} ({dayAfterTomorrowOrdersCount})
          </button>
          <button
            className={`text-dark-blue border-b-2 border-stone-100 cursor-pointer rounded-xl p-1 ${
              showDatePicker ? "disabled" : ""
            }`}
            onClick={() => {
              setShowDatePicker(!showDatePicker);
              setDateFilter("calendarDate");
            }}
            disabled={showDatePicker}
          >
            +
          </button>

          {showDatePicker && (
            <div className="flex mt-64 absolute z-50">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center mb-20">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Restaurant</th>
                <th className="py-4">Order date</th>
                <th className="py-4">Delivery date</th>
                <th className="py-4">Order status</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr
                  key={order.reference}
                  className="text-dark-blue border-b-2 border-stone-100 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/order/${order.reference}`, undefined, {
                      shallow: true,
                    });
                  }}
                >
                  <td className="py-4">{order.accountName}</td>
                  <td className="py-4">{formatDate(order.created_date)}</td>
                  <td className="py-4">{order.date_delivery}</td>
                  <td className="py-4">{order.name_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div class="loader"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default OrderView;
