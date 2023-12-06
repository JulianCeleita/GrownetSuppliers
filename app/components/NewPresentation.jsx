import { useState, useEffect } from "react";
import axios from "axios";
import { addPresentationUrl, uomUrl, productsUrl } from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { fetchPresentations } from "../presentations/page";

function NewPresentation({ isvisible, onClose, setPresentations }) {
  const { token } = useTokenStore();

  const [uoms, setUoms] = useState([]);
  const [products, setProducts] = useState([]);

  //Variables formulario
  const [namePresentation, setNamePresentation] = useState("");
  const [costPresentation, setCostPresentation] = useState("");
  const [quantityPresentation, setQuantityPresentation] = useState("");
  const [selecteUomsStatus, setSelectedUomsStatus] = useState("unit");
  const [selecteProductsStatus, setSelectedProductsStatus] =
    useState("Red pepper");
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Api products
  useEffect(() => {
    axios
      .get(productsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
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
    };
    console.log("este es postData: ", postData);
    axios
      .post(addPresentationUrl, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        fetchPresentations(token, setPresentations);
        console.log("Se creó la presentación con éxito");
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
          <label>Unit of measurement of the product: </label>
          <select
            id="uom"
            name="uom"
            className="border p-3 rounded-md mr-3 mt-3"
            required
            onChange={(e) => setSelectedUomsStatus(e.target.value)}
          >
            <option> Select uom</option>
            {uoms.map((uom) => (
              <option key={uom.id} value={uom.id}>
                {uom.name}
              </option>
            ))}
          </select>
          <label for="produvt" className="mt-2">
            Product:
          </label>
          <select
            id="produvt"
            name="produvt"
            className="border p-3 rounded-md mr-3 mt-3"
            onChange={(e) => setSelectedProductsStatus(e.target.value)}
            required
          >
            <option> Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <label>Quantity: </label>
          <input
            className="border p-3 rounded-md mr-3 mt-3"
            placeholder="50"
            type="text"
            onChange={(e) => setQuantityPresentation(e.target.value)}
            required
          ></input>

          <div>
            <label>Packsize: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-[35.5%]"
              placeholder="6 Kg"
              type="text"
              onChange={(e) => setNamePresentation(e.target.value)}
              required
            ></input>
            <label>Value: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3  w-[39.5%]"
              placeholder="50"
              type="number"
              onChange={(e) => setCostPresentation(e.target.value)}
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
