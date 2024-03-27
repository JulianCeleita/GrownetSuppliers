import axios from "axios";
import { orderHistoryRequest } from "../config/urls.config";

export const fetchOrdersHistory = async (
  workDate,
  start,
  end,
  token,
  setOrdersHistory,
  setIsLoading
) => {
  const postData = {
    ...(start && end ? { date: { start, end } } : { date: workDate }),
  };

  try {
    const response = await axios.post(orderHistoryRequest, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setOrdersHistory(response.data.products);
    setIsLoading(false);
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
};
