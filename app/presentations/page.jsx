"use client";
import { useState } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

function Presentations() {
  const [showNewPresentations, setShowNewPresentations] = useState(false);
  const [showEditPresentations, setShowEditPresentations] = useState(false);
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
        <table className="w-[90%] bg-white rounded-2xl text-center shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <thead>
            <tr className="border-b-2 border-stone-100 text-dark-blue">
              <th className="py-4 pl-4">ID</th>
              <th className="py-4">Presentations</th>
              <th className="py-4">Operate</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-dark-blue ">
              <td className="py-4 border-b-2 border-stone-100">1</td>
              <td className="py-4 border-b-2 border-stone-100">Dry goods</td>
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
            <tr className="text-dark-blue ">
              <td className="py-4 border-b-2 border-stone-100">2</td>
              <td className="py-4 border-b-2 border-stone-100">Fruit</td>
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
      {/*<EditPresentations
        isvisible={showEditPresentations}
        onClose={() => setShowEditPresentations(false)}
      />
      <NewPresentations
        isvisible={showNewPresentations}
        onClose={() => setShowNewPresentations(false)}
  />*/}
    </div>
  );
}
export default Presentations;
