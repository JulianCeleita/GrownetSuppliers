import axios from "axios";
import { deliveriesUrl } from "../config/urls.config";

export const fetchDeliveries = async (token, setDeliveries, setIsLoading, selectedDate) => {
    let formattedDate
    if (selectedDate) {
        formattedDate = new Date(selectedDate).toISOString().split('T')[0];
    } else {
        formattedDate = null
    }
    console.log("🚀 ~ fetchDeliveries ~ selectedDate:", formattedDate);
    try {
      const response = await axios.get(`${deliveriesUrl}${formattedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🚀 ~ fetchDeliveries ~ response:", response)
  
      const newOrder = Array.isArray(response.data)
        ? response.data
        : [];
      setDeliveries(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener las deliveries:", error);
    }
  };