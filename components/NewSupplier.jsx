import { XMarkIcon } from "@heroicons/react/24/outline";

function NewSupplier({ isvisible, onClose }) {
  if (!isvisible) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[750px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-dark-blue mb-2">
          Add <span className="text-primary-blue">new supplier</span>
        </h1>
        <form className="text-left">
          <div>
            <label>Name: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="Foodpoint"
              type="text"
              required
            ></input>
            <label>Email: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-200"
              placeholder="email@grownet.com"
              type="email"
              required
            ></input>
          </div>

          <label>Attach the supplier's logo: </label>
          <input
            className="p-3 rounded-md mr-3 mt-3 cursor-pointer"
            placeholder="Fruit"
            type="file"
            required
          ></input>
          <div className="mt-3 text-center">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Add supplier
            </button>
            <button
              onClick={() => onClose()}
              className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default NewSupplier;
