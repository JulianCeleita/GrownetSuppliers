import axios from "axios";
import { purchasingUrl } from "../config/urls.config";

export const fetchOrderWholesaler = (end, start, token) => {
  if (!end || !start) {
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
    .get(purchasingUrl, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response);
    })
    .catch((response, error) => {
      console.log("🚀 ~ error:", error);
    });
};
