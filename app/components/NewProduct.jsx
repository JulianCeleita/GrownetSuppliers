import { useState, useEffect } from "react";
import {
  addProductUrl,
  familiesUrl,
  uomUrl,
  presentationsUrl,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import useCategoryStore from "@/app/store/useCategoryStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function NewProduct({ isvisible, onClose, setProducts }) {
  const { token } = useTokenStore();
  const { categories } = useCategoryStore();
  //Variables formulario
  const [addProduct, setAddProduct] = useState("");
  const [codeProduct, setCodeProduct] = useState("");
  const [presentationProduct, setPresentationProduct] = useState("");
  const [quantityProduct, setQuantityProduct] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [selectedFamiliesStatus, setSelectedFamiliesStatus] =
    useState("banana");
  const [selecteUomsStatus, setSelectedUomsStatus] = useState("unit");
  useState("5 Kg");
  const [families, setFamilies] = useState([]);
  const [uoms, setUoms] = useState([]);

  // Api families
  useEffect(() => {
    axios
      .get(familiesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setFamilies(response.data.families);
      })
      .catch((error) => {
        console.error("Error al obtener las familia productos:", error);
      });
  }, []);

  // Api uom
  useEffect(() => {
    axios
      .get(uomUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUoms(response.data.uoms);
      })
      .catch((error) => {
        console.error("Error al obtener UOMS productos:", error);
      });
  }, []);

  //Api presentation
  const [presentations, setPresentations] = useState([]);
  useEffect(() => {
    axios
      .get(presentationsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPresentations(response.data.presentations);
      })
      .catch((error) => {
        console.error("Error al obtener las presentaciones:", error);
      });
  }, [presentations]);

  if (!isvisible) {
    return null;
  }
  //Estado producto
  const statusMapping = {
    active: 1,
    disable: 2,
  };
  //Add product api
  const enviarData = (e) => {
    e.preventDefault();
    const postData = {
      name: addProduct,
      code: codeProduct,
      categories_id: selectedCategoryId,
      quantity: quantityProduct,
      stateProduct_id: statusMapping[selectedStatus],
      country_indicative: "44",
      families_id: selectedFamiliesStatus,
      uom_id: selecteUomsStatus,
      presentation: presentationProduct,
      /*
      taxe_id:
      */
    };

    axios.post(addProductUrl, postData),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        .then((response) => {
          const newProduct = response.data;
          setProducts((prevProducts) => [...prevProducts, newProduct]);
          onClose();
        })
        .catch(function (error) {
          console.error("Error al agregar la nueva categoria:", error);
        });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[800px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-dark-blue mb-2">
          Add <span className="text-primary-blue">new product</span>
        </h1>
        <form className="text-left  flex flex-col" onSubmit={enviarData}>
          <div>
            <label>Name: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="Foodpoint"
              type="text"
              onChange={(e) => setAddProduct(e.target.value)}
              required
            ></input>
            <label>Code: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="50"
              type="text"
              onChange={(e) => setCodeProduct(e.target.value)}
              required
            ></input>
          </div>
          <label for="family">Family: </label>
          <select
            id="family"
            name="family"
            className="border p-3 rounded-md mr-3 mt-3"
            required
            onChange={(e) => setSelectedFamiliesStatus(e.target.value)}
            value={selectedFamiliesStatus}
          >
            {families.map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </select>
          <div>
            <label className="mt-2">Quantity: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="50"
              type="number"
              onChange={(e) => setQuantityProduct(e.target.value)}
              required
            ></input>
            <label>Presentation: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="5 Kg"
              type="text"
              onChange={(e) => setPresentationProduct(e.target.value)}
              required
            ></input>
          </div>
          <div className="flex ">
            <div>
              <label>Unit weight of the product: </label>
              <select
                id="uom"
                name="uom"
                className="border p-3 rounded-md mr-3 mt-3"
                required
                onChange={(e) => setSelectedUomsStatus(e.target.value)}
              >
                {uoms.map((uom) => (
                  <option key={uom.id} value={uom.id}>
                    {uom.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Category: </label>
              <select
                id="category"
                name="category"
                className="border p-3 rounded-md mr-3 mt-3"
                required
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                value={selectedCategoryId}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label>Attach the product&apos;s photo: </label>
          <input
            className="p-3 rounded-md mr-3 mt-3 cursor-pointer"
            placeholder="Fruit"
            type="file"
          ></input>
          <div>
            <label>Product status: </label>
            <select
              id="status"
              name="status"
              className="border p-3 rounded-md mr-3 mt-3 w-40"
              onChange={(e) => setSelectedStatus(e.target.value)}
              value={selectedStatus}
              required
            >
              <option value="active">Active</option>
              <option value="disable">Disable</option>
            </select>
            <label>Product taxes: </label>
            <select
              id="tax"
              name="tax"
              className="border p-3 rounded-md mr-3 mt-3 w-40"
              required
            >
              <option value="0.2">0.2</option>
              <option value="0.05">0.05</option>
            </select>
          </div>

          <div className="mt-3 text-center">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Add product
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
export default NewProduct;
