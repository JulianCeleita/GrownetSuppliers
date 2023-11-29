import { addCategoryUrl } from "@/app/config/urls.config";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import useTokenStore from "@/app/store/useTokenStore";

function NewCategory({ isvisible, onClose, setCategories }) {
  if (!isvisible) {
    return null;
  }
  const { token } = useTokenStore();
  const [addCategory, setAddCategory] = useState("");
  //Add category api
  const enviarData = (e) => {
    e.preventDefault();
    const postData = {
      name: addCategory,
    };

    axios
      .post(addCategoryUrl, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const newCategory = response.data;
        setCategories((prevCategories) => [...prevCategories, newCategory]);
        onClose();
      })
      .catch(function (error) {
        console.error("Error al agregar la nueva categoria:", error);
      });
  };
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
          Add <span className="text-primary-blue">new category</span>
        </h1>
        <p>Enter the name of the new category you want to add</p>
        <form onSubmit={enviarData}>
          <input
            className="border p-3 rounded-md mr-3 mt-3"
            placeholder="Fruit"
            value={addCategory}
            onChange={(e) => setAddCategory(e.target.value)}
            required
          ></input>
          <div className="mt-3">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Add category
            </button>
            <button
              onClick={() => onClose()}
              className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewCategory;
