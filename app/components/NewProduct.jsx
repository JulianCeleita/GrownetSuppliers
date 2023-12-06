import { useState, useEffect } from "react";
import {
  addProductUrl,
  familiesUrl,
  uomUrl,
  presentationsUrl,
  TaxesApi,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import useCategoryStore from "@/app/store/useCategoryStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function NewProduct({ isvisible, onClose, fetchProducts }) {
  const { token } = useTokenStore();
  const { categories } = useCategoryStore();
  //Variables formulario
  const [addProduct, setAddProduct] = useState("");
  const [codeProduct, setCodeProduct] = useState("");
  const [presentationProduct, setPresentationProduct] = useState("");
  const [taxProduct, setTaxProduct] = useState("");
  const [costProduct, setCostProduct] = useState(0);
  const [quantityProduct, setQuantityProduct] = useState("");
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState("active");
  const [selectedFamiliesStatus, setSelectedFamiliesStatus] =
    useState("banana");
  const [selecteUomsStatus, setSelectedUomsStatus] = useState("unit");
  const [families, setFamilies] = useState([]);
  const [uoms, setUoms] = useState([]);
  // const [tax, setTax] = useState([]);
  // const [selectedTax, setSelectedTax] = useState("");
  const [selectedImageName, setSelectedImageName] = useState(null);

  // Taxes
  /*useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(TaxesApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTax(response.data.taxes);
      } catch (error) {
        console.error("Error al obtener Taxes productos:", error);
      }
    };

    fetchTaxes();
  }, []);*/
  useEffect(() => {
    if (categories.length > 0 && !categoriesLoaded) {
      setSelectedCategoryId(categories[0].id);
      setCategoriesLoaded(true);
    }
  }, [categories, categoriesLoaded]);

  // Api families
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await axios.get(familiesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFamilies(response.data.families);
        setSelectedFamiliesStatus(response.data.families[0]?.id || "");
      } catch (error) {
        console.error("Error al obtener las familia productos:", error);
      }
    };

    fetchFamilies();
  }, []);

  // Api uom
  useEffect(() => {
    const fetchUoms = async () => {
      try {
        const response = await axios.get(uomUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUoms(response.data.uoms);
        setSelectedUomsStatus(response.data.uoms[0]?.id || "");
      } catch (error) {
        console.error("Error al obtener UOMS productos:", error);
      }
    };

    fetchUoms();
  }, []);

  if (!isvisible) {
    return null;
  }

  // Estado producto
  const statusMapping = {
    active: 1,
    disable: 2,
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageName(file);
  };

  // Add product api
  const enviarData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", addProduct);
    formData.append("code", codeProduct);
    formData.append("category_id", selectedCategoryId);
    formData.append("country_indicative", "44");
    formData.append("uom_id", selecteUomsStatus);
    formData.append("quantity", quantityProduct);
    formData.append("cost", costProduct);
    formData.append("family_id", selectedFamiliesStatus);
    formData.append("presentation", presentationProduct);
    formData.append("image", selectedImageName);
    formData.append("tax", taxProduct);

    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    console.log("formDataObject", formDataObject);

    try {
      const response = await axios.post(addProductUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onClose();
      await fetchProducts(token);
      console.log("response.data", response.data);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    }
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
            />
            <label>Code: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="50"
              type="text"
              onChange={(e) => setCodeProduct(e.target.value)}
              required
            ></input>
          </div>
          <div>
            <label htmlFor="family">Family: </label>
            <select
              id="family"
              name="family"
              className="border p-3 rounded-md mr-3 mt-3"
              required
              onChange={(e) => setSelectedFamiliesStatus(e.target.value)}
            >
              <option value="" disabled selected>
                Select family
              </option>
              {families.map((family) => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
            <label>Cost: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="10"
              type="number"
              onChange={(e) => setCostProduct(e.target.value)}
              required
            />
          </div>

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
                <option value="" disabled selected>
                  Select uom
                </option>
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
              >
                <option value="" disabled selected>
                  Select category
                </option>
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
            required
            onChange={handleImageChange}
          ></input>
          <div>
            {/* <label>Product status: </label>
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
            </select> */}
            <label>Product taxes: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-[50px]"
              placeholder="1.2"
              type="text"
              onChange={(e) => setTaxProduct(e.target.value)}
              required
            ></input>
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
