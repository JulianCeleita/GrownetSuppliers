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
import { presentationsUrl } from "@/app/config/urls.config";

function Presentations() {
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
  //Api
  const [presentations, setPresentations] = useState([]);
  useEffect(() => {
    axios
      .get(presentationsUrl, {})
      .then((response) => {
        setPresentations(response.data.presentations);
      })
      .catch((error) => {
        console.error("Error al obtener los categorias:", error);
      });
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
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-60">
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
            {presentations.map((presentation) => (
              <tr
                key={presentation.id}
                className="text-dark-blue border-b-2 border-stone-100 "
              >
                <td className="py-4">{presentation.id}</td>
                <td className="py-4">{presentation.name}</td>
                <td className="py-4">Dry goods</td>
                <td className="py-4">{presentation.name}</td>
                <td className="py-4">10.5</td>
                <td className="py-4 flex justify-center">
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
            ))}
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
