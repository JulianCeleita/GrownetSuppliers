"use client";
import {
  MinusCircleIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import EditPresentation from "../../app/components/EditPresentation";
import { deletePresentationUrl } from "../../app/config/urls.config";
import useTokenStore from "../../app/store/useTokenStore";
import ModalDelete from "../components/ModalDelete";
import Layout from "../layoutS";
import useUserStore from "../store/useUserStore";
import Select, { menuPortalTarget } from 'react-select';
import {
  fetchPresentations,
  fetchPresentationsSupplier,
} from "../api/presentationsRequest";
import CreateProduct from "../components/CreateProduct";
import AutomaticShort from "../components/AutomaticShort";
import { fetchSuppliers } from "../api/suppliersRequest";

function Purchasing() {
  const { token } = useTokenStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showAutomaticShorts, setShowAutomaticShorts] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const { user, setUser } = useUserStore();

  //Api
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (user && user.rol_name === "AdminGrownet") {
      fetchPresentations(token, setProducts, setIsLoading);
    } else {
      fetchPresentationsSupplier(token, user, setProducts, setIsLoading);
    }
    fetchSuppliers(token, setSuppliers, setIsLoading);
  }, [user, token]);

  //Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeletePresentation = (presentation) => {
    const { id } = presentation;
    axios
      .delete(`${deletePresentationUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowDeleteModal(false);
        if (user && user.rol_name === "super") {
          fetchPresentations(token, setProducts, setIsLoading);
        } else {
          fetchPresentationsSupplier(token, user, setProducts, setIsLoading);
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la presentación:", error);
      });
  };

  const sortedPresentations = products.slice().sort((a, b) => {
    const presentationProductNameA = a.product_name || "";
    const presentationProductNameB = b.product_name || "";
    return presentationProductNameA.localeCompare(presentationProductNameB);
  });

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 -mt-24 overflow">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            <span className="text-light-green">Purchasing </span> list
          </h1>

          <div className="flex gap-4">
            <button
              className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:scale-110 transition-all"
              type="button"
              onClick={() => setShowNewPresentations(true)}
            >
              <PlusCircleIcon className="h-6 w-6 mr-2 font-bold" />
              New Purchasing
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mb-20 overflow-x-auto">
          <table className="w-[95%] bg-white first-line:bg-white rounded-2xl text-left shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="p-4 rounded-tl-lg">Code</th>
                <th className="p-4 rounded-tl-lg">Supplier</th>
                <th className="p-4 rounded-tl-lg">Description</th>
                <th className="p-4">SOH</th>
                <th className="p-4">Requisition</th>
                <th className="p-4">Future Requisition</th>
                <th className="p-4">Shorts</th>
                <th className="p-4">Ordered</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Notes</th>
                <th className="p-4">Total Cost</th>
                <th className="p-4 rounded-tr-lg">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-dark-blue border-b-2 border-stone-100">
                <td className="py-4 pl-3">Test</td>
                <td className="py-4">
                  <Select
                    value={selectedSupplierId}
                    onChange={(selectedOption) => setSelectedSupplierId(selectedOption)}
                    options={suppliers.map(supplier => ({
                      value: supplier.id,
                      label: supplier.name
                    }))}
                    menuPortalTarget={document.body}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        border: "none",
                        boxShadow: "none",
                        backgroundColor: "transparent",
                      }),
                      menu: (provided) => ({
                        ...provided,
                        width: "33em",
                      }),
                      singleValue: (provided, state) => ({
                        ...provided,
                        color: "#04444F",
                      }),
                      dropdownIndicator: (provided) => ({
                        ...provided,
                        display: "none",
                      }),
                      indicatorSeparator: (provided) => ({
                        ...provided,
                        display: "none",
                      }),
                    }}
                  />
                </td>
                <td className="py-4">Test</td>
                <td className="py-4">Test</td>
                <td className="py-4">Test</td>
                <td className="py-4">Test</td>
                <td className="py-4">
                  <input placeholder="Edit" className="w-20"></input>
                </td>
                <td className="py-4">Test</td>
                <td className="py-4">Test</td>
                <td className="py-4">
                  <input placeholder="Edit" className="w-20"></input>
                </td>
                <td className="py-4">£ Test</td>
                <td className="py-4">
                  <input placeholder="Edit" className="w-20"></input>
                </td>
                <td className="py-4">
                  <input placeholder="Edit" className="w-20"></input>
                </td>
              </tr>
              {/* {sortedPresentations.map((presentation) => (
                <tr
                  key={presentation.id}
                  className="text-dark-blue border-b-2 border-stone-100 "
                >
                  <td className="py-4">{presentation.code}</td>
                  <td className="py-4">Req</td>
                  <td className="py-4">Yes</td>
                  <td className="py-4">Boba</td>
                  <td className="py-4">{presentation.product_name}</td>
                  <td className="py-4">{presentation.uom}</td>
                  <td className="py-4">{presentation.name}</td>
                  <td className="py-4">{presentation.type}</td>
                  <td className="py-4">£ {presentation.cost}</td>
                  <td className="py-4">{presentation.quantity}</td>
                  <td className="py-4 flex justify-center">
                    <button
                      onClick={() => {
                        setSelectedPresentation(presentation);
                        setShowEditPresentations(true);
                      }}
                      className="flex text-primary-blue mr-6 font-medium hover:scale-110 hover:text-green hover:border-green"
                    >
                      <PencilSquareIcon className="h-6 w-6 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPresentation(presentation);
                        setShowDeleteModal(true);
                      }}
                      className="flex text-primary-blue font-medium hover:scale-110 hover:text-danger hover:border-danger"
                    >
                      <TrashIcon className="h-6 w-6 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
        <ModalDelete
          isvisible={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeletePresentation(selectedPresentation)}
        />
        <EditPresentation
          isvisible={showEditPresentations}
          onClose={() => setShowEditPresentations(false)}
          presentation={selectedPresentation}
          setPresentations={setProducts}
          setIsLoading={setIsLoading}
        />
        <CreateProduct
          isvisible={showNewPresentations}
          onClose={() => setShowNewPresentations(false)}
          setProducts={setProducts}
          setIsLoading={setIsLoading}
        />
        <AutomaticShort
          isvisible={showAutomaticShorts}
          onClose={() => setShowAutomaticShorts(false)}
          setProducts={setProducts}
          setIsLoading={setIsLoading}
        />
        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default Purchasing;
