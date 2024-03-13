import axios from "axios";
import {
  presentationsSupplierUrl,
  presentationsUrl,
  typesUrl,
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
  setIsLoading,
  setDescriptionData
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
    setDescriptionData(newPresentation);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las presentaciones:", error);
  }
};

// Obtener types
export const fetchTypes = async (token, setTypes) => {
  try {
    const response = await axios.get(typesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newType = Array.isArray(response.data.type) ? response.data.type : [];
    setTypes(newType);
  } catch (error) {
    console.error("Error al obtener los types:", error);
  }
};
