"use client";
import {
  MinusCircleIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import EditPresentation from "../../app/components/EditPresentation";
import { deletePresentationUrl } from "../../app/config/urls.config";
import useTokenStore from "../../app/store/useTokenStore";
import ModalDelete from "../components/ModalDelete";
import Layout from "../layoutS";
import useUserStore from "../store/useUserStore";
import {
  fetchPresentations,
  fetchPresentationsSupplier,
} from "../api/presentationsRequest";
import CreateProduct from "../components/CreateProduct";
import AutomaticShort from "../components/AutomaticShort";

function Presentations() {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [descriptionData, setDescriptionData] = useState(true);
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showAutomaticShorts, setShowAutomaticShorts] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const { user, setUser } = useUserStore();
  const [showScrollButton, setShowScrollButton] = useState(false);
  //Flecha
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  //Api
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   var localStorageUser = JSON.parse(localStorage.getItem("user"));
  //   setUser(localStorageUser);
  // }, [setUser]);

  useEffect(() => {
    if (user && user.rol_name === "AdminGrownet") {
      fetchPresentations(token, setProducts, setIsLoading);
    } else {
      fetchPresentationsSupplier(
        token,
        user,
        setProducts,
        setIsLoading,
        setDescriptionData
      );
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
        <div className="flex justify-between p-8 -mt-24">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            <span className="text-light-green">Catalogue </span>list
          </h1>
          <div className="flex gap-3">
            <button
              className="flex bg-dark-blue py-3 px-4 rounded-full text-white font-medium hover:bg-dark-blue hover:scale-105 transition-all"
              type="button"
              onClick={() => setShowAutomaticShorts(true)}
            >
              <NoSymbolIcon className="h-6 w-6 mr-2 font-bold" />
              Automatic Shorts
            </button>
            <button
              className="flex bg-green py-3 px-4 rounded-full text-white font-medium hover:scale-105 transition-all"
              type="button"
              onClick={() => setShowNewPresentations(true)}
            >
              <PlusCircleIcon className="h-6 w-6 mr-2 font-bold" />
              New Presentations
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center mb-20">
          <table className="w-[95%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Code</th>
                <th className="py-4">Product</th>
                <th className="py-4">Unit of measurement</th>
                <th className="py-4">Packsize</th>
                <th className="py-4">Type</th>
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
                  <td className="py-4 text-left flex gap-2 pl-8 items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        presentation.product_short === true
                          ? "bg-danger"
                          : "hidden"
                      } `}
                    />
                    {presentation.product_name}
                  </td>
                  <td className="py-4">{presentation.uom}</td>
                  <td className="py-4">{presentation.name}</td>

                  <td className="py-4 text-left flex gap-2 pl-8 items-center">
                    {presentation.type}
                  </td>

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
          <div className="flex justify-center items-center -mt-[7rem]">
            <div className="loader"></div>
          </div>
        )}
        {showScrollButton && (
          <button
            className="fixed bottom-[18px] right-10 bg-green z-30 text-white rounded-full p-2 hover:bg-primary-blue transition-all"
            onClick={scrollToTop}
          >
            <ChevronUpIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </Layout>
  );
}
export default Presentations;
