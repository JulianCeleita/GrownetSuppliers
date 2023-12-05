import { XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { familiesUrl, uomUrl, updateProductUrl } from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { useEffect, useState } from "react";
import axios from "axios";
import useCategoryStore from "../store/useCategoryStore";
import useProductStore from "../store/useProductStore";

function EditProduct({ isvisible, onClose, fetchProducts, productId }) {
  const { token } = useTokenStore();
  const { categories } = useCategoryStore();

  //
  const [uoms, setUoms] = useState([]);
  const [families, setFamilies] = useState([]);
  //
  const [addProduct, setAddProduct] = useState("");
  const [codeProduct, setCodeProduct] = useState("");
  const [selectedFamiliesStatus, setSelectedFamiliesStatus] =
    useState("banana");
  const [costProduct, setCostProduct] = useState(0);
  const [selecteUomsStatus, setSelectedUomsStatus] = useState("unit");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [taxProduct, setTaxProduct] = useState("");
  const [quantityProduct, setQuantityProduct] = useState("");
  const [presentationProduct, setPresentationProduct] = useState("");
  const [selectedImageName, setSelectedImageName] = useState(null);

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
    formData.append("state", statusMapping[selectedStatus]);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    console.log("formDataObject", formDataObject);
    console.log("formDataObject", productId);
    try {
      const response = await axios.post(
        `${updateProductUrl}${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onClose();
      await fetchProducts(token);
      console.log("response.data", response.data);
    } catch (error) {
      console.error("Error al editar el producto:", error);
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
        <ExclamationCircleIcon className="h-8 w-8 text-green mb-2" />
        <h1 className="text-2xl font-bold text-green mb-2">Edit Product</h1>
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
              onChange={(e) => setCodeProduct(e.target.value)}
              type="text"
              required
            ></input>
          </div>
          <div>
            <label for="family">Family: </label>
            <select
              id="family"
              name="family"
              className="border p-3 rounded-md mr-3 mt-3"
              onChange={(e) => setSelectedFamiliesStatus(e.target.value)}
              value={selectedFamiliesStatus}
              required
            >
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
                id="weight"
                name="weight"
                className="border p-3 rounded-md mr-3 mt-3"
                onChange={(e) => setSelectedUomsStatus(e.target.value)}
                required
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
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                value={selectedCategoryId}
                required
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
            onChange={handleImageChange}
            required
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
            <input
              id="tax"
              name="tax"
              placeholder="1.2"
              className="border p-3 rounded-md mr-3 mt-3 w-40"
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
              Edit product
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
export default EditProduct;
