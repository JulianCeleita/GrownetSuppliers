"use client";
import EditPresentation from "@/app/components/EditPresentation";
import NewPresentation from "@/app/components/NewPresentation";
import {
  deletePresentationUrl,
  presentationsUrl,
  productsUrl,
  uomUrl,
} from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import ModalDelete from "../components/ModalDelete";

export const fetchPresentations = async (
  token,
  setPresentations,
  setIsLoading
) => {
  try {
    const response = await axios.get(presentationsUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newPresentation = Array.isArray(response.data.presentations)
      ? response.data.presentations
      : [];

    setPresentations(newPresentation);
    setIsLoading(false);
    console.log("response.data.presentations", response.data.presentations)
  } catch (error) {
    console.error("Error al obtener las presentaciones:", error);
  }
};

function Presentations() {
  const { token } = useTokenStore();
  const [products, setProducts] = useState([]);
  const [uoms, setUoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  //Api
  const [presentations, setPresentations] = useState([]);


  useEffect(() => {
    fetchPresentations(token, setPresentations, setIsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Delete
  const [deleteResponse, setDeleteResponse] = useState(null);
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
        fetchPresentations(token, setPresentations, setIsLoading);
      })
      .catch((error) => {
        console.error("Error al eliminar la presentación:", error);
      });
  };
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
        console.log("response.data.products", response.data.products)
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedPresentations = presentations.slice().sort((a, b) => {
    const productNameA =
      products.find((product) => product.id === a.products_id)?.name || "";
    const productNameB =
      products.find((product) => product.id === b.products_id)?.name || "";
    return productNameA.localeCompare(productNameB);
  });

  return (
    <div>
      <div className="flex justify-between p-8 pb-20 bg-primary-blue">
        <h1 className="text-2xl text-white font-semibold">
          Presentations list
        </h1>
        <button
          className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:bg-dark-blue hover:scale-110 "
          type="button"
          onClick={() => setShowNewPresentations(true)}
        >
          <PlusCircleIcon className="h-6 w-6 mr-3 font-bold" />
          New Presentations
        </button>
      </div>
      <div className="flex items-center justify-center mb-40 -mt-14">
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-10">
          <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
            <tr className="border-b-2 border-stone-100 text-dark-blue">
              <th className="py-4 rounded-tl-lg">Product</th>
              <th className="py-4">Unit of measurement</th>
              <th className="py-4">Packsize</th>
              <th className="py-4">Cost</th>
              <th className="py-4">Qty</th>
              <th className="py-4 rounded-tr-lg">Operate</th>
            </tr>
          </thead>
          <tbody>
            {sortedPresentations.map((presentation) => (
              <tr
                key={presentation.id}
                className="text-dark-blue border-b-2 border-stone-100 "
              >
                <td className="py-4">
                  {products.find(
                    (product) => product.id === presentation.products_id
                  )?.name || ""}
                </td>
                <td className="py-4">
                  {uoms.map((uom) =>
                    uom.id === presentation.uoms_id ? uom.name : null
                  )}
                </td>

                <td className="py-4">{presentation.name}</td>
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
            ))}
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
        setPresentations={setPresentations}
        setIsLoading={setIsLoading}
      />
      <NewPresentation
        isvisible={showNewPresentations}
        onClose={() => setShowNewPresentations(false)}
        setPresentations={setPresentations}
        setIsLoading={setIsLoading}
      />
      {isLoading && (
        <div className="flex justify-center items-center mb-20">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-blue"></div>
        </div>
      )}
    </div>
  );
}
export default Presentations;
