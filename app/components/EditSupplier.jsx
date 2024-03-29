import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { updateSupplierUrl } from "../../app/config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { fetchSuppliers } from "../suppliers/page";

function EditSupplier({
  isvisible,
  onClose,
  supplier,
  setSuppliers,
  setIsLoading,
}) {
  const { token } = useTokenStore();
  const [editedName, setEditedName] = useState(supplier ? supplier.name : "");
  const [editedEmail, setEditedEmail] = useState(
    supplier ? supplier.email : ""
  );
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };
  useEffect(() => {
    setEditedName(supplier ? supplier.name : "");
    setEditedEmail(supplier ? supplier.email : "");
  }, [supplier]);

  if (!isvisible) {
    return null;
  }
  const handleEditSupplier = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", editedName);
    formData.append("email", editedEmail);
    if (image) {
      formData.append("image", image);
    }
    axios
      .post(`${updateSupplierUrl}${supplier?.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        fetchSuppliers(token, setSuppliers, setIsLoading);
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
        <h1 className="text-2xl font-bold text-dark-blue">
          Edit <span className="text-primary-blue">supplier</span>
        </h1>
        <form className="text-left" onSubmit={handleEditSupplier}>
          <div>
            <label htmlFor="name">Name: </label>
            <input
              id="name"
              className="border p-3 rounded-md mr-3 mt-3"
              placeholder="Foodpoint"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              required
            ></input>
            <label htmlFor="email">Email: </label>
            <input
              id="email"
              className="border p-3 rounded-md mr-3 mt-3 w-200"
              placeholder="your-email@grownetapp.com"
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
