import { create } from "zustand";
import axios from "axios";
import { dateAvailable } from "../config/urls.config";

const useWorkDateStore = create((set) => ({
    workDate: null,
    setWorkDate: (date) => set({ workDate: date }),
    setFetchWorkDate: async (token, idSupplier) => {

        try {
            const response = await axios.post(dateAvailable, { supplier: idSupplier }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // console.log('response setFetchWorkDate: ', formatDate(response.data.operation.principal[0].fecha));
            set({ workDate: response.data.operation.principal[0].fecha });
        } catch (error) {
            console.log('error setFetchWorkDate: ', error);
        }
    },


}));
export default useWorkDateStore;