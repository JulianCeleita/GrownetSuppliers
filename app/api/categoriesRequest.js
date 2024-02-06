import axios from "axios";
import { categoriesUrl } from "../config/urls.config";

export const fetchCategories = async (token, setCategories, setIsLoading) => {
  try {
    const response = await axios.get(categoriesUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newCategories = Array.isArray(response.data.categories)
      ? response.data.categories
      : [];

    const sortedCategories = newCategories.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setCategories(sortedCategories);
    setIsLoading(false);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
};
