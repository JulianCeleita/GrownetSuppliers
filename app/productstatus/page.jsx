"use client";
import {
  AdjustmentsHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { fetchGroups } from "../api/customerRequest";
import {
  fetchPresentations,
  fetchPresentationsSupplier,
} from "../api/presentationsRequest";
import { fetchProductStatus } from "../api/productStatus";
import CreateProduct from "../components/CreateProduct";
import EditPresentation from "../components/EditPresentation";
import ModalDelete from "../components/ModalDelete";
import { deletePresentationUrl } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import useWorkDateStore from "../store/useWorkDateStore";
import Select from "react-select";

function ProductState() {
  const { token } = useTokenStore();
  const [uoms, setUoms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showAutomaticShorts, setShowAutomaticShorts] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [presentations, setPresentations] = useState("");
  const { user, setUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filterType, setFilterType] = useState("date");
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productsStatus, setProductsStatus] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);

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

  //Api
  const [products, setProducts] = useState([]);

  // useEffect(() => {
  //   var localStorageUser = JSON.parse(localStorage.getItem("user"));
  //   setUser(localStorageUser);
  // }, [setUser]);

  useEffect(() => {
    fetchProductStatus(
      startDate,
      endDate,
      token,
      setProductsStatus,
      setIsLoading,
      selectedPresentation,
      selectedGroup
    );
  }, [startDate, endDate]);

  useEffect(() => {
    setStartDate(workDate);
    setEndDate(workDate);
    fetchGroups(token, user, setGroups, setIsLoading);
  }, [workDate]);

  const applyFilters = () => {
    fetchProductStatus(
      startDate,
      endDate,
      token,
      setProductsStatus,
      setIsLoading,
      selectedPresentation,
      selectedGroup
    );
  };

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

  useEffect(() => {
    fetchPresentationsSupplier(token, user, setPresentations, setIsLoading);
  }, [token]);

  const presentationsOptions =
    presentations &&
    presentations.map((item) => ({
      value: item.id,
      label: `${item.code} - ${item.product_name} - ${item.name}`,
    }));

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 -mt-24">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            <span className="text-light-green">Products </span>status
          </h1>
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
          </div>{" "}
          <Select
            className="w-full"
            menuPlacement="auto"
            menuPortalTarget={document.body}
            options={presentationsOptions}
            value={
              selectedPresentationId
                ? {
                    value: selectedPresentationId,
                    label: presentationsOptions.find(
                      (item) => item.value === selectedPresentationId
                    ).label,
                  }
                : null
            }
            onChange={(selectedOption) =>
              setSelectedPresentationId(selectedOption.value)
            }
          />
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
                setStartDate(date);
                setEndDate(date);
                setDateFilter("date");
              }}
              className="form-input px-3 py-3 w-[95px] rounded-md border border-gray-300 text-dark-blue placeholder-dark-blue text-sm custom:text-base"
              dateFormat="dd/MM/yyyy"
              placeholderText={formatDateToShow(workDate)}
            />
          )}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="form-select py-3 px-2 rounded-md border border-gray-300 text-sm custom:text-base h-[50px]"
          >
            <option value="" selected disabled>
              All groups
            </option>
            {groups &&
              groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group}
                </option>
              ))}
          </select>
          <button
            className="flex bg-green hover:scale-110 transition-all py-3 px-4 rounded-lg h-12 ml-1 text-white font-medium"
            type="button"
            onClick={applyFilters}
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2 font-bold" />
            Apply filters
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mb-20 mt-2">
          <table className="w-[95%] bg-white rounded-2xl  shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Acc number</th>
                <th className="py-4">Acc name</th>
                <th className="py-4">Inv. number</th>
                <th className="py-4">Product code</th>
                <th className="py-4">Product name</th>
                <th className="py-4">Category</th>
                <th className="py-4">Group</th>
                <th className="py-4">Qty initial</th>
                <th className="py-4">Qty packing</th>
                <th className="py-4">Qty Definitive</th>
                <th className="py-4">Delivery date</th>
                <th className="py-4 rounded-tr-lg">Missing</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                productsStatus.map((productState) => {
                  var missing =
                    productState.quantity_initial -
                    productState.quantity_definitive;
                  return (
                    <tr
                      key={productState.id}
                      className="text-dark-blue border-b-2 border-stone-100"
                    >
                      <td className="py-4 pl-3">
                        {productState.accountNumber}
                      </td>
                      <td className="py-4">{productState.accountNumber}</td>
                      <td className="py-4">{productState.reference}</td>
                      <td className="py-4">{productState.product_code}</td>
                      <td className="py-4">{productState.product_name}</td>
                      <td className="py-4">{productState.product_category}</td>
                      <td className="py-4">{productState.group}</td>
                      <td className="py-4">{productState.quantity_initial}</td>
                      <td className="py-4">{productState.quantity_packing}</td>
                      <td className="py-4">
                        {productState.quantity_definitive}
                      </td>
                      <td className="py-4">{productState.delivery_date}</td>
                      <td className="py-4">
                        {!isNaN(missing) ? missing : null}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
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
