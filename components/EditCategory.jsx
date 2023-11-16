import { XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

function EditCategory({ isvisible, onClose }) {
  if (!isvisible) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[600px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <ExclamationCircleIcon className="h-8 w-8 text-green mb-2" />
        <h1 className="text-2xl font-bold text-green mb-2">Edit category</h1>
        <p>Enter the correct name for the category</p>
        <form>
          <input
            className="border p-3 rounded-md mr-3 mt-3"
            placeholder="Fruit"
            required
          ></input>
          <div className="mt-3">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Edit category
            </button>
            <button
              onClick={() => onClose()}
              className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditCategory;
