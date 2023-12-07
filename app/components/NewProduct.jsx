import useCategoryStore from "@/app/store/useCategoryStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { addProductUrl, familiesUrl, uomUrl } from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";

function NewProduct({ isvisible, onClose, fetchProducts }) {
  const { token } = useTokenStore();
  const { categories } = useCategoryStore();
  const [addProduct, setAddProduct] = useState("");
  const [taxProduct, setTaxProduct] = useState("");
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedFamiliesStatus, setSelectedFamiliesStatus] =
    useState("banana");
  const [families, setFamilies] = useState([]);
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

        const sortedFamilies = response.data.families.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setFamilies(sortedFamilies);
        setSelectedFamiliesStatus(sortedFamilies[0]?.id || "");
      } catch (error) {
        console.error("Error al obtener las familias de productos:", error);
      }
    };

    fetchFamilies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isvisible) {
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImageName(file);
  };

  // Add product api
  const enviarData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", addProduct);
    formData.append("category_id", selectedCategoryId);
    formData.append("country_indicative", "44");
    formData.append("family_id", selectedFamiliesStatus);
    if (selectedImageName !== null) {
      formData.append("image", selectedImageName);
    }
    formData.append("code", "Y100");
    formData.append("tax", taxProduct);

    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    try {
      const response = await axios.post(addProductUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onClose();
      await fetchProducts(token);
    } catch (error) {
      console.error("Error al crear el producto:", error);
    console.log('ESTO ENVIA:', formData);
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
          </div>

          <div className="flex ">
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
            <div>
              <label>Product taxes: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3 w-[50px]"
                placeholder="1.2"
                type="text"
                onChange={(e) => setTaxProduct(e.target.value)}
                required
              ></input>
            </div>
          </div>
          <label className="mt-4">Attach the product&apos;s photo: </label>
          <input
            className="p-3 rounded-md mr-3 mt-3 cursor-pointer"
            placeholder="Fruit"
            type="file"
            onChange={handleImageChange}
          ></input>

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
