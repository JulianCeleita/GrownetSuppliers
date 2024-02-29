import { create } from "zustand";
import axios from "axios";
import { dateAvailable } from "../config/urls.config";

const useWorkDateStore = create((set) => ({
  workDate: null,
  setWorkDate: (date) => set({ workDate: date }),
  setFetchWorkDate: async (
    token,
    idSupplier,
    setEndDateByNet,
    setStartDateByNet
  ) => {
    try {
      const response = await axios.post(
        dateAvailable,
        { supplier: idSupplier },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("🚀 ~ useWorkDateStore ~ response:", response)
      setEndDateByNet(response.data.operation.principal[0].fecha);
      setStartDateByNet(response.data.operation.principal[0].fecha);
      set({ workDate: response.data.operation.principal[0].fecha });
    } catch (error) {
      console.error("error setFetchWorkDate: ", error);
    }
  },
}));
export default useWorkDateStore;
