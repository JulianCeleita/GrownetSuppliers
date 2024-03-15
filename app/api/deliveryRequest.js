import axios from "axios";
import { deliveriesCustomerDetail, deliveriesUrl } from "../config/urls.config";

export const fetchDeliveries = (
  token,
  setDeliveries,
  setIsLoading,
  selectedDate,
  setDataLoaded
) => {
  let formattedDate;
  if (selectedDate) {
    formattedDate = new Date(selectedDate).toISOString().split("T")[0];
  } else {
    formattedDate = null;
  }
  axios
    .get(`${deliveriesUrl}${formattedDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response)
      setDeliveries(response.data);
      setIsLoading(false);
      setDataLoaded(true);
    })
    .catch((error) => {
      console.error("Error al obtener las deliveries :", error);
    });
};

export const fetchDeliveriesDetails = async (
  token,
  setDeliveryDetails,
  setIsLoading,
  reference
) => {
  if(!reference) {
    return
  }
  try {
    const response = await axios.get(
      `${deliveriesCustomerDetail}${reference}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setDeliveryDetails(response.data);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las deliveries details:", error);
  }
};
