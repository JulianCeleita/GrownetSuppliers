import axios from "axios";
import { printOrdersUrl } from "../config/urls.config";

export const fetchPrintOrders = async (token, orders) => {
  try {
    const response = await axios.post(printOrdersUrl, { orders },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response", response);
  } catch (error) {
    console.error("Error al enviar las ordenes para imprimir:", error);
  }
};
