"use client";
import { categoriesUrl, deleteCategoryUrl } from "@/app/config/urls.config";
import useCategoryStore from "@/app/store/useCategoryStore";
import useTokenStore from "@/app/store/useTokenStore";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import EditCategory from "../components/EditCategory";
import ModalDelete from "../components/ModalDelete";
import NewCategory from "../components/NewCategory";
import Layout from "../layoutS";

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

function Categories() {
  const { token } = useTokenStore();
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [showEditCategory, setShowEditCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //Api categorias
  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories(token, setCategories, setIsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Api delete
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteCategory = async (category) => {
    const { id } = category;

    try {
      const response = await axios.delete(`${deleteCategoryUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeleteResponse(response.data);
      setShowDeleteModal(false);
      fetchCategories(token, setCategories, setIsLoading);
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };
  return (
    <Layout>
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
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Category</th>
                <th className="py-4 rounded-tr-lg">Operate</th>
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
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowDeleteModal(true);
                      }}
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
        <ModalDelete
          isvisible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteCategory(selectedCategory)}
        />

        <EditCategory
          isvisible={showEditCategory}
          onClose={() => setShowEditCategory(false)}
          category={selectedCategory}
          setCategories={setCategories}
          setIsLoading={setIsLoading}
        />
        <NewCategory
          isvisible={showNewCategory}
          onClose={() => setShowNewCategory(false)}
          setCategories={setCategories}
          setIsLoading={setIsLoading}
        />
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default Categories;
