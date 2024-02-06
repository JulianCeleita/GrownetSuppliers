import axios from "axios";
import {
  presentationsSupplierUrl,
  presentationsUrl,
} from "../config/urls.config";

export const fetchPresentations = async (
  token,
  setPresentations,
  setIsLoading
) => {
  try {
    const response = await axios.get(presentationsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newPresentation = Array.isArray(response?.data?.presentations)
      ? response?.data?.presentations
      : [];
    setPresentations(newPresentation);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las presentaciones:", error);
  }
};

export const fetchPresentationsSupplier = async (
  token,
  user,
  setPresentations,
  setIsLoading
) => {
  try {
    const response = await axios.get(
      `${presentationsSupplierUrl}${user.id_supplier}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newPresentation = Array.isArray(response.data.presentations)
      ? response.data.presentations
      : [];
    setPresentations(newPresentation);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las presentaciones:", error);
  }
};
