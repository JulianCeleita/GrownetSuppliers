import { create } from "zustand";
import axios from "axios";
import { routesByDate } from "../config/urls.config";

const usePercentageStore = create((set) => ({
    routePercentages: null,
    setRoutePercentages: (value) => set({ routePercentages: value }),
    setFetchRoutePercentages: async (token, date) => {
        try {
            const response = await axios.post(routesByDate, { date: date }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            set({ routePercentages: response.data.routes });
        } catch (error) {
            console.error('error setFetchWorkDate: ', error);
        }
    },
}));
export default usePercentageStore;