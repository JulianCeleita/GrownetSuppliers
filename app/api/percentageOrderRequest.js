import axios from "axios";
import { routesByDate } from "../config/urls.config";

export const getPercentageOrder = async (
  token,
  date,
  order_id,
  setPercentage,
  setDataLoaded
) => {
  console.log({ token, date, order_id, setPercentage });
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

    console.log(data);
    setDataLoaded(true);

    data.routes.forEach((route) => {
      route.accounts.forEach((account) => {
        // console.log("order reference", account.orders_reference);
        // console.log("order reference", order_id);
        if (account.orders_reference === Number(order_id)) {
          const percentage = Number(account.percentage_loading).toFixed(0);
          setPercentage(percentage);
          console.log("holaaaaa");
        }
      });
    });
  } catch (error) {
    console.log("Error in getPercentageOrder:", error);
  }
};
