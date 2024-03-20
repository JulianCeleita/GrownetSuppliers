import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function ModalSendPurchasing({
  isvisible,
  onClose,
  sendOrder,
  selectedWholesalers,
}) {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ${
        isvisible ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-8 rounded-2xl w-[800px] flex flex-col items-center pb-20">
        <button className="self-end mb-4" onClick={() => onClose()}>
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-dark-blue">
          Send <span className="text-primary-blue">purchasing</span>
        </h1>
        <p className="my-2 text-dark-blue">
          Please select the products you'd like to include with your order!
        </p>
        <div className="mt-1">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <p></p>
        </div>
        <div className="mt-3 text-center">
          <button
            className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            onClick={sendOrder}
          >
            Send
          </button>
          <button
            onClick={() => onClose()}
            className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalSendPurchasing;
