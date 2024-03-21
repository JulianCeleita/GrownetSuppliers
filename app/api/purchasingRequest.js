import axios from "axios";
import { purchasingUrl, wholesalersUrl } from "../config/urls.config";
import { formatISO } from "date-fns";

export const fetchOrderWholesaler = (
  start,
  end,
  token,
  setOrdersWholeseler,
  setIsLoading
) => {
  if (!end || !start || start === new Date()) {
    return;
  }

  const formattedStartDate = formatISO(start, { representation: "date" });
  const formattedEndDate = formatISO(end, { representation: "date" });

  const postData = {
    date: {
      start: formattedStartDate,
      end: formattedEndDate,
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
