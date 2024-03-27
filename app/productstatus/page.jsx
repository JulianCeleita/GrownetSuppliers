"use client";
import {
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  ChevronUpIcon,
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
  const [selectedDate, setSelectedDate] = useState();
  const [dateFilter, setDateFilter] = useState("today");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filterType, setFilterType] = useState("date");
  const { workDate, setFetchWorkDate } = useWorkDateStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [productsStatus, setProductsStatus] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedPresentationId, setSelectedPresentationId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [presentationsOptions, setPresentationsOptions] = useState([]);
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

  let sortedPresentations = [];

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

  const nextPage = () => {
    setPage((page) => page + 1);
    console.log(page);
  };

  const prevPage = () => {
    setPage((page) => page - 1);
    console.log(page);
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
      selectedPresentationId,
      selectedGroup,
      page,
      setPage,
      setTotalPages
    );
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    setStartDate(new Date(workDate));
    setEndDate(new Date(workDate));
    setSelectedStartDate(workDate);
    setSelectedEndDate(workDate);
    fetchGroups(token, user, setGroups, setIsLoading);
  }, [workDate]);

  useEffect(() => {
    fetchPresentationsSupplier(token, user, setPresentations, setIsLoading);
  }, []);

  const applyFilters = () => {
    fetchProductStatus(
      startDate,
      endDate,
      token,
      setProductsStatus,
      setIsLoading,
      selectedPresentationId,
      selectedGroup,
      page,
      setPage,
      setTotalPages
    );
  };
  useEffect(() => {
    applyFilters();
  }, [page]);

  useEffect(() => {
    if (presentations) {
      sortedPresentations = presentations.slice().sort((a, b) => {
        const presentationProductNameA = a.product_name || "";
        const presentationProductNameB = b.product_name || "";
        return presentationProductNameA.localeCompare(presentationProductNameB);
      });
      console.log(
        "🚀 ~ sortedPresentations=presentations.slice ~ sortedPresentations:",
        sortedPresentations
      );
      const options = sortedPresentations.map((item) => ({
        value: item.id,
        label: `${item.code} - ${item.product_name} - ${item.name}`,
      }));
      setPresentationsOptions(options);
    }
  }, [presentations]);

  return (
    <Layout>
      <div>
        <div className="flex justify-between p-8 -mt-24">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            <span className="text-light-green">Products </span>status
          </h1>
        </div>
        <div className="mx-10 flex gap-2 mb-5 items-center">
          <Select
            className="w-[250px]"
            styles={{
              control: (provided) => ({ ...provided, height: "51px" }),
            }}
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
          {selectedPresentationId && (
            <button
              onClick={() => {
                setSelectedPresentationId(null);
              }}
            >
              <TrashIcon className="h-6 w-6 text-danger" />
            </button>
          )}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="form-select px-2 rounded-md border border-gray-300 text-sm custom:text-base w-[155px] h-[52px]"
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
                className="form-input px-3 py-3 rounded-md border border-gray-300 w-[120px] text-sm custom:text-base h-[52px]"
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
                className="form-input px-3 py-3 w-[120px] rounded-md border border-gray-300 text-sm custom:text-base h-[52px]"
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
              className="form-input px-3 py-3 w-[120px] rounded-md border border-gray-300 text-dark-blue placeholder-dark-blue text-sm custom:text-base h-[52px]"
              dateFormat="dd/MM/yyyy"
              placeholderText={formatDateToShow(workDate)}
            />
          )}
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="form-select py-3 px-2 rounded-md border border-gray-300 text-sm custom:text-base h-[52px]"
          >
            <option value="" selected>
              All groups
            </option>
            {groups &&
              groups?.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group}
                </option>
              ))}
          </select>
          <button
            className="flex items-center bg-green hover:scale-110 transition-all py-3 px-4 rounded-lg h-[52px] ml-1 text-white font-medium"
            type="button"
            onClick={applyFilters}
          >
            <AdjustmentsHorizontalIcon className="h-6 w-6 mr-2 font-bold" />
            Apply filters
          </button>
        </div>

        <div className="flex flex-col items-center justify-center mt-2">
          <table className="w-[95%] bg-white rounded-2xl  shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="p-3 rounded-tl-lg">Acc number</th>
                <th className="p-3">Acc name</th>
                <th className="p-3">Inv. number</th>
                <th className="p-3">Product code</th>
                <th className="p-3 w-[350px]">Product name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Group</th>
                <th className="p-3">Initial</th>
                <th className="p-3">Packing</th>
                <th className="p-3">Loading</th>
                <th className="p-3">Definitive</th>
                {/* <th className="p-3">Delivery date</th> */}
                <th className="p-3 rounded-tr-lg">Missing</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                productsStatus?.map((productState) => {
                  var missing =
                    productState.quantity_initial -
                    productState.quantity_definitive;
                  return (
                    <tr
                      key={productState.id}
                      className="text-dark-blue text-[16px] border-b-2 border-stone-100"
                    >
                      <td className="py-1 px-2">
                        {productState.accountNumber}
                      </td>
                      <td className="py-1 px-2">{productState.accountName}</td>
                      <td className="py-1 text-center">
                        {productState.reference}
                      </td>
                      <td className="py-1 text-center">
                        {productState.product_code}
                      </td>
                      <td className="py-1 px-2 ">
                        {productState.product_name}
                      </td>
                      <td className="py-1 px-2">
                        {productState.product_category}
                      </td>
                      <td className="py-1 px-2 text-center">
                        {productState.group}
                      </td>
                      <td className="py-1 px-2 text-center">
                        {productState.quantity_initial}
                      </td>
                      <td className="py-1 px-2 text-center">
                        {productState.quantity_packing}
                      </td>
                      <td className="py-1 px-2 text-center">
                        {productState.quantity_loading}
                      </td>
                      <td className="py-1 px-2 text-center">
                        {productState.quantity_definitive}
                      </td>
                      {/* <td className="py-1 px-2 text-center">
                        {productState.delivery_date}
                      </td> */}
                      <td
                        className={`py-1 px-2 text-center ${
                          productState.quantity_definitive === null
                            ? "hidden"
                            : "block"
                        }`}
                      >
                        {!isNaN(missing) ? missing : null}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && productsStatus && (
            <div className="flex items-center justify-center my-8 gap-3">
              <button
                onClick={prevPage}
                disabled={page === 1}
                className={`w-8 h-8 mr-2 font-medium text-dark-blue bg-[#EDF6FF] text-center rounded-full cursor-pointer transition-all flex justify-center items-center ${
                  page === 1
                    ? "hidden"
                    : "text-dark-blue bg-[#EDF6FF] hover:bg-primary-blue hover:text-white"
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5 text-center" />
              </button>
              <div className="flex items-center space-x-2 gap-3">
                <span className="text-sm font-medium text-gray-600">
                  Page{" "}
                  <span className="text-primary-blue font-bold">{page}</span> of{" "}
                  {totalPages}
                </span>
                <div>
                  <button
                    onClick={nextPage}
                    disabled={page === totalPages}
                    className={`w-8 h-8 font-medium bg-[#EDF6FF] text-center rounded-full cursor-pointer transition-all flex justify-center items-center ${
                      page === totalPages
                        ? "hidden"
                        : "text-dark-blue bg-[#EDF6FF] hover:bg-primary-blue hover:text-white"
                    }`}
                  >
                    <ChevronRightIcon className="h-5 w-5 text-center" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {showScrollButton && (
          <button
            className="fixed bottom-[18px] right-10 bg-green z-30 text-white rounded-full p-2 hover:bg-primary-blue transition-all"
            onClick={scrollToTop}
          >
            <ChevronUpIcon className="h-6 w-6" />
          </button>
        )}
        {isLoading && (
          <div className="flex justify-center items-center -mt-[7rem]">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </Layout>
  );
}
export default ProductState;
