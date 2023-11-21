import { XMarkIcon } from "@heroicons/react/24/outline";

function NewProduct({ isvisible, onClose }) {
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
          Add <span className="text-primary-blue">new product</span>
        </h1>
        <form className="text-left  flex flex-col">
          <div>
            <label>Name: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="Foodpoint"
              type="text"
              required
            ></input>
            <label>Code: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="50"
              type="text"
              required
            ></input>
          </div>
          <label for="family">Family: </label>
          <select
            id="family"
            name="family"
            className="border p-3 rounded-md mr-3 mt-3"
            required
          >
            <option value="banana">Banana</option>
            <option value="peppers-mixed">Peppers mixed</option>
            <option value="carrots-mixed-heritage">
              Carrots mixed heritage
            </option>
          </select>
          <div className="flex ">
            <div>
              <label>Unit weight of the product: </label>
              <input
                className="border p-3 rounded-md mr-3 mt-3 w-20"
                placeholder="50"
                type="number"
                required
              />
              <select
                id="weight"
                name="weight"
                className="border p-3 rounded-md mr-3 mt-3"
                required
              >
                <option value="gr">gr</option>
                <option value="ml">ml</option>
              </select>
            </div>
            <div>
              <label>Category: </label>
              <select
                id="category"
                name="category"
                className="border p-3 rounded-md mr-3 mt-3"
                required
              >
                <option value="fruit">Fruit</option>
                <option value="vegetables">Vegetables</option>
              </select>
            </div>
          </div>
          <label>Attach the product's photo: </label>
          <input
            className="p-3 rounded-md mr-3 mt-3 cursor-pointer"
            placeholder="Fruit"
            type="file"
            required
          ></input>
          <div>
            <label>Product status: </label>
            <select
              id="status"
              name="status"
              className="border p-3 rounded-md mr-3 mt-3 w-40"
              required
            >
              <option value="active">Active</option>
              <option value="disable">Disable</option>
            </select>
            <label>Product taxes: </label>
            <select
              id="tax"
              name="tax"
              className="border p-3 rounded-md mr-3 mt-3 w-40"
              required
            >
              <option value="0.2">0.2</option>
              <option value="0.05">0.05</option>
            </select>
          </div>

          <div className="mt-3 text-center">
            <button
              type="submit"
              value="Submit"
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 "
            >
              Add product
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
export default NewProduct;
