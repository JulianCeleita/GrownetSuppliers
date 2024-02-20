import axios from "axios";
import { routesByDate } from "../config/urls.config";

export const getPercentageOrder = async (token, date, order_id, setPercentage) => {
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

        data.routes.forEach((route) => {
            route.accounts.forEach((account) => {
                if (account.orders_reference === Number(order_id)) {
                    const percentage = Number(account.percentage_loading).toFixed(0);
                    setPercentage(percentage);
                }
            });
        });
    } catch (error) {
        console.log("Error in getPercentageOrder:", error);
    }
};