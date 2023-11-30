import { useState, useEffect } from "react";
import axios from "axios";
import {
  uomUrl,
  productsUrl,
  updatePresentationUrl,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

function EditPresentation({
  isvisible,
  onClose,
  presentation,
  setPresentation,
}) {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);

  const [editedName, setEditedName] = useState(
    presentation ? presentation.name : ""
  );
  const [editedCost, setEditedCost] = useState(
    presentation ? presentation.cost : ""
  );

  //Variables formulario
  /*
  const [quantityPresentation, setQuantityPresentation] = useState("");
  const [selecteUomsStatus, setSelectedUomsStatus] = useState("unit");*/

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
        <form className="text-left  flex flex-col">
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
          <div>
            <label>Code: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="Foodpoint"
              type="text"
            ></input>
            <label>Quantity: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="50"
              type="text"
              required
            ></input>
          </div>
          <div>
            <label>Name: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-[40%]"
              placeholder="Foodpoint"
              type="text"
              required
              onChange={(e) => setEditedName(e.target.value)}
            ></input>
            <label>Value: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3  w-[40%]"
              placeholder="50"
              type="text"
              onChange={(e) => setEditedCost(e.target.value)}
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
