import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  addPresentationUrl,
  categoriesShort,
  categoriesUrl,
  productShort,
  productsUrl,
  taxexUrl,
  typeShort,
  typesUrl,
  uomUrl,
} from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import {
  fetchPresentations,
  fetchPresentationsSupplier,
  fetchTypes,
} from "../api/presentationsRequest";
import ModalOrderError from "./ModalOrderError";
import ModalSuccessfull from "./ModalSuccessfull";

function AutomaticShort({ isvisible, onClose, setProducts, setIsLoading }) {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [selecteProductsStatus, setSelectedProductsStatus] =
    useState("");
  const [selectedCategoriesId, setSelectedCategoriesId] =
    useState("");
  const [selectedTypeId, setSelectedTypeId] =
    useState("");
  const [repeatedCode, setRepeatedCode] = useState(false);
  const [codePresentation, setCodePresentation] = useState("");
  const { user } = useUserStore();
  const [product, setProduct] = useState(true);
  const [selectedShort, setSelectedShort] = useState("");
  const [selectedShort2, setSelectedShort2] = useState("");
  const [showModalSuccessfull, setShowModalSuccessfull] = useState(false);
  const [showModalError, setShowModalError] = useState(false);
  const [messageErrorType, setMessageErrorType] = useState("");
  const [descriptionData, setDescriptionData] = useState();

  const toggleProduct = () => {
    setProduct((current) => !current);
  };

  //Api products
  useEffect(() => {
    const fetchDataCategories = async () => {
      try {
        const response = await axios.get(categoriesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedCategories = response.data.categories.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const filteredCategories = sortedCategories.filter(
          (product) => product.stateProduct_id !== 2
        );
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    const fetchDataTypes = async () => {
      try {
        const response = await axios.get(typesUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const sortedTypes = response.data.type.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setTypes(sortedTypes);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchDataTypes()
    fetchDataCategories();
    fetchPresentationsSupplier(token, user, setProducts2, setIsLoading, setDescriptionData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!isvisible) {
    return null;
  }

  //Add automatic short api
  const sendDataProduct = (e) => {
    e.preventDefault();
    const postDataProduct = {
      flagshort: selectedShort
    }
    console.log("🚀 ~ sendDataProduct ~ postDataProduct:", postDataProduct)
    console.log("🚀 ~ sendDataProduct ~ selecteProductsStatus:", selecteProductsStatus)
    axios.post(`${productShort}${selecteProductsStatus}`, postDataProduct, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data.status === 500) {
          setMessageErrorType(response.data.message)
          setShowModalError(true);
        } else {
          setShowModalSuccessfull(true);
        }
        if (user.id_supplier) {
          fetchPresentationsSupplier(token, user, setProducts, setIsLoading);
        } else {
          fetchPresentations(token, setProducts, setIsLoading);
        }
      })
      .catch((response, error) => {
        setMessageErrorType(response.response.data.message);
        setShowModalError(true);
        console.error("Error al parametrizar el producto: ", error);
      });
  };
  const sendDataType = (e) => {
    e.preventDefault();
    const postDataType = {
      supplier_id: user.id_supplier,
      type_id: selectedTypeId,
      flagshort: selectedShort2
    }
    console.log("🚀 ~ sendDataType ~ postDataType:", postDataType)
    axios.post(typeShort, postDataType, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.data.status === 500) {
          setMessageErrorType(response.data.message)
          setShowModalError(true);
        } else {
          setShowModalSuccessfull(true);
        }
        if (user.id_supplier) {
          fetchPresentationsSupplier(token, user, setProducts, setIsLoading);
        } else {
          fetchPresentations(token, setProducts, setIsLoading);
        }
      })
      .catch((response, error) => {
        setMessageErrorType(error?.msg)
        setShowModalError(true);
        console.error("Error al parametrizar el type: ", error);
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
          Declare <span className="text-primary-blue">Automatic Shorts</span>
        </h1>
        <div className="flex">
          <button
            onClick={toggleProduct}
            className={`${product
              ? "bg-primary-blue hover:bg-dark-blue text-white"
              : "bg-white text-dark-blue"
              }  font-bold py-2 px-4 rounded`}
          >
            Product
          </button>{" "}
          <button
            onClick={toggleProduct}
            className={`${!product
              ? "bg-primary-blue hover:bg-dark-blue text-white"
              : "bg-white text-dark-blue"
              }  font-bold py-2 px-4 rounded`}
          >
            Type
          </button>
        </div>

        {product ? (
          <form className="text-left  flex flex-col" onSubmit={sendDataProduct}>
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
                  {product.product_name} - {product.name}
                </option>
              ))}
            </select>
            <label htmlFor="short" className="mt-2">
              Automatic short:
            </label>
            <select
              id="short"
              name="short"
              className="border p-3 rounded-md mr-3 my-3"
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
            <div className="mt-3 text-center">
              <button
                type="submit"
                value="Submit"
                className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
              >
                Send short
              </button>
              <button
                onClick={() => onClose()}
                className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form className="text-left  flex flex-col" onSubmit={sendDataType}>
            <label htmlFor="type" className="mt-3">
              Type:
            </label>
            <select
              id="type"
              name="type"
              className="border p-3 rounded-md mr-3 my-3"
              onChange={(e) => setSelectedTypeId(e.target.value)}
              required
            >
              <option disabled selected>
                Select type
              </option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <label htmlFor="short" className="mt-2">
              Automatic short:
            </label>
            <select
              id="short"
              name="short"
              className="border p-3 rounded-md mr-3 my-3"
              onChange={(e) => setSelectedShort2(e.target.value)}
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
            <div className="mt-3 text-center">
              <button
                type="submit"
                value="Submit"
                className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
              >
                Send short
              </button>
              <button
                onClick={() => onClose()}
                className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      <ModalOrderError
        isvisible={showModalError}
        onClose={() => setShowModalError(false)}
        title={"Error declaring the short"}
        message={messageErrorType}
      />
      <ModalSuccessfull
        isvisible={showModalSuccessfull}
        onClose={() => {
          setShowModalSuccessfull(false)
          if (showModalSuccessfull) {
            onClose();
          }
        }}
        title="Congratulations"
        text="Short declared correctly!"
        button=" Close"
        confirmed={true}
      />
    </div>
  );
}
export default AutomaticShort;
