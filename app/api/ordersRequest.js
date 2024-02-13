import axios from "axios";
import {
  orderDetail,
  ordersDate,
  ordersSupplierUrl,
  ordersUrl,
} from "../config/urls.config";

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

export const countOrdersForDate = (orders, dateFilter) => {
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

//-------
export const fetchOrderDetail = async (
  token,
  setOrderDetail,
  setIsLoading,
  orderId,
  user,
  router
) => {
  try {
    const response = await axios.get(`${orderDetail}${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("🚀 ~ response:", response);

    if (
      user?.id_suppliers == orderDetail.id_suppliers &&
      user?.rol_name === "AdminGrownet"
    ) {
      setOrderDetail(response.data.order);
      setIsLoading(false);
    } else {
      router?.push("/");
    }
  } catch (error) {
    console.error("Error al obtener el detalle:", error);
  }
};
export const fetchOrdersDate = async (
  token,
  end,
  start,
  routeId,
  setTotalNet
) => {
  const postData = {
    date: {
      start: start,
      end: end,
    },
    route_id: routeId,
  };
  console.log("postData", postData);
  try {
    const response = await axios.post(ordersDate, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setTotalNet(response.data);
    console.log("response data", response.data);
  } catch (error) {
    console.error("Error al obtener el orders by date:", error);
  }
};

export const fetchOrdersDateByWorkDate = async (
  token,
  workDate,
  setOrdersWorkDate
) => {
  const postData = {
    date: {
      start: workDate,
      end: workDate,
    },
  };
  console.log("postData workdate", postData);
  try {
    const response = await axios.post(ordersDate, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setOrdersWorkDate(response.data.orders.length);
    console.log("response data", response.data);
  } catch (error) {
    console.error("Error al obtener el orders by date:", error);
  }
};
