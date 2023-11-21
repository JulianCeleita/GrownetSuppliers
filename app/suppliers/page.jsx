"use client";
import { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import NewSupplier from "@/components/NewSupplier";
import EditSupplier from "@/components/EditSupplier";

function Suppliers() {
  const [showNewSupplier, setShowNewSupplier] = useState(false);
  const [showEditSupplier, setShowEditSupplier] = useState(false);
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
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
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
            <tr className="text-dark-blue ">
              <td className="py-4 border-b-2 border-stone-100">1</td>
              <td className="py-4 border-b-2 border-stone-100">Foodpoint</td>
              <td className="py-4 border-b-2 border-stone-100">
                email@grownet.com
              </td>
              <td className="py-4 border-b-2 border-stone-100">image</td>
              <td className="py-4 flex justify-center border-b-2 border-stone-100">
                <button
                  className="flex text-primary-blue mr-6 font-medium hover:scale-110 hover:text-green hover:border-green"
                  onClick={() => setShowEditSupplier(true)}
                >
                  <PencilSquareIcon className="h-6 w-6 mr-1" />
                  Edit
                </button>
                <button className="flex text-primary-blue font-medium hover:scale-110 hover:text-danger hover:border-danger">
                  <TrashIcon className="h-6 w-6 mr-1" />
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <NewSupplier
        isvisible={showNewSupplier}
        onClose={() => setShowNewSupplier(false)}
      />
      <EditSupplier
        isvisible={showEditSupplier}
        onClose={() => setShowEditSupplier(false)}
      />
    </div>
  );
}
export default Suppliers;
