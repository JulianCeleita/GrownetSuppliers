import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  addPresentationUrl,
  productsUrl,
  taxexUrl,
  uomUrl,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import {
  fetchPresentations,
  fetchPresentationsSupplier,
} from "../api/presentationsRequest";

function CreateProduct({ isvisible, onClose, setProducts, setIsLoading }) {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [namePresentation, setNamePresentation] = useState("");
  const [costPresentation, setCostPresentation] = useState("");
  const [quantityPresentation, setQuantityPresentation] = useState("");
  const [selecteUomsStatus, setSelectedUomsStatus] = useState("unit");
  const [selecteUomsStatus2, setSelectedUomsStatus2] = useState("");
  const [selecteProductsStatus, setSelectedProductsStatus] =
    useState("Red pepper");
  const [codePresentation, setCodePresentation] = useState("");
  const [tax, setTax] = useState([]);
  const [selectedTax, setSelectedTax] = useState("");
  const { user, setUser } = useUserStore();
  const [bulk, setBulk] = useState(true);
  const toggleBulk = () => {
    setBulk((current) => !current);
  };

  // Taxes
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(taxexUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedTaxes = response.data.taxes.sort(
          (a, b) => a.worth - b.worth
        );
        setTax(sortedTaxes);
        setSelectedTax(sortedTaxes[0].id || "");
      } catch (error) {
        console.error("Error al obtener Taxes productos:", error);
      }
    };
    fetchTaxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Api uom
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(uomUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedUoms = response.data.uoms.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setUoms(sortedUoms);
      } catch (error) {
        console.error("Error al obtener UOMS productos:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Api products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(productsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedProducts = response.data.products.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const filteredProducts = sortedProducts.filter(
          (product) => product.stateProduct_id !== 2
        );
        setProducts2(filteredProducts);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isvisible) {
    return null;
  }

  //Add presentation api
  const SendData = (e) => {
    e.preventDefault();
    const postData = bulk
      ? {
          uoms_id: selecteUomsStatus,
          products_id: selecteProductsStatus,
          quantity: quantityPresentation,
          name: `${namePresentation.trim()} ${selecteUomsStatus2}`,
          cost: costPresentation,
          code: codePresentation,
          tax: selectedTax,
          supplier_id: user.id_supplier,
        }
      : {
          uoms_id: selecteUomsStatus,
          products_id: selecteProductsStatus,
          quantity: quantityPresentation,
          name: `${namePresentation.trim()} ${selecteUomsStatus2}`,
          cost: costPresentation,
          code: codePresentation,
          supplier_id: user.id_supplier,
        };
    axios
      .post(addPresentationUrl, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (user.id_supplier) {
          fetchPresentationsSupplier(token, user, setProducts, setIsLoading);
        } else {
          fetchPresentations(token, setProducts, setIsLoading);
        }
        setSelectedUomsStatus("");
        setSelectedProductsStatus("");
        onClose();
      })
      .catch((error) => {
        console.error("Error al agregar la nueva presentación: ", error);
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
        <div className="flex">
          <button
            onClick={toggleBulk}
            className={`${
              bulk
                ? "bg-blue-500 hover:bg-blue-700 text-white"
                : "bg-white text-dark-blue"
            }  font-bold py-2 px-4 rounded`}
          >
            Bulk
          </button>{" "}
          <button
            onClick={toggleBulk}
            className={`${
              !bulk
                ? "bg-blue-500 hover:bg-blue-700 text-white"
                : "bg-white text-dark-blue"
            }  font-bold py-2 px-4 rounded`}
          >
            Split
          </button>
        </div>

        {bulk ? (
          <form className="text-left  flex flex-col" onSubmit={SendData}>
            <label htmlFor="produvt" className="mt-2">
              Product:
            </label>
            <select
              id="produvt"
              name="produvt"
              className="border p-3 rounded-md mr-3 my-3"
              onChange={(e) => setSelectedProductsStatus(e.target.value)}
              required
            >
              <option disabled selected>
                Select product
              </option>
              {products2.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <div>
              <label>Unit of measurement: </label>
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
              <label htmlFor="taxes">Product taxes: </label>
              <select
                id="taxes"
                name="taxes"
                className="border p-3 rounded-md mr-3 mt-3"
                required
                onChange={(e) => setSelectedTax(e.target.value)}
              >
                <option value="" disabled selected>
                  Select tax
                </option>
                {tax.map((tax) =>
                  tax.countries_indicative === 44 ? (
                    <option key={tax.id} value={tax.id}>
                      {tax.name}
                    </option>
                  ) : null
                )}
              </select>
            </div>
            <div>
              <label>Code: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3"
                placeholder="50"
                onChange={(e) => setCodePresentation(e.target.value)}
                type="text"
                value={codePresentation}
              ></input>
              <label className="ml-9">Packsize: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3 w-[12%]"
                placeholder="6"
                type="text"
                onChange={(e) => setNamePresentation(e.target.value)}
                required
              ></input>
              <select
                id="uom"
                name="uom"
                className="border p-3 rounded-md mr-3 mt-3"
                onChange={(e) => setSelectedUomsStatus2(e.target.value)}
                required
              >
                <option value="" disabled selected>
                  UOM
                </option>
                {uoms.map((uom) => (
                  <option key={uom.id} value={uom.name}>
                    {uom.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Cost: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3  w-[35.5%]"
                placeholder="50"
                type="number"
                step="0.01"
                onChange={(e) => setCostPresentation(e.target.value)}
                required
              ></input>
              <label className="ml-2">Quantity: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3"
                placeholder="50"
                type="text"
                onChange={(e) => setQuantityPresentation(e.target.value)}
                required
              ></input>
            </div>
            <div className="mt-3 text-center">
              <button
                type="submit"
                value="Submit"
                className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
              >
                Add Product
              </button>
              <button
                onClick={() => onClose()}
                className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
              >
                Close
              </button>
            </div>
          </form>
        ) : (
          <form className="text-left  flex flex-col" onSubmit={SendData}>
            <label htmlFor="produvt" className="mt-2">
              Sub product:
            </label>
            <select
              id="produvt"
              name="produvt"
              className="border p-3 rounded-md mr-3 my-3"
              onChange={(e) => setSelectedProductsStatus(e.target.value)}
              required
            >
              <option disabled selected>
                Select sub product
              </option>
              {/* {products2.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))} */}
            </select>
            <div>
              <label>Unit of measurement: </label>
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
              <label>Code: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3"
                placeholder="50"
                onChange={(e) => setCodePresentation(e.target.value)}
                type="text"
                value={codePresentation}
              ></input>
              <label className="ml-9">Packsize: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3 w-[12%]"
                placeholder="6"
                type="text"
                onChange={(e) => setNamePresentation(e.target.value)}
                required
              ></input>
              <select
                id="uom"
                name="uom"
                className="border p-3 rounded-md mr-3 mt-3"
                onChange={(e) => setSelectedUomsStatus2(e.target.value)}
                required
              >
                <option value="" disabled selected>
                  UOM
                </option>
                {uoms.map((uom) => (
                  <option key={uom.id} value={uom.name}>
                    {uom.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Cost: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3  w-[35.5%]"
                placeholder="50"
                type="number"
                step="0.01"
                onChange={(e) => setCostPresentation(e.target.value)}
                required
              ></input>
              <label className="ml-2">Quantity: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3"
                placeholder="50"
                type="text"
                onChange={(e) => setQuantityPresentation(e.target.value)}
                required
              ></input>
            </div>
            <div className="mt-3 text-center">
              <button
                type="submit"
                value="Submit"
                className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
              >
                Add Sub Product
              </button>
              <button
                onClick={() => onClose()}
                className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
              >
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export default CreateProduct;
