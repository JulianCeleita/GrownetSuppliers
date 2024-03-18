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
import EditPresentation from "../components/EditPresentation";
import { deletePresentationUrl } from "../config/urls.config";
import useTokenStore from "../store/useTokenStore";
import ModalDelete from "../components/ModalDelete";
import Layout from "../layoutS";
import useUserStore from "../store/useUserStore";
import {
  fetchPresentations,
  fetchPresentationsSupplier,
} from "../api/presentationsRequest";
import CreateProduct from "../components/CreateProduct";
import AutomaticShort from "../components/AutomaticShort";
import DatePicker from "react-datepicker";
import useWorkDateStore from "../store/useWorkDateStore";

function ProductState() {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showAutomaticShorts, setShowAutomaticShorts] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [descriptionData, setDescriptionData] = useState();
  const { user, setUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedResponsible, setSelectedResponsible] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [filterType, setFilterType] = useState("date")
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const formatDateToShow = (dateString) => {
    if (!dateString) return "Loading...";

    const parts = dateString.split("-").map((part) => parseInt(part, 10));
    const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

    const day = String(utcDate.getUTCDate()).padStart(2, "0");
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
    const year = String(utcDate.getUTCFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  const formatDateToTransform = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleResponsibleChange = (e) => {
    setSelectedResponsible(e.target.value);
  };
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
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
            <span className="text-light-green">Products </span>status
          </h1>

          <div className="flex gap-4">
            {/* <button
              className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:scale-110 transition-all"
              type="button"
              onClick={() => setShowNewPresentations(true)}
            >
              <PlusCircleIcon className="h-6 w-6 mr-2 font-bold" />
              New Presentations
            </button> */}
          </div>
        </div>
        <div className="mx-10 flex gap-2">
          <div className="border border-gray-300  rounded-md py-3 px-2 flex items-center mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="placeholder-[#04444F] outline-none text-sm custom:text-base w-[170px]"
            />
            {searchQuery != "" && (
              <button
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                <TrashIcon className="h-6 w-6 text-danger" />
              </button>
            )}
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select px-2 rounded-md border border-gray-300 text-sm custom:text-base w-[155px] h-[3.2rem]"
          >
            <option value="range">Filter by range</option>
            <option value="date">Filter by date</option>
          </select>
          {filterType === "range" && (
            <>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setStartDateByNet(formatDateToTransform(date));
                  setEndDate((currentEndDate) => {
                    if (date && currentEndDate) {
                      setDateFilter("range");
                    }
                    return currentEndDate;
                  });
                }}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="form-input px-3 py-3 rounded-md border border-gray-300 w-[120px] text-sm custom:text-base"
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  setEndDate(date);
                  setEndDateByNet(formatDateToTransform(date));
                  setStartDate((currentStartDate) => {
                    if (currentStartDate && date) {
                      setDateFilter("range");
                    }
                    return currentStartDate;
                  });
                }}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="form-input px-3 py-3 w-[120px] rounded-md border border-gray-300 text-sm custom:text-base"
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
              />
            </>
          )}

          {filterType === "date" && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setStartDateByNet(formatDateToTransform(date));
                setEndDateByNet(formatDateToTransform(date));
                setDateFilter("date");
              }}
              className="form-input px-3 py-3 w-[95px] rounded-md border border-gray-300 text-dark-blue placeholder-dark-blue text-sm custom:text-base"
              dateFormat="dd/MM/yyyy"
              placeholderText={formatDateToShow(workDate)}
            />
          )}
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="form-select py-3 px-2 rounded-md border border-gray-300 text-sm custom:text-base h-[50px]"
          >
            <option value="">All states</option>

            <option key="loaded">Loaded</option>
            <option key="packed">Packed</option>
            <option key="short">Shorts</option>
          </select>
          <select
            value={selectedResponsible}
            onChange={handleResponsibleChange}
            className="form-select py-3 px-2 rounded-md border border-gray-300 text-sm custom:text-base h-[50px]"
          >
            <option value="">All responsible</option>
            <option key="diego">Diego</option>
            <option key="julian">Julian</option>
            <option key="heiner">Heiner</option>
          </select>
        </div>

        <div className="flex flex-col items-center justify-center mb-20 mt-2">
          <table className="w-[95%] bg-white rounded-2xl  shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Account number</th>
                <th className="py-4">Sitename</th>
                <th className="py-4">Inv. number</th>
                <th className="py-4">Product</th>
                <th className="py-4">Qty</th>
                <th className="py-4">Amendments</th>
                <th className="py-4">Packed</th>
                <th className="py-4">Loaded</th>
                <th className="py-4">Checked</th>
                {/* <th className="py-4 rounded-tr-lg">Operate</th> */}
              </tr>
            </thead>
            <tbody>
              {sortedPresentations.map((presentation) => (
                <tr
                  key={presentation.id}
                  className="text-dark-blue border-b-2 border-stone-100"
                >
                  <td className="py-4 pl-3">{presentation.code}</td>
                  <td className="py-4">{presentation.product_name}</td>
                  <td className="py-4">{presentation.uom}</td>
                  <td className="py-4">{presentation.name}</td>
                  <td className="py-4">{presentation.type}</td>
                  <td className="py-4">£ {presentation.cost}</td>
                  <td className="py-4">{presentation.quantity}</td>
                  <td className="py-4">{presentation.quantity}</td>
                  <td className="py-4 px-3">
                    <div className="flex items-center">
                      <div
                        className={`bg-green w-2 h-2 mr-2 rounded-full`}
                      ></div>
                      Status
                    </div>
                  </td>
                  {/* <td className="py-4 pl-3 flex justify-center">
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
                  </td> */}
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

        {isLoading && (
          <div className="flex justify-center items-center mb-20">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default ProductState;
