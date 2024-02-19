import {
  CheckBadgeIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

function ModalSuccessfull({
  isvisible,
  onClose,
  title,
  text,
  textGrownet,
  button,
  sendOrder,
  confirmed,
}) {
  const router = useRouter();
  const modalRef = useRef()

  useEffect(() => {
    if (isvisible) {
      modalRef.current.focus()
    }
  }, [isvisible])

  const modalVariants = {
    hidden: { opacity: 0, scale: 1 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, scale: 0.1, transition: { duration: 0.8 } },
  };

  if (!isvisible) {
    return null;
  }

  const handleKeyCloseModal = (event) => {
    if (event.key === 'Enter') {
      if (!confirmed) {
        sendOrder()
      } else {
        onClose();
        router.push('/orders');
      }
    }

    if (event.key === 'Escape') {
      onClose();
      router.push('/orders');
    }
  };

  return (
    <AnimatePresence mode="wait">
      <div ref={modalRef} tabIndex="0" onKeyDown={handleKeyCloseModal} className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <div className="bg-white p-8 rounded-2xl w-[400px] flex flex-col items-center">
            <button
              className="text-dark-blue place-self-end "
              onClick={() => onClose()}
            >
              {!sendOrder && <XMarkIcon className="h-6 w-6 text-gray-500" />}
            </button>
            {sendOrder ? (
              <QuestionMarkCircleIcon className="h-12 w-12 text-green mb-2" />
            ) : (
              <CheckBadgeIcon className="h-12 w-12 text-green mb-2" />
            )}

            <h1 className="text-2xl font-medium text-green mb-2">{title}</h1>
            <p className="text-dark-blue text-lg text-center">
              {text}

              <span className="text-primary-blue font-medium">
                &nbsp;{textGrownet}{" "}
              </span>
            </p>
            <div className="flex">
              <button
                onClick={() => (sendOrder ? sendOrder() : onClose())}
                className="bg-primary-blue py-3 px-4 rounded-lg text-white font-medium mr-3 hover:bg-green mt-5"
              >
                {button}
              </button>
              {sendOrder && (
                <button
                  onClick={() => onClose()}
                  className="bg-white py-3 px-4 rounded-lg text-primary-blue font-medium mr-3 mt-5 border-primary-blue border hover:bg-danger hover:text-white hover:border-white "
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
export default ModalSuccessfull;
