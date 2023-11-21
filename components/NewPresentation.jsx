import { XMarkIcon } from "@heroicons/react/24/outline";

function NewPresentation({ isvisible, onClose }) {
  if (!isvisible) {
    return null;
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[800px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-dark-blue mb-2">
          Add <span className="text-primary-blue">new presentation</span>
        </h1>
        <form className="text-left  flex flex-col">
          <label for="uom">Unit of measurement: </label>
          <select
            id="uom"
            name="uom"
            className="border p-3 rounded-md mr-3 mt-3"
            required
          >
            <option value="unit">Unit</option>
            <option value="kilo">Kilo</option>
            <option value="bag">Bag</option>
          </select>
          <label for="produvt" className="mt-2">
            Product:
          </label>
          <select
            id="produvt"
            name="produvt"
            className="border p-3 rounded-md mr-3 mt-3"
            required
          >
            <option value="Red pepper">Red pepper</option>
            <option value="Apple granny smith">Apple granny smith</option>
            <option value="Apples red">Apples red</option>
          </select>
          <div>
            <label>Code: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="Foodpoint"
              type="text"
              required
            ></input>
            <label>Quantity: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="50"
              type="text"
              required
            ></input>
          </div>
          <div>
            <label>Name: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-[40%]"
              placeholder="Foodpoint"
              type="text"
              required
            ></input>
            <label>Value: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3  w-[40%]"
              placeholder="50"
              type="text"
              required
            ></input>
          </div>

          <div className="mt-3 text-center">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Add Presentation
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
export default NewPresentation;
