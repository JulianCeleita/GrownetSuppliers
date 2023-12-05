"use client";
import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import NewPresentation from "@/app/components/NewPresentation";
import EditPresentation from "@/app/components/EditPresentation";
import axios from "axios";
import {
  presentationsUrl,
  productsUrl,
  uomUrl,
  deletePresentationUrl,
} from "@/app/config/urls.config";
import useTokenStore from "@/app/store/useTokenStore";
import useProductStore from "../store/useProductStore";

export const fetchPresentations = async (token, setPresentations, setIsLoading) => {
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

  //Variable edit Presentation
  const [selectedPresentation, setSelectedPresentation] = useState(null);

  //Api
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    fetchPresentations(token, setPresentations, setIsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Delete
  const [deleteResponse, setDeleteResponse] = useState(null);
  const handleDeletePresentation = (presentation) => {
    const { id } = presentation;
    axios
      .delete(`${deletePresentationUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchPresentations(token, setPresentations);
        console.log("Se borro con éxito");
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
      <div className="flex items-center justify-center mb-6 -mt-14">
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-6">
          <thead>
            <tr className="border-b-2 border-stone-100 text-dark-blue">
              <th className="py-4">Product</th>
              <th className="py-4">Unit of measurement</th>
              <th className="py-4">Packsize</th>
              <th className="py-4">Cost</th>
              <th className="py-4">Qty</th>
              <th className="py-4">Operate</th>
            </tr>
          </thead>
          <tbody>
            {presentations.map((presentation) => (
              <tr
                key={presentation.id}
                className="text-dark-blue border-b-2 border-stone-100 "
              >
                <td className="py-4">
                  {products.map((product) =>
                    product.id === presentation.products_id
                      ? product.name
                      : null
                  )}
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
                    onClick={() => handleDeletePresentation(presentation)}
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
      <EditPresentation
        isvisible={showEditPresentations}
        onClose={() => setShowEditPresentations(false)}
        presentation={selectedPresentation}
        setPresentations={setPresentations}
      />
      <NewPresentation
        isvisible={showNewPresentations}
        onClose={() => setShowNewPresentations(false)}
        setPresentations={setPresentations}
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
