import axios from "axios";
import {
  customersDate,
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
  setTotalNet,
  setOrders,
  setIsLoading
) => {
  if (!end || !start) {
    return;
  }

  setIsLoading(true);
  const postData = {
    date: {
      start: start,
      end: end,
    },
    route_id: routeId,
  };
  if (postData.date.start !== null || postData.date.end !== null) {
    try {
      const response = await axios.post(ordersDate, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setTotalNet(response.data);
      setOrders(response.data.orders);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener el orders by date:", error);
    }
  } else {
    return
  }
};

export const fetchOrdersDateByWorkDate = async (
  token,
  workDate,
  setOrdersWorkDate,
  setOrdersLoadingToday
) => {
  if(workDate === null) {
    return
  }
  const postData = {
    date: {
      start: workDate,
      end: workDate,
    },
  };
  try {
    const response = await axios.post(ordersDate, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setOrdersLoadingToday(
      response.data.orders.filter((order) => order.status_order === "Loaded")
        .length
    );
    setOrdersWorkDate(response.data.orders.length);
  } catch (error) {
    console.error("Error al obtener el orders by date:", error);
  }
};

export const fetchCustomersDate = async (
  token,
  date,
  accountNumber,
  setCustomerDate
) => {
  if (accountNumber && date) {
    const postData = {
      date: date,
      accountNumber: accountNumber,
    };
    try {
      const response = await axios.post(customersDate, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomerDate(response.data.routes);
    } catch (error) {
      console.error("Error al obtener customer date:", error);
    }
  }
};
