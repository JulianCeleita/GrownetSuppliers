import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useState } from "react";

const SideBar = () => {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-white py-3 fixed top-0 right-0 shadow-md z-50">
            <button className="ml-4" onClick={() => setOpen(true)}>
                <Bars3Icon className="h-6 w-6" />
            </button>

            <div className={`${!open && "hidden"} bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`}>
                <div className={`${open ? "w-80" : "w-0" } bg-primary-blue min-h-screen w-80 fixed top-0 left-0`}>
                    <div className={`${!open && "hidden" } pt-3`}>
                        <button className="ml-4 text-white" onClick={() => setOpen(false)}>
                            <XMarkIcon className="h-8 w-8" />
                        </button>
                        <div className="text-center text-white text-2xl">Link 1</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar;