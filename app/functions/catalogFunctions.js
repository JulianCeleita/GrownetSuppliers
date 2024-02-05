import axios from "axios";
import {
  customersUrl,
  pricesBySupplier,
  pricesUrl,
} from "../config/urls.config";

export const fetchPrices = async (token, user, setPrices, setIsLoading) => {
  try {
    const response = await axios.get(pricesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newPrice = Array.isArray(response.data.prices)
      ? response.data.prices
      : [];
    setPrices(newPrice);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los prices:", error);
  }
};

export const fetchPricesBySupplier = async (
  token,
  user,
  setPrices,
  setIsLoading
) => {
  try {
    const response = await axios.get(`${pricesBySupplier}${user.id_supplier}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("🚀 ~ response by supplier:", response);

    const newPrice = Array.isArray(response.data.price)
      ? response.data.price
      : [];
    setPrices(newPrice);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los prices:", error);
  }
};

export const fetchCustomerBySupplier = async (
  token,
  setCustomerList,
  setIsLoading
) => {
  try {
    const response = await axios.get(`${customersUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("🚀 ~ response by customersSupplierUrl:", response.data);

    const customerAccountNames = response.data.customers.map((customer) => ({
      accountName: customer.accountName,
    }));

    setCustomerList(customerAccountNames);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener los customers:", error);
  }
};
