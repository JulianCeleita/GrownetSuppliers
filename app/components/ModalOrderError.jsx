import { FaceFrownIcon, XMarkIcon } from "@heroicons/react/24/outline";

function ModalOrderError({ isvisible, onClose, error }) {
  if (!isvisible) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[400px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <FaceFrownIcon className="h-12 w-12 text-danger mb-2" />
        <h1 className="text-2xl font-medium text-danger mb-2">Sorry</h1>
        <p className="text-dark-blue text-lg text-center">{error}</p>
        <button
          onClick={() => onClose()}
          className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 hover:bg-green mt-5"
        >
          Close
        </button>
      </div>
    </div>
  );
}
export default ModalOrderError;
