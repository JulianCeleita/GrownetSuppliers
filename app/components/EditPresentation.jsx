import { useState, useEffect } from "react";
import axios from "axios";
import {
  uomUrl,
  productsUrl,
  updatePresentationUrl,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { fetchPresentations } from "../presentations/page";

function EditPresentation({
  isvisible,
  onClose,
  presentation,
  setPresentations,
}) {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [products, setProducts] = useState([]);

  //Variables formulario
  const [editedName, setEditedName] = useState(
    presentation ? presentation.name : ""
  );
  const [editedCost, setEditedCost] = useState(
    presentation ? presentation.cost : ""
  );
  const [editedQuantity, setEditedQuantity] = useState(
    presentation ? presentation.quantity : ""
  );
  const [selectedUomsStatus, setSelectedUomsStatus] = useState(
    presentation ? presentation.uoms : ""
  );
  const [selectedProductsStatus, setSelectedProductsStatus] = useState(
    presentation ? presentation.products : ""
  );

  useEffect(() => {
    console.log("Presentation Prop:", presentation);
    setEditedName(presentation ? presentation.name : "");
    setEditedCost(presentation ? presentation.cost : "");
    setEditedQuantity(presentation ? presentation.quantity : "");
    setSelectedUomsStatus(presentation ? presentation.uoms : "");
    setSelectedProductsStatus(presentation ? presentation.products : "");
  }, [presentation]);

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

  //Api editar
  const handleEditPresentation = (event) => {
    event.preventDefault();
    const postData = {
      uoms_id: selectedUomsStatus,
      quantity: editedQuantity,
      name: editedName,
      cost: editedCost,
      products_id: selectedProductsStatus,
    };
    console.log("este es postData: ", postData);
    axios
      .post(`${updatePresentationUrl}${presentation.id}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchPresentations(token, setPresentations);
        onClose();
      })
      .catch((error) => {
        console.error("Error editando la presentación:", error);
      });
  };

  if (!isvisible) {
    return null;
  }
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
        <h1 className="text-2xl font-bold text-green mb-2">
          Edit presentation
        </h1>
        <form
          className="text-left  flex flex-col"
          onSubmit={handleEditPresentation}
        >
          <div>
            <label>Unit weight of the product: </label>
            <select
              id="uom"
              name="uom"
              className="border p-3 rounded-md mr-3 mt-3"
              required
              onChange={(e) => setSelectedUomsStatus(e.target.value)}
              value={selectedUomsStatus}
            >
              <option> Select uom</option>
              {uoms.map((uom) => (
                <option key={uom.id} value={uom.id}>
                  {uom.id} - {uom.name}
                </option>
              ))}
            </select>
            <label>Quantity: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="50"
              type="text"
              value={editedQuantity}
              onChange={(e) => setEditedQuantity(e.target.value)}
              required
            ></input>
          </div>
          <div>
            <label>Name: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-[39.8%]"
              placeholder="Foodpoint"
              type="text"
              required
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            ></input>
            <label>Value: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3  w-[39.8%]"
              placeholder="50"
              type="text"
              value={editedCost}
              onChange={(e) => setEditedCost(e.target.value)}
              required
            ></input>
          </div>
          <label for="produvt" className="mt-2">
            Product:
          </label>
          <select
            id="produvt"
            name="produvt"
            className="border p-3 rounded-md mr-3 mt-3"
            onChange={(e) => setSelectedProductsStatus(e.target.value)}
            value={selectedProductsStatus}
            required
          >
            <option> Select product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.id} - {product.name}
              </option>
            ))}
          </select>
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
export default EditPresentation;
