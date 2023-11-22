"use client";
import { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import NewPresentation from "@/components/NewPresentation";
import EditPresentation from "@/components/EditPresentation";
function Presentations() {
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  return (
    <div>
      <div className="bg-white p-5">
        <div className="flex">
          <div className="flex flex-col">
            <label>Date: </label>
            <input type="date" className="border p-3 rounded-md mr-3 mt-3" />
            <label>A/C: </label>
            <input type="text" className="border p-3 rounded-md mr-3 mt-3" />
          </div>
          <div className="flex flex-col">
            <label>Inv. No.: </label>
            <input type="text" className="border p-3 rounded-md mr-3 mt-3" />
            <label>Order No.: </label>
            <input type="text" className="border p-3 rounded-md mr-3 mt-3" />
          </div>
        </div>
        <label>Customer: </label>
        <input type="text" className="border p-3 rounded-md mr-3 mt-3" />
      </div>

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
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <thead>
            <tr className="border-b-2 border-stone-100 text-dark-blue">
              <th className="py-4 pl-4">ID</th>
              <th className="py-4">Unit of measurement</th>
              <th className="py-4">Product</th>
              <th className="py-4">Name</th>
              <th className="py-4">Value</th>
              <th className="py-4">Operate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-dark-blue ">
              <td className="py-4 border-b-2 border-stone-100">1</td>
              <td className="py-4 border-b-2 border-stone-100">Unit</td>
              <td className="py-4 border-b-2 border-stone-100">Dry goods</td>
              <td className="py-4 border-b-2 border-stone-100">Each</td>
              <td className="py-4 border-b-2 border-stone-100">10.5</td>
              <td className="py-4 flex justify-center border-b-2 border-stone-100">
                <button
                  onClick={() => setShowEditPresentations(true)}
                  className="flex text-primary-blue mr-6 font-medium hover:scale-110 hover:text-green hover:border-green"
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
      <EditPresentation
        isvisible={showEditPresentations}
        onClose={() => setShowEditPresentations(false)}
      />
      <NewPresentation
        isvisible={showNewPresentations}
        onClose={() => setShowNewPresentations(false)}
      />
    </div>
  );
}
export default Presentations;