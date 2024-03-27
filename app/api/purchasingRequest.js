import axios from "axios";
import { purchasingUrl, wholesalersUrl } from "../config/urls.config";
import { formatISO } from "date-fns";

export const fetchOrderWholesaler = (
  workDate,
  token,
  setOrdersWholeseler,
  setIsLoading
) => {
  const postData = {
    date: {
      start: workDate,
      end: workDate,
    },
  };
  console.log("🚀 ~ postData:", postData);
  axios
    .get(purchasingUrl, {
      params: postData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response);
      setOrdersWholeseler(response.data.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

export const fetchWholesalerList = (token, setWholesalerList, setIsLoading) => {
  axios
    .get(wholesalersUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response);
      setWholesalerList(response.data.wholesalers);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};
