import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

function ModalOrderError({
  isvisible,
  onClose,
  error,
  title,
  message,
  setIsSelectDisabled,
  setCustomerDate = () => {},
  handleKeyPress = () => {},
  handleDateRef = () => {},
  setAccept,
  errorList,
}) {
  const modalRef = useRef();

  useEffect(() => {
    if (isvisible) {
      modalRef.current.focus();
    }
  }, [isvisible]);

  if (!isvisible) {
    return null;
  }

  if (isvisible && setIsSelectDisabled) {
    setIsSelectDisabled(false);
  }

  const handleKeyCloseModal = (event) => {
    if (event.key === "Enter" || event.key === "Escape") {
      onClose();
      handleKeyPress();
      setAccept(true);
    }
  };
  const handleAccept = () => {
    onClose();
    handleKeyPress();
    setAccept(true);
  };
  const handleClose = () => {
    if (errorList) {
      handleDateRef();
      setCustomerDate("");
      onClose();
      setAccept(false);
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={modalRef}
      tabIndex="0"
      onKeyDown={handleKeyCloseModal}
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center z-50"
    >
      <div className="bg-white p-8 rounded-2xl w-[400px] flex flex-col items-center">
        <button
          className="text-dark-blue place-self-end "
          onClick={() => onClose()}
        >
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
        <ExclamationCircleIcon className="h-12 w-12 text-danger mb-2" />
        <h1 className="text-2xl font-medium text-dark-blue mb-2 text-center">
          {title}
        </h1>
        <p className="text-dark-blue text-lg text-center">{error}</p>
        <p className="text-dark-blue text-lg text-center">{message}</p>
        <div>
          <button
            onClick={handleClose}
            className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 hover:bg-green mt-5"
          >
            {errorList ? "Cancel" : "Close"}
          </button>
          {errorList && (
            <button
              onClick={handleAccept}
              className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 hover:bg-green mt-5"
            >
              Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ModalOrderError;
