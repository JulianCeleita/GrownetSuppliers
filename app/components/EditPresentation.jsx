import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  productsUrl,
  taxexUrl,
  uomUrl,
  updatePresentationUrl,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import {
  fetchPresentations,
  fetchPresentationsSupplier,
} from "../api/presentationsRequest";

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
  const [tax, setTax] = useState([]);
  const { user, setUser } = useUserStore();

  //Variables formulario
  const [editedName, setEditedName] = useState(() => {
    if (presentation && presentation.name) {
      return presentation.name;
    } else {
      return "UOM";
    }
  });

  const [editedCost, setEditedCost] = useState(
    presentation ? presentation.cost : ""
  );
  const [editedQuantity, setEditedQuantity] = useState(
    presentation ? presentation.quantity : ""
  );
  const [selectedUomsStatus, setSelectedUomsStatus] = useState(
    presentation ? presentation.uoms_id : ""
  );
  const [selecteUomsStatus2, setSelectedUomsStatus2] = useState("");
  const [selectedProductsStatus, setSelectedProductsStatus] = useState(
    presentation ? presentation.products_id : ""
  );
  const [codePresentation, setCodePresentation] = useState(
    presentation ? presentation.code : ""
  );
  const [selectedTax, setSelectedTax] = useState(
    presentation ? presentation.tax : ""
  );

  useEffect(() => {
    setEditedName(() => {
      if (
        presentation &&
        presentation.name &&
        presentation.name.includes("-")
      ) {
        return presentation.name;
      } else {
        return "UOM";
      }
    });
    setEditedCost(presentation ? presentation.cost : "");
    setEditedQuantity(presentation ? presentation.quantity : "");
    setSelectedUomsStatus(presentation ? presentation.uoms_id : "");
    setSelectedProductsStatus(presentation ? presentation.products_id : "");
    setCodePresentation(presentation ? presentation.code : "");
    setSelectedTax(presentation ? presentation.taxes_id : "");
  }, [presentation]);

  // Api products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(productsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedProducts = response?.data?.products.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const filteredProducts = sortedProducts?.filter(
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

  // Taxes
  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const response = await axios.get(taxexUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedTaxes = response?.data?.taxes.sort(
          (a, b) => a.worth - b.worth
        );
        setTax(sortedTaxes);
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

        const sortedUoms = response?.data?.uoms?.sort((a, b) =>
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
  const handleEditPresentation = async (event) => {
    event.preventDefault();

    const postData = {
      uoms_id: selectedUomsStatus,
      quantity: editedQuantity,
      name: `${editedName}  ${selecteUomsStatus2}`,
      cost: editedCost,
      products_id: selectedProductsStatus,
      code: codePresentation,
      tax: selectedTax,
      supplier_id: user ? user.id_supplier : null,
    };

    try {
      const response = await axios.post(
        `${updatePresentationUrl}${presentation.id}`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (user && user?.ron_name !== "AdminGrownet") {
        fetchPresentationsSupplier(token, user, setPresentations, setIsLoading);
      } else {
        fetchPresentations(token, setPresentations, setIsLoading);
      }

      setSelectedUomsStatus("");
      setSelectedProductsStatus("");
      onClose();
    } catch (error) {
      console.error("Error editando la presentación:", error);
    }
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
          <label htmlFor="produvt" className="mt-2">
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
            <option value="" disabled>
              Select product
            </option>
            {products?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.id} - {product.name}
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
              value={selectedUomsStatus}
            >
              <option value="" disabled>
                Select uom
              </option>
              {uoms?.map((uom) => (
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
              value={selectedTax}
            >
              <option value="" disabled>
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
            <label>Packsize: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-[12%]"
              placeholder="UOM"
              type="text"
              required
              value={editedName.split(" ")[0]}
              onChange={(e) => setEditedName(e.target.value)}
            ></input>
            <select
              id="uom"
              name="uom"
              className="border p-3 rounded-md mr-3 mt-3"
              required
              onChange={(e) => setSelectedUomsStatus2(e.target.value)}
            >
              <option value="" disabled>
                UOM
              </option>
              {uoms?.map((uom) => (
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
              Adit Presentation
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
