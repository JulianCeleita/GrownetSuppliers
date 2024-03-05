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
  fetchTypes,
} from "../api/presentationsRequest";
import ModalOrderError from "./ModalOrderError";

function AutomaticShort({ isvisible, onClose, setProducts, setIsLoading }) {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [products2, setProducts2] = useState([]);
  const [selecteProductsStatus, setSelectedProductsStatus] =
    useState("Red pepper");
  const [repeatedCode, setRepeatedCode] = useState(false);
  const [codePresentation, setCodePresentation] = useState("");
  const { user } = useUserStore();
  const [product, setProduct] = useState(true);
  const toggleProduct = () => {
    setProduct((current) => !current);
  };

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
  const sendData = (e) => {
    e.preventDefault();
    const postData = product
      ? {
          products_id: selecteProductsStatus,
        }
      : {
          products_id: selecteProductsStatus,
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
        onClose();
      })
      .catch((response, error) => {
        if (response.response.data.status === 400) {
          if (
            response.response.data.message.includes("Already existing code")
          ) {
            setRepeatedCode(true);
            console.log("Already existing code");
          }
        }
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
          Declare <span className="text-primary-blue">Automatic Shorts</span>
        </h1>
        <div className="flex">
          <button
            onClick={toggleProduct}
            className={`${
              product
                ? "bg-primary-blue hover:bg-dark-blue text-white"
                : "bg-white text-dark-blue"
            }  font-bold py-2 px-4 rounded`}
          >
            Product
          </button>{" "}
          <button
            onClick={toggleProduct}
            className={`${
              !product
                ? "bg-primary-blue hover:bg-dark-blue text-white"
                : "bg-white text-dark-blue"
            }  font-bold py-2 px-4 rounded`}
          >
            Category
          </button>
        </div>

        {product ? (
          <form className="text-left  flex flex-col" onSubmit={sendData}>
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
          <form className="text-left  flex flex-col" onSubmit={sendData}>
            <label htmlFor="produvt" className="mt-3">
              Category:
            </label>
            <select
              id="produvt"
              name="produvt"
              className="border p-3 rounded-md mr-3 my-3"
              onChange={(e) => setSelectedProductsStatus(e.target.value)}
              required
            >
              <option disabled selected>
                Select category
              </option>
              {/* {products2.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))} */}
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
        isvisible={repeatedCode}
        onClose={() => setRepeatedCode(false)}
        title={"Existing code"}
        message={
          "The code you have entered already exists in the system. Please use a unique code to create a new product."
        }
      />
    </div>
  );
}
export default AutomaticShort;
