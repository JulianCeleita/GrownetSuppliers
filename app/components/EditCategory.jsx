import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { updateCategoryUrl } from "../../app/config/urls.config";
import useTokenStore from "../../app/store/useTokenStore";
import { fetchCategories } from "../categories/page";
function EditCategory({
  isvisible,
  onClose,
  category,
  setCategories,
  setIsLoading,
}) {
  const [editedName, setEditedName] = useState(category ? category.name : "");
  const { token } = useTokenStore();

  const handleEditCategory = (event) => {
    event.preventDefault();

    axios
      .post(
        `${updateCategoryUrl}${category.id}`,
        {
          name: editedName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        fetchCategories(token, setCategories, setIsLoading);
        onClose();
      })
      .catch((error) => {
        console.error("Error editando la categoría:", error);
      });
  };

  if (!isvisible) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[600px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-dark-blue mb-2">
          Edit <span className="text-primary-blue">category</span>
        </h1>
        <p>Enter the correct name for the category</p>
        <form onSubmit={handleEditCategory}>
          <input
            className="border p-3 rounded-md mr-3 mt-3"
            placeholder="Fruit"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            required
          ></input>
          <div className="mt-3">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Edit category
            </button>
            <button
              onClick={() => onClose()}
              className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategory;
