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
  console.log("🚀 ~ fetchDeliveries ~ selectedDate:", formattedDate);

  axios
    .get(`${deliveriesUrl}${formattedDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ fetchDeliveries ~ response:", response);

      const newOrder = Array.isArray(response.data) ? response.data : [];
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
  try {
    const response = await axios.get(
      `${deliveriesCustomerDetail}${reference}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log("response.data:", response.data);

    setDeliveryDetails(response.data);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las deliveries details:", error);
  }
};
