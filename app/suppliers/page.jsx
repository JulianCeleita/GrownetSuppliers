"use client";
import { useState, useEffect } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import NewSupplier from "@/components/NewSupplier";
import EditSupplier from "@/components/EditSupplier";
import axios from "axios";
import { suppliersUrl, deleteSupplierUrl } from "@/config/urls.config";

function Suppliers() {
  const [showNewSupplier, setShowNewSupplier] = useState(false);
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  //Variable edit supplier
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  console.log(selectedSupplier);
  //Api
  const urlImagen = "http://127.0.0.1:8000/";
  const [suppliers, setSuppliers] = useState([]);
  useEffect(() => {
    axios
      .get(suppliersUrl, {})
      .then((response) => {
        setSuppliers(response.data.suppliers);
      })
      .catch((error) => {
        console.error("Error al obtener los categorias:", error);
      });
  }, [suppliers]);
  //Api delete
  const [deleteResponse, setDeleteResponse] = useState(null);
  const handleDeleteSupplier = (supplier) => {
    const { id, name, email } = supplier;
    console.log(id, name, email);
    axios
      .delete(`${deleteSupplierUrl}${id}`, {
        data: { name, email },
      })
      .then((response) => {
        setDeleteResponse(response.data);
        console.log("Se borro con éxito");
      })
      .catch((error) => {
        console.error("Error al eliminar la proveedores:", error);
      });
  };
  return (
    <div>
      <div className="flex justify-between p-8 pb-20 bg-primary-blue">
        <h1 className="text-2xl text-white font-semibold">Suppliers list</h1>
        <button
          className="flex bg-green py-3 px-4 rounded-lg text-white font-medium hover:bg-dark-blue hover:scale-110 "
          type="button"
          onClick={() => setShowNewSupplier(true)}
        >
          <PlusCircleIcon className="h-6 w-6 mr-3 font-bold" />
          New supplier
        </button>
      </div>
      <div className="flex items-center justify-center mb-6 -mt-14">
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-60">
          <thead>
            <tr className="border-b-2 border-stone-100 text-dark-blue">
              <th className="py-4 pl-4">ID</th>
              <th className="py-4">Supplier</th>
              <th className="py-4">Email</th>
              <th className="py-4">Image</th>
              <th className="py-4">Operate</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="text-dark-blue  border-b-2 border-stone-100"
              >
                <td style={{ textAlign: "center", padding: "1.5rem" }}>
                  {supplier.id}
                </td>
                <td className="py-4">{supplier.name}</td>
                <td className="py-4">{supplier.email}</td>
                <td className="py-3">
                  <img
                    className="w-[40px] mx-auto"
                    src={urlImagen + supplier.image}
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
                    onClick={() => handleDeleteSupplier(supplier)}
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
      />
    </div>
  );
}
export default Suppliers;
