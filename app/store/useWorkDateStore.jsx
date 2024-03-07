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
      // Agregar un tiempo de espera, ajusta el valor según tus necesidades
      await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo (ajusta según sea necesario)

      const response = await axios.post(
        dateAvailable,
        { supplier: idSupplier },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("🚀 ~ useWorkDateStore ~ response:", response);

      setEndDateByNet(response.data.operation.principal[0].fecha);
      setStartDateByNet(response.data.operation.principal[0].fecha);
      set({ workDate: response.data.operation.principal[0].fecha });

      // Devuelve una promesa resuelta
      return Promise.resolve();
    } catch (error) {
      console.error("error setFetchWorkDate: ", error);
      // Devuelve una promesa rechazada
      return Promise.reject(error);
    }
  },
}));

export default useWorkDateStore;
