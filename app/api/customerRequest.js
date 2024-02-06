import axios from "axios";
import {
  customerDetail,
  customersSupplierUrl,
  customersUrl,
  groupsUrl,
  routesUrl,
} from "../config/urls.config";

export const fetchCustomerDetail = async (
  token,
  setDetailCustomer,
  setIsLoading,
  customerId
) => {
  try {
    const response = await axios.get(`${customerDetail}${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDetailCustomer(response.data.customer);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener el detalle:", error);
  }
};

export const fetchRoutes = async (token, user, setRoutes, setIsLoading) => {
  try {
    const response = await axios.get(routesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newRoute = Array.isArray(response.data.routes)
      ? response.data.routes
      : [];
    setRoutes(newRoute);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los routes:", error);
  }
};

export const fetchGroups = async (token, user, setGroups, setIsLoading) => {
  try {
    const response = await axios.get(groupsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newGroup = Array.isArray(response.data.groups)
      ? response.data.groups
      : [];
    setGroups(newGroup);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los groups:", error);
  }
};

//------------

export const fetchCustomers = async (
  token,
  user,
  setCustomers,
  setIsLoading
) => {
  try {
    const response = await axios.get(customersUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newCustomer = Array.isArray(response.data.customers)
      ? response.data.customers
      : [];
    setCustomers(newCustomer);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los customers:", error);
  }
};

export const fetchCustomersSupplier = async (
  token,
  user,
  setCustomers,
  setIsLoading
) => {
  try {
    const response = await axios.get(
      `${customersSupplierUrl}${user.id_supplier}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newCustomer = Array.isArray(response.data.customers)
      ? response.data.customers
      : [];
    setCustomers(newCustomer);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los customers:", error);
  }
};
