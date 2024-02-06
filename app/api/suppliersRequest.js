import axios from "axios";
import { suppliersUrl } from "../config/urls.config";

export const fetchSuppliers = async (token, setSuppliers, setIsLoading) => {
  try {
    const response = await axios.get(suppliersUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newSuppliers = Array.isArray(response.data.suppliers)
      ? response.data.suppliers
      : [];

    const sortedSuppliers = newSuppliers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setSuppliers(sortedSuppliers);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las proveedores:", error);
  }
};
