import axios from "axios";
import { purchasingUrl, wholesalersUrl } from "../config/urls.config";

export const fetchOrderWholesaler = (
  start,
  end,
  token,
  setOrdersWholeseler
) => {
  if (!end || !start || start === new Date()) {
    return;
  }

  const postData = {
    date: {
      start: start,
      end: end,
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
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};

export const fetchWholesalerList = (token, setWholesalerList) => {
  axios
    .get(wholesalersUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response, wholesalersUrl);
      setWholesalerList(response.data.data);
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};
