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
  fetchTypes,
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
  const [types, setTypes] = useState([]);
  const [selectedTypeId, setSelectedTypeId] = useState([]);

  //Variables formulario
  const [editedName, setEditedName] = useState(() => {
    if (presentation && presentation.name) {
      return presentation.name;
    } else {
      return "UOM";
    }
  });

  const [selectedType, setSelectedType] = useState("");

  const [editedName2, setEditedName2] = useState("");

  const [editedCost, setEditedCost] = useState(
    presentation ? presentation.cost : ""
  );
  const [editedQuantity, setEditedQuantity] = useState(
    presentation ? presentation.quantity : ""
  );
  const [selectedShort, setSelectedShort] = useState("");
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
  const [selectedDivisible, setSelectedDivisible] = useState(
    presentation ? presentation.is_divisible : ""
  );

  useEffect(() => {
    if (presentation && presentation.name) {
      const [firstPart, ...rest] = presentation.name.split(" ");
      setEditedName(firstPart);
      setEditedName2(rest.join(" "));
    } else {
      setEditedName("UOM");
      setEditedName2("");
    }
    setEditedCost(presentation ? presentation.cost : "");
    setEditedQuantity(presentation ? presentation.quantity : "");
    setSelectedUomsStatus(presentation ? presentation.uoms_id : "");
    setSelectedProductsStatus(presentation ? presentation.products_id : "");
    setCodePresentation(presentation ? presentation.code : "");
    setSelectedTax(presentation ? presentation.taxes_id : "");
    setSelectedType(presentation ? presentation.type : "");
    setSelectedTypeId(presentation ? presentation.type_id : "");
    setSelectedDivisible(presentation ? presentation.is_divisible : "");
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
    fetchTypes(token, setTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Api editar
  const handleEditPresentation = async (event) => {
    event.preventDefault();

    const postData = {
      uoms_id: selectedUomsStatus,
      quantity: editedQuantity,
      name: `${editedName.trim()}  ${editedName2}`,
      cost: editedCost,
      products_id: selectedProductsStatus,
      code: codePresentation,
      tax: selectedTax,
      type: selectedTypeId,
      supplier_id: user ? user.id_supplier : null,
      flagshort: selectedShort,
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
      setSelectedType("");
      setSelectedTypeId("");
      onClose();
    } catch (error) {
      console.error("Error editando la presentación:", error);
    }
  };

  if (!isvisible) {
    return null;
  }
  console.log(presentation);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[800px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-dark-blue">
          Edit <span className="text-primary-blue">product</span>
        </h1>
        <form
          className="text-left  flex flex-col mt-2"
          onSubmit={handleEditPresentation}
        >
          <div className="flex items-center gap-2 ">
            <label htmlFor="produvt" className="mt-2">
              Product:
            </label>
            <select
              id="produvt"
              name="produvt"
              className="border p-3 rounded-md w-full"
              onChange={(e) => setSelectedProductsStatus(e.target.value)}
              value={selectedProductsStatus}
              required
            >
              <option value="" disabled>
                Select product
              </option>
              {products?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 mt-2 w-[50%]">
              <div className="flex items-center gap-2">
                <label className="w-[240px]">
                  Unit of measurement:{" "}
                  <span className="text-primary-blue">*</span>{" "}
                </label>
                <select
                  id="uom"
                  name="uom"
                  className="border p-3 rounded-md w-full"
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
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="taxes" className="">
                  Type product: <span className="text-primary-blue">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className="border p-3 rounded-md w-full"
                  required
                  onChange={(e) => setSelectedTypeId(e.target.value)}
                  value={selectedTypeId}
                >
                  <option value="" disabled selected>
                    Type product
                  </option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-[80px]">
                  Code: <span className="text-primary-blue">*</span>{" "}
                </label>
                <input
                  className="border p-3 rounded-md w-full"
                  placeholder="50"
                  onChange={(e) => setCodePresentation(e.target.value)}
                  type="text"
                  value={codePresentation}
                ></input>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-[80px]">
                  Cost: <span className="text-primary-blue">*</span>{" "}
                </label>
                <input
                  className="border p-3 rounded-md w-full"
                  placeholder="50"
                  type="number"
                  step="0.01"
                  value={editedCost}
                  onChange={(e) => setEditedCost(e.target.value)}
                  required
                ></input>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2 w-[50%]">
              <div className="flex items-center gap-2">
                <label htmlFor="taxes" className="w-[130px]">
                  Product taxes: <span className="text-primary-blue">*</span>{" "}
                </label>
                <select
                  id="taxes"
                  name="taxes"
                  className="border p-3 rounded-md w-full"
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
                        {`${tax.worth * 100}%`}
                      </option>
                    ) : null
                  )}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="taxes" className="w-[150px]">
                  Is divisible: <span className="text-primary-blue">*</span>
                </label>
                <select
                  value={selectedDivisible}
                  onChange={(e) => setSelectedDivisible(e.target.value)}
                  className="border p-2 rounded-md w-full"
                >
                  <option key="no" value={0}>
                    No
                  </option>
                  <option key="yes" value={1}>
                    Yes
                  </option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="w-[350px]">
                  Packsize: <span className="text-primary-blue">*</span>
                </label>
                <input
                  className="border p-3 rounded-md  w-full"
                  placeholder="UOM"
                  type="text"
                  required
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                ></input>
                <select
                  id="uom"
                  name="uom"
                  className="border p-3 rounded-md w-full"
                  required
                  value={editedName2}
                  onChange={(e) => setEditedName2(e.target.value)}
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
              <div className="flex items-center gap-2">
                <label className="w-[160px]">
                  Conversion: <span className="text-primary-blue">*</span>{" "}
                </label>
                <input
                  className="border p-3 rounded-md w-full"
                  placeholder="50"
                  type="text"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                  required
                ></input>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label htmlFor="short" className="w-[180px]">
              Automatic short:
            </label>
            <select
              id="short"
              name="short"
              className="border p-3 rounded-md w-full"
              onChange={(e) => setSelectedShort(e.target.value)}
              required
            >
              <option disabled selected>
                Select option
              </option>
              <option key={"1"} value="1">
                Active
              </option>
              <option key={"0"} value="0">
                Disable
              </option>
            </select>
          </div>

          <div className="mt-3 text-center">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Edit Presentation
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
