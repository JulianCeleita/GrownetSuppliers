"use client";
import { useState, useEffect } from "react";
import useTokenStore from "@/app/store/useTokenStore";
import useCategoryStore from "@/app/store/useCategoryStore";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import NewCategory from "../components/NewCategory";
import EditCategory from "../components/EditCategory";
import axios from "axios";
import { categoriesUrl, deleteCategoryUrl } from "@/app/config/urls.config";

export const fetchCategories = async (token, setCategories) => {
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
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
  }
};

function Categories() {
  const { token } = useTokenStore();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  //Variable edit category
  const [selectedCategory, setSelectedCategory] = useState(null);

  //Api categorias
  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories(token, setCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Api delete
  const [deleteResponse, setDeleteResponse] = useState(null);
  const handleDeleteCategory = async (category) => {
    const { id } = category;

    try {
      const response = await axios.delete(`${deleteCategoryUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeleteResponse(response.data);
      fetchCategories(token, setCategories);
      console.log("Se borro con éxito");
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };
  return (
    <div>
      <div className="flex justify-between p-8 pb-20 bg-primary-blue">
        <h1 className="text-2xl text-white font-semibold">Categories list</h1>
        <button
          className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:bg-dark-blue hover:scale-110 "
          type="button"
          onClick={() => setShowNewCategory(true)}
        >
          <PlusCircleIcon className="h-6 w-6 mr-3 font-bold" />
          New category
        </button>
      </div>
      <div className="flex items-center justify-center mb-6 -mt-14">
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-20">
          <thead>
            <tr className="border-b-2 border-stone-100 text-dark-blue">
              <th className="py-4">Category</th>
              <th className="py-4">Operate</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="text-dark-blue border-b-2 border-stone-100"
              >
                <td className="py-4">{category.name}</td>
                <td className="py-4 flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowEditCategory(true);
                    }}
                    className="flex text-primary-blue mr-6 font-medium hover:scale-110 hover:text-green hover:border-green"
                  >
                    <PencilSquareIcon className="h-6 w-6 mr-1" />
                    Edit
                  </button>
                  <button
                    className="flex text-primary-blue font-medium hover:scale-110 hover:text-danger hover:border-danger"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <TrashIcon className="h-6 w-6 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditCategory
        isvisible={showEditCategory}
        onClose={() => setShowEditCategory(false)}
        category={selectedCategory}
        setCategories={setCategories}
      />
      <NewCategory
        isvisible={showNewCategory}
        onClose={() => setShowNewCategory(false)}
        setCategories={setCategories}
      />
    </div>
  );
}
export default Categories;
