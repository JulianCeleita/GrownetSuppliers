"use client";
import {
    PencilSquareIcon,
    PlusCircleIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import Calendar from "react-calendar";
import Layout from "../layoutS";


function Suppliers() {
    return (
        <Layout>
            <div>
                <div className="flex justify-between p-8 pb-20 bg-primary-blue">
                    <h1 className="text-2xl text-white font-semibold">Calendar view</h1>
                </div>
                <div className="flex flex-col items-center justify-center -mt-52 h-screen">
                    <Calendar
                        className="border rounded p-4 shadow-md text-black"
                        locale="en-GB"
                    />
                    <button className="bg-green p-5 text-white hover:scale-105 transition-all font-semibold rounded-lg mt-4">
                        Close Day
                    </button>
                </div>
            </div>
        </Layout>
    );
}
export default Suppliers;
