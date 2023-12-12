import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  productsUrl,
  uomUrl,
  updatePresentationUrl,
} from "../config/urls.config";
import { fetchPresentations } from "../presentations/page";
import useTokenStore from "../store/useTokenStore";

function EditPresentation({
  isvisible,
  onClose,
  presentation,
  setPresentations,
  setIsLoading,
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
    presentation ? presentation.uoms_id : ""
  );
  const [selectedProductsStatus, setSelectedProductsStatus] = useState(
    presentation ? presentation.products_id : ""
  );
  const [codePresentation, setCodePresentation] = useState(
    presentation ? presentation.code : ""
  );

  useEffect(() => {
    setEditedName(presentation ? presentation.name : "");
    setEditedCost(presentation ? presentation.cost : "");
    setEditedQuantity(presentation ? presentation.quantity : "");
    setSelectedUomsStatus(presentation ? presentation.uoms_id : "");
    setSelectedProductsStatus(presentation ? presentation.products_id : "");
    setCodePresentation(presentation ? presentation.code : "");
  }, [presentation]);

  //Api products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bodyProducts = {
          country: 44,
        };
        const response = await axios.post(productsUrl, bodyProducts, {
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

  //Api editar
  const handleEditPresentation = (event) => {
    event.preventDefault();

    const postData = {
      uoms_id: selectedUomsStatus,
      quantity: editedQuantity,
      name: editedName,
      cost: editedCost,
      products_id: selectedProductsStatus,
      code: codePresentation,
    };
    axios
      .post(`${updatePresentationUrl}${presentation.id}`, postData, {
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
          <label for="produvt" className="mt-2">
            Product:
          </label>
          <select
            id="produvt"
            name="produvt"
            className="border p-3 rounded-md mr-3 my-3"
            onChange={(e) => setSelectedProductsStatus(e.target.value)}
            value={selectedProductsStatus}
            required
          >
            <option value="" disabled selected>
              Select product
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.id} - {product.name}
              </option>
            ))}
          </select>
          <label>Unit of measurement of the product: </label>
          <select
            id="uom"
            name="uom"
            className="border p-3 rounded-md mr-3 mt-3"
            required
            onChange={(e) => setSelectedUomsStatus(e.target.value)}
            value={selectedUomsStatus}
          >
            <option value="" disabled selected>
              Select uom
            </option>
            {uoms.map((uom) => (
              <option key={uom.id} value={uom.id}>
                {uom.id} - {uom.name}
              </option>
            ))}
          </select>

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
              placeholder="Foodpoint"
              type="text"
              required
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            ></input>
          </div>
          <div>
            <label>Cost: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3  w-[35.5%]"
              placeholder="50"
              type="number"
              step="0.01"
              value={editedCost}
              onChange={(e) => setEditedCost(e.target.value)}
              required
            ></input>

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
