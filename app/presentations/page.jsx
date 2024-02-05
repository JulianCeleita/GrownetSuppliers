"use client";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import EditPresentation from "../../app/components/EditPresentation";
import NewPresentation from "../../app/components/NewPresentation";
import { deletePresentationUrl } from "../../app/config/urls.config";
import useTokenStore from "../../app/store/useTokenStore";
import ModalDelete from "../components/ModalDelete";
import Layout from "../layoutS";
import useUserStore from "../store/useUserStore";
import {
  fetchPresentations,
  fetchPresentationsSupplier,
} from "../axiosRequests/presentationsRequest";

function Presentations() {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const { user, setUser } = useUserStore();

  //Api
  const [presentations, setPresentations] = useState([]);

  useEffect(() => {
    var localStorageUser = JSON.parse(localStorage.getItem("user"));
    setUser(localStorageUser);
  }, [setUser]);

  useEffect(() => {
    if (user && user.rol_name === "AdminGrownet") {
      fetchPresentations(token, setPresentations, setIsLoading);
    } else {
      fetchPresentationsSupplier(token, user, setPresentations, setIsLoading);
    }
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
          fetchPresentations(token, setPresentations, setIsLoading);
        } else {
          fetchPresentationsSupplier(
            token,
            user,
            setPresentations,
            setIsLoading
          );
        }
      })
      .catch((error) => {
        console.error("Error al eliminar la presentación:", error);
      });
  };

  const sortedPresentations = presentations.slice().sort((a, b) => {
    const presentationProductNameA = a.product_name || "";
    const presentationProductNameB = b.product_name || "";
    return presentationProductNameA.localeCompare(presentationProductNameB);
  });

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 bg-primary-blue">
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
        <div className="flex items-center justify-center mb-20">
          <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Code</th>
                <th className="py-4">Product</th>
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
                  <td className="py-4">{presentation.code}</td>
                  <td className="py-4">{presentation.product_name}</td>
                  <td className="py-4">{presentation.uom}</td>
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
    </Layout>
  );
}
export default Presentations;
