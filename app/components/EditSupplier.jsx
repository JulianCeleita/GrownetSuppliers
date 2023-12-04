import { XMarkIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { updateSupplierUrl } from "@/app/config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { fetchSuppliers } from "../suppliers/page";

function EditSupplier({ isvisible, onClose, supplier, setSuppliers }) {
  const { token } = useTokenStore();
  const [editedName, setEditedName] = useState(supplier ? supplier.name : "");
  const [editedEmail, setEditedEmail] = useState(
    supplier ? supplier.email : ""
  );
  const [selectedImage, setSelectedImage] = useState(null);

  if (!isvisible) {
    return null;
  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const handleEditSupplier = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", editedName);
    formData.append("email", editedEmail);
    formData.append("image", selectedImage);

    axios
      .post(`${updateSupplierUrl}${supplier.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchSuppliers(token, setSuppliers);
        onClose();
      })
      .catch((error) => {
        console.error("Error editando la proveedor:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[750px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <ExclamationCircleIcon className="h-8 w-8 text-green mb-2" />
        <h1 className="text-2xl font-bold text-green mb-2">Edit Supplier</h1>
        <form className="text-left" onSubmit={handleEditSupplier}>
          <div>
            <label>Name: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="Foodpoint"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
            ></input>
            <label>Email: </label>
            <input
              className="border p-3 rounded-md mr-3 mt-3 w-200"
              placeholder="email@grownet.com"
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              required
            ></input>
          </div>

          <label>Attach the supplier&apos;s logo: </label>
          <input
            className="p-3 rounded-md mr-3 mt-3 cursor-pointer"
            placeholder="Fruit"
            type="file"
            onChange={handleImageChange}
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
export default EditSupplier;
