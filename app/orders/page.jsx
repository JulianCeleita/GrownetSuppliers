"use client";
import Table from "@/app/components/Table";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ordersSupplierUrl, ordersUrl } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";


export const fetchOrders = async (
  token,
  setOrders,
  setIsLoading
) => {
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
    console.error(response.data.orders);
  }
};

export const fetchOrdersSupplier = async (
  token,
  user,
  setOrders,
  setIsLoading
) => {
  try {
    const response = await axios.get(`${ordersSupplierUrl}${user.id_supplier}`, {
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

const OrderView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    var localStorageUser = JSON.parse(localStorage.getItem("user"));
    setUser(localStorageUser);
  }, [setUser]);

  useEffect(() => {
    if (user && user.rol_name === "super") {
      fetchOrders(token, setOrders, setIsLoading);
    } else {
      fetchOrdersSupplier(token, user, setOrders, setIsLoading);
    }
  }, [user, token]);

  const filteredOrders = orders.filter((order) =>
    order.created_date.includes(searchTerm)
  );


  const sortedOrders = filteredOrders.slice().sort((a, b) => {
    const orderNameA = orders.find((o) => o.id === a.orders_id)?.accountName || '';
    const orderNameB = orders.find((o) => o.id === b.orders_id)?.accountName || '';
    return orderNameA.localeCompare(orderNameB);
  });

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 pb-20 bg-primary-blue">
          <h1 className="text-2xl text-white font-semibold">
            Orders list
          </h1>
          <Link className="flex bg-green py-3 px-4 rounded-lg text-white font-medium transition-all hover:bg-dark-blue hover:scale-110 " href="/orders/create-order">
            New Order
          </Link>
        </div>
        <div className="flex relative items-center justify-center mb-16 bg-white z-50">
          <input
            type="text"
            placeholder="Search orders by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-[90%] max-w-xl"
          />
        </div>
        <div className="flex items-center justify-center mb-20 -mt-14">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Restaurant</th>
                <th className="py-4">Order date & time</th>
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
                    router.push(`/order/${order.reference}`, undefined, { shallow: true });
                  }}
                >
                  <td className="py-4">{order.accountName}</td>
                  <td className="py-4">{order.created_date}</td>
                  <td className="py-4">{order.date_delivery}</td>
                  <td className="py-4">{order.name_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default OrderView;