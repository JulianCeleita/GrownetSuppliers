import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { addPresentationUrl, productsUrl, uomUrl, taxexUrl } from "../config/urls.config";
import { fetchPresentations } from "../presentations/page";
import useTokenStore from "../store/useTokenStore";
import ReactCountryFlag from "react-country-flag";

function NewPresentation({
  isvisible,
  onClose,
  setPresentations,
  setIsLoading,
}) {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [products, setProducts] = useState([]);
  const [namePresentation, setNamePresentation] = useState("");
  const [costPresentation, setCostPresentation] = useState("");
  const [quantityPresentation, setQuantityPresentation] = useState("");
  const [selecteUomsStatus, setSelectedUomsStatus] = useState("unit");
  const [selecteProductsStatus, setSelectedProductsStatus] =
    useState("Red pepper");
  const [codePresentation, setCodePresentation] = useState("");
  const [tax, setTax] = useState([]);
  const [selectedTax, setSelectedTax] = useState("");

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
        console.log(sortedTaxes);
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
        setProducts(filteredProducts);
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
  const enviarData = (e) => {
    e.preventDefault();
    const postData = {
      uoms_id: selecteUomsStatus,
      products_id: selecteProductsStatus,
      quantity: quantityPresentation,
      name: namePresentation,
      cost: costPresentation,
      code: codePresentation,
      tax: selectedTax,
    };
    console.log("se envio: ", postData);
    axios
      .post(addPresentationUrl, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchPresentations(token, setPresentations, setIsLoading);
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
          Add <span className="text-primary-blue">new presentation</span>
        </h1>
        <form className="text-left  flex flex-col" onSubmit={enviarData}>
          <label for="produvt" className="mt-2">
            Product:
          </label>
          <select
            id="produvt"
            name="produvt"
            className="border p-3 rounded-md mr-3 my-3"
            onChange={(e) => setSelectedProductsStatus(e.target.value)}
            required
          >
            <option value="" disabled selected>
              Select product
            </option>
            {products.map((product) => (
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
                {tax.map((tax) => (
                  <option key={tax.id} value={tax.id}>
                    {tax.countries_indicative === 44 ? (
                      <ReactCountryFlag countryCode="GB" />
                    ) : tax.countries_indicative === 57 ? (
                      <ReactCountryFlag countryCode="CO" />
                    ) : tax.countries_indicative === 351 ? (
                      <ReactCountryFlag countryCode="PT" />
                    ) : tax.countries_indicative === 34 ? (
                      <ReactCountryFlag countryCode="ES" />
                    ) : null}{" "}
                    {tax.name}
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
            <label>Packsize: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-[35.5%]"
              placeholder="6 Kg"
              type="text"
              onChange={(e) => setNamePresentation(e.target.value)}
              required
            ></input>
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
            <label>Quantity: </label>
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
              Add Presentation
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
export default NewPresentation;
