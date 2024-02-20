"use client";
import { InformationCircleIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ModalDelete from "../components/ModalDelete";
import { priceDelete, priceUpdate } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/solid";
import {
  fetchCustomerBySupplier,
  fetchPrices,
  fetchPricesBySupplier,
} from "../api/catalogRequest";
import Select from "react-select";

import CreateProduct from "../components/CreateProduct";

import ModalPrices from "../components/ModalPrices";
import ModalEditProduct from "../components/ModalEditProduct";


const PricesView = () => {
  const router = useRouter();
  const { token } = useTokenStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState([]);
  const [showNewCustomers, setShowNewCustomers] = useState(false);
  const [status, setStatus] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const { user } = useUserStore();
  const [editedPrices, setEditedPrices] = useState({});
  const [showTableBody, setShowTableBody] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedAccountName, setSelectedAccountName] = useState("");

  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [showEditPresentations, setShowEditPresentations] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  const openModal = (catalog) => {
    setSelectedCatalog(catalog);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  const options = customerList.map((customer) => ({
    value: customer.accountName,
    label: customer.accountName,
  }));
  const handleChange = (selectedOption) => {
    setSelectedAccountName(selectedOption.value);
  };

  const handlePriceChange = (priceId, newValue) => {
    setEditedPrices((prevEditedPrices) => ({
      ...prevEditedPrices,
      [priceId]: newValue,
    }));
  };

  useEffect(() => {
    if (user?.rol_name == "AdminGrownet") {
      fetchPrices(token, user, setPrices, setIsLoading);
      fetchCustomerBySupplier(token, setCustomerList, setIsLoading);
    } else {
      fetchPricesBySupplier(token, user, setPrices, setIsLoading);
      fetchCustomerBySupplier(token, setCustomerList, setIsLoading);
    }
  }, [user, token]);

  const filteredPrices = prices.filter((price) => {
    return price.product?.toLowerCase().includes(searchTerm);
  });
  const sortedPrices = filteredPrices
    .filter(
      (price) =>
        selectedAccountName === "" || price.accountName === selectedAccountName
    )
    .slice()
    .sort((a, b) => {
      const priceNameA = a.accountName || "";
      const priceNameB = b.accountName || "";
      return priceNameA.localeCompare(priceNameB);
    });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeletePrice = (price) => {
    const { id } = price;
    axios
      .post(`${priceDelete}${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowDeleteModal(false);
        fetchPrices(token, user, setPrices, setIsLoading);
      })
      .catch((error) => {
        console.error("Error al eliminar el price: ", error);
      });
  };

  const calculateBandValue = (cost, percentage) => {
    const costValue = parseFloat(cost);
    const percentageValue = parseFloat(percentage);

    const markupMargin =
      (costValue * percentageValue) / (100 - percentageValue);

    const result = costValue + markupMargin;

    return result.toFixed(2);
  };
  const calculateUtilityValue = (price, cost, percentage, bands_id) => {
    const costValue = parseFloat(cost);
    const percentageValue = parseFloat(percentage);

    if (!bands_id) {
      // Si bands_id es null o vacío, calcular utility en porcentaje y en $
      const utilityPercentage = ((price.price - costValue) / costValue) * 100;
      const utilityDollars = price.price - costValue;

      return {
        percentage: utilityPercentage.toFixed(2),
        dollars: utilityDollars.toFixed(2),
      };
    }

    // Calcular el markup margin
    const markupMargin =
      (costValue * percentageValue) / (100 - percentageValue);
    return markupMargin.toFixed(2);
  };

  const getBandColorClass = (bandId) => {
    switch (bandId) {
      case 1:
        return "bg-green px-1";
      case 2:
        return "bg-green px-1";
      case 3:
        return "bg-green px-1";
      case 4:
        return "bg-green px-1";
      case 5:
        return "bg-green px-1";
      default:
        return "";
    }
  };

  const enviarData = (price, band_id) => {
    const priceId = price.price_id;
    const postData = {
      customers_accountNumber: price.customers_accountNumber,
      price: editedPrices[priceId] || price.price,
      bands_id: band_id,
      presentations_id: price.presentations_id,
      products_id: price.products_id,
    };
    axios
      .post(`${priceUpdate}${price.price_id}`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Price update successfully",
          showConfirmButton: false,
          timer: 1500,
        });
        if (user?.rol_name == "AdminGrownet") {
          fetchPrices(token, user, setPrices, setIsLoading);
        } else {
          fetchPricesBySupplier(token, user, setPrices, setIsLoading);
        }
      })
      .catch((error) => {
        console.error("Error al editar el customer: ", error);
      });
  };

  return (
    <Layout>
      <div>
        <div className="flex gap-5 p-8 -mt-24 ml-20 ">
          <h1 className="text-2xl text-white font-semibold mt-2">Catalogue</h1>
          <button
            className="flex bg-green mt-1 py-2 px-4 rounded-full text-white font-medium transition-all hover:bg-dark-blue hover:scale-110"
            type="button"
            onClick={() => setShowNewPresentations(true)}
          >
            <PlusCircleIcon className="h-6 w-6 mr-3 font-bold" />
            New Product
          </button>
        </div>

        <div className="flex relative items-center justify-center ml-5 ">
          <input
            type="text"
            placeholder="Search product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-xl w-[40%] pl-10 max-w-[72%]"
          />
          <Select
            options={options}
            onChange={handleChange}
            placeholder="select a customer"
            className="text-black"
            classNamePrefix="select"
            styles={{
              menuList: (provided) => ({
                ...provided,
                overflowX: 'hidden',
              }),
            }}
          />
        </div>

        <div className="flex items-center justify-center mb-20">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white">
              <th className={`py-4  ${showTableBody ? "" : "absolute"}`}>
                <button onClick={() => setShowTableBody(!showTableBody)}>
                  <ChevronDoubleDownIcon
                    className={`transform transition-transform duration-500 h-5 w-5 ${showTableBody ? "rotate-0" : "rotate-180"
                      }`}
                  />
                </button>
              </th>
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4">Code</th>
                <th className="py-4">Products</th>
                <th className="py-4">UOM</th>
                <th className="py-4">Cost</th>
                <th className="py-4">Profit %</th>
                <th className="py-4">Profit £</th>
                {/* <th className="py-4">Band 1</th>
                                <th className="py-4">Band 2</th>
                                <th className="py-4">Band 3</th>
                                <th className="py-4">Band 4</th>
                                <th className="py-4">Band 5</th> */}
                <th className="py-4">Arbitrary £</th>
                {/* TODO: si se decide implementar la columna price descomentar este codigo */}
                {/* <th className="py-4">Price</th> */}
                {/* <th className="py-4">Status</th> */}
                {/* <th className="py-4">Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {showTableBody &&
                sortedPrices.map((price) => (
                  <tr
                    key={price.price_id}
                    className="text-dark-blue border-b-2 border-stone-100 cursor-pointer"
                  >
                    <td
                      className="py-4"
                      onClick={() => {
                        setSelectedProduct(price)
                        setShowEditPresentations(true)
                      }}
                    >
                      5PP
                    </td>
                    <td
                      className="py-4"
                      onClick={() => {
                        setSelectedProduct(price)
                        setShowEditPresentations(true)
                      }}
                    >
                      {price.product} - {price.presentation}
                    </td>
                    <td
                      className="py-4"
                      onClick={() => {
                        setSelectedProduct(price)
                        setShowEditPresentations(true)
                      }}
                    >
                      kl
                    </td>
                    <td
                      className="py-4"
                      onClick={() => {
                        setSelectedProduct(price)
                        setShowEditPresentations(true)
                      }}
                    >
                      {price.cost}
                    </td>
                    {/* TODO: si se decide implementar la columna price descomentar este codigo */}
                    {/* <td className="py-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.push(`/price/${price.id}`, undefined, { shallow: true });
                                        }}
                                    >{price.price}</td> */}
                    {/* <td className={`py-4 ${getBandColorClass(price.bands_id)}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 1);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 10)}</div>
                                    </td>
                                    <td className={`py-4`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 2);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 20)}</div>
                                    </td>
                                    <td
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 3);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 30)}</div>
                                    </td>
                                    <td
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 4);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 40)}</div>
                                    </td>
                                    <td
                                        onClick={(e) => {
                                            e.preventDefault();
                                            enviarData(price, 5);
                                        }}
                                    >
                                        <div className="border-b-black bg-white">{calculateBandValue(price.cost, 50)}</div>
                                    </td> */}

                    <td
                      className="py-4"
                      onClick={() => {
                        setSelectedProduct(price)
                        setShowEditPresentations(true)
                      }}
                    >
                      {calculateUtilityValue(
                        price,
                        price.cost,
                        price.utility,
                        price.bands_id
                      ).percentage
                        ? calculateUtilityValue(
                          price,
                          price.cost,
                          price.utility,
                          price.bands_id
                        ).percentage
                        : price.utility}
                      %
                    </td>
                    <td
                      className="py-4"
                      onClick={() => {
                        setSelectedProduct(price)
                        setShowEditPresentations(true)
                      }}
                    >
                      {calculateUtilityValue(
                        price,
                        price.cost,
                        price.utility,
                        price.bands_id
                      ).dollars
                        ? calculateUtilityValue(
                          price,
                          price.cost,
                          price.utility,
                          price.bands_id
                        ).dollars
                        : calculateUtilityValue(
                          price,
                          price.cost,
                          price.utility,
                          price.bands_id
                        )}
                      $
                    </td>
                    <td
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="flex justify-center items-center"
                    >
                      <div className="mt-2.5 flex">
                        <input
                          type="text"
                          value={
                            editedPrices[price.price_id] !== undefined
                              ? editedPrices[price.price_id]
                              : price.price
                          }
                          onChange={(e) =>
                            handlePriceChange(price.price_id, e.target.value)
                          }
                          className="w-24 border-b-black bg-white p-1"
                        />
                        <button
                          onClick={() => openModal(price)}
                          title="Recommended prices"
                          className="ml-2 text-sm bg-blue-500 hover:bg-blue-700 text-white p-0.5 rounded"
                        >
                          <InformationCircleIcon className="h-7 w-7 font-bold" />
                        </button>
                      </div>
                    </td>
                    {/* <td>
                      <button
                        onClick={() => {
                          setSelectedPrice(price);
                          setShowDeleteModal(true);
                        }}
                        className="flex justify-center text-primary-blue font-medium hover:scale-110 transition-all hover:text-danger hover:border-danger"
                      >
                        <TrashIcon className="h-6 w-6" />
                        Delete
                      </button>
                    </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <CreateProduct
          isvisible={showNewPresentations}
          onClose={() => setShowNewPresentations(false)}
          setProducts={setProducts}
          setIsLoading={setIsLoading}
        />
        <ModalEditProduct
          isvisible={showEditPresentations}
          onClose={() => setShowEditPresentations(false)}
          setProducts={setProducts}
          setIsLoading={setIsLoading}
          
        />
        <ModalDelete
          isvisible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeletePrice(selectedPrice)}
        />
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="loader"></div>
          </div>
        )}
        {isModalOpen && (
          <ModalPrices
            isvisible={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            setIsLoading={setIsLoading}
            price={selectedCatalog}
            setPrices={setPrices}
          />
        )}
      </div>
    </Layout>
  );
};
export default PricesView;
