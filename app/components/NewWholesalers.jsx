import {
  XMarkIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useState } from "react";
import { wholesalersCreateUrl } from "../../app/config/urls.config";
import useTokenStore from "../store/useTokenStore";
import { fetchWholesalerList } from "../api/purchasingRequest";
import ModalSucessfullRounds from "./ModalSucesfullRounds";
import ModalOrderError from "./ModalOrderError";

function NewWholesalers({ isvisible, onClose, setWholesalerList }) {
  const { token } = useTokenStore();
  const [isLoading, setIsLoading] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [prefix, setPrefix] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [emails, setEmails] = useState([""]);
  const [showMoreEmail, setShowMoreEmail] = useState(false);
  const [showSuccessfullClose, setShowSucshowSuccessfullClose] =
    useState(false);
  const [showModalError, setShowModalError] = useState(false);

  if (!isvisible) {
    return null;
  }
  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleRemoveEmail = (index) => {
    if (index === 0) return;
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails);
  };

  //Api
  const enviarData = (e) => {
    e.preventDefault();
    const postData = {
      name: name,
      contact: contact,
      phone: phone,
      account_number: accountNumber,
      email: emails,
      prefix: prefix,
    };

    axios
      .post(wholesalersCreateUrl, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setShowSucshowSuccessfullClose(true);
        fetchWholesalerList(token, setWholesalerList);
        setAccountNumber("");
        setPrefix("");
        setPhone("");
        setName("");
        setContact("");
        setEmails([""]);
      })
      .catch(function (error) {
        setShowModalError(true);
        console.error("Error al agregar el nuevo mayorista:", error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-2xl w-[750px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => {
            setAccountNumber("");
            setPrefix("");
            setPhone("");
            setName("");
            setContact("");
            setEmails([""]);
            onClose();
          }}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold text-dark-blue mb-2">
          Add <span className="text-primary-blue">new wholesalers</span>
        </h1>
        <form className="text-left w-full" onSubmit={enviarData}>
          <div className="flex items-center gap-2 mb-2">
            <label>Name: </label>
            <input
              className="border p-3 rounded-md w-full"
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-[50%]">
              <div className="flex items-center gap-2">
                <label>Account number: </label>
                <input
                  className="border p-3 rounded-md w-full"
                  placeholder="ACC458"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <label>Phone: </label>
                <input
                  className="border p-3 rounded-md w-full"
                  placeholder="123456789"
                  type="number"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[50%]">
              <div className="flex items-center gap-2">
                <label>Prefix: </label>
                <input
                  className="border p-3 rounded-md w-full"
                  placeholder="12345"
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <label>Contact: </label>
                <input
                  className="border p-3 rounded-md w-full"
                  placeholder="Contact"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <label>Email: </label>
            <div className="w-full rounded-md">
              {emails.map((email, index) => (
                <input
                  key={index}
                  className="border p-3 rounded-md w-full mb-2"
                  placeholder="email@grownetapp.com"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  required
                />
              ))}
            </div>
            <button
              onClick={handleAddEmail}
              className="rounded-lg p-2 bg-primary-blue text-center transition-all hover:bg-dark-blue hover:scale-110 -mt-2"
            >
              <PlusCircleIcon className="text-white h-8 w-8" />
            </button>
            {emails.length >= 2 && (
              <button
                onClick={() => handleRemoveEmail()}
                className="rounded-lg p-2 bg-danger text-center transition-all hover:bg-dark-blue hover:scale-110 -mt-2"
              >
                <TrashIcon className="text-white h-8 w-8" />
              </button>
            )}
          </div>
          <div className="mt-3 text-center">
            <button
              type="submit"
              value="Submit"
              className={`bg-primary-blue py-3 px-4 mr-2 rounded-lg text-white font-medium  ${
                isLoading === true ? "bg-gray-500/50" : ""
              }`}
            >
              Add wholesaler
            </button>
            <button
              onClick={() => {
                setAccountNumber("");
                setPrefix("");
                setPhone("");
                setName("");
                setContact("");
                setEmails([""]);
                onClose();
              }}
              className=" py-3 px-4 rounded-lg text-primary-blue border border-primary-blue font-medium"
            >
              Close
            </button>
          </div>
        </form>
      </div>
      <ModalSucessfullRounds
        isvisible={showSuccessfullClose}
        onClose={() => {
          setShowSucshowSuccessfullClose(false);
          onClose();
          setAccountNumber("");
          setPrefix("");
          setPhone("");
          setName("");
          setContact("");
          setEmails([""]);
        }}
        title="Congratulations"
        text="Your new wholesaler has been successfully created."
        button=" Close"
      />
      <ModalOrderError
        isvisible={showModalError}
        onClose={() => {
          setShowModalError(false);
        }}
        title={"Error"}
        message="Your new wholesaler could not be created, please try again."
      />
    </div>
  );
}
export default NewWholesalers;
