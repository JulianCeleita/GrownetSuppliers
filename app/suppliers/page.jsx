"use client";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { deleteSupplierUrl, suppliersUrl } from "../../app/config/urls.config";
import EditSupplier from "../components/EditSupplier";
import ModalDelete from "../components/ModalDelete";
import NewSupplier from "../components/NewSupplier";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";
import { fetchSuppliers } from "../api/suppliersRequest";

function Suppliers() {
  const { token } = useTokenStore();
  const { user } = useUserStore();
  const [showNewSupplier, setShowNewSupplier] = useState(false);
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers(token, setSuppliers, setIsLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Api delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteSupplier = (supplier) => {
    const { id } = supplier;
    axios
      .delete(`${deleteSupplierUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowDeleteModal(false);
        fetchSuppliers(token, setSuppliers, setIsLoading);
      })
      .catch((error) => {
        console.error("Error al eliminar el proveedor:", error);
      });
  };
  if (user?.rol_name !== "AdminGrownet") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-9xl font-bold ">404</h1>
          <p className="text-2xl mt-2">Page Not Found</p>
        </div>
      </div>
    );
  }
  return (
    <Layout>
      <div className="-mt-[97px]">
        <div className="flex justify-between p-8">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            Suppliers <span className="text-light-green">list</span>
          </h1>
          <button
            className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:bg-dark-blue hover:scale-110 "
            type="button"
            onClick={() => setShowNewSupplier(true)}
          >
            <PlusCircleIcon className="h-6 w-6 mr-3 font-bold" />
            New supplier
          </button>
        </div>
        <div className="flex items-center justify-center mb-20">
          <table className="w-[95%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-6">
            <thead className="sticky top-0 bg-white shadow-[0px_11px_15px_-3px_#edf2f7] ">
              <tr className="border-b-2 border-stone-100 text-dark-blue">
                <th className="py-4 rounded-tl-lg">Supplier</th>
                <th className="py-4">Email</th>
                <th className="py-4">Image</th>
                <th className="py-4 rounded-tr-lg">Operate</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="text-dark-blue  border-b-2 border-stone-100"
                >
                  <td className="py-4">{supplier.name}</td>
                  <td className="py-4">{supplier.email}</td>
                  <td className="py-3">
                    <img
                      className="w-[40px] mx-auto"
                      src={supplier.image}
                      alt={supplier.name}
                    />
                  </td>
                  <td className="py-4 flex justify-center">
                    <button
                      className="flex text-primary-blue mr-6 font-medium hover:scale-110 hover:text-green hover:border-green"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowEditSupplier(true);
                      }}
                    >
                      <PencilSquareIcon className="h-6 w-6 mr-1" />
                      Edit
                    </button>
                    <button
                      className="flex text-primary-blue font-medium hover:scale-110 hover:text-danger hover:border-danger"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setShowDeleteModal(true);
                      }}
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
          onConfirm={() => handleDeleteSupplier(selectedSupplier)}
        />
        <NewSupplier
          isvisible={showNewSupplier}
          onClose={() => setShowNewSupplier(false)}
          setSuppliers={setSuppliers}
        />
        <EditSupplier
          isvisible={showEditSupplier}
          onClose={() => setShowEditSupplier(false)}
          supplier={selectedSupplier}
          setSuppliers={setSuppliers}
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
export default Suppliers;
