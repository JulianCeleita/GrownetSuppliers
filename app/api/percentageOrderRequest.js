import axios from "axios";
import { routesByDate } from "../config/urls.config";

export const getPercentageOrder = async (
  token,
  date,
  order_id,
  setPercentage,
  setDataLoaded
) => {
  try {
    const { data } = await axios.post(
      routesByDate,
      { date },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setDataLoaded(true);
    data.routes.forEach((route) => {
      route.accounts.forEach((account) => {
        if (account.orders_reference === Number(order_id)) {
          const percentage = Number(account.percentage_loading).toFixed(0);
          setPercentage(percentage);
        }
      });
    });
  } catch (error) {
    setDataLoaded(false);
    console.log("Error in getPercentageOrder:", error);
  }
};
