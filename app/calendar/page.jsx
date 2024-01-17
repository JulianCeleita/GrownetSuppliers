"use client";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { format } from "date-fns";
import { useState } from "react";
import Calendar from "react-calendar";
import { closeDay, openDay } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";


function Suppliers() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { user, setUser } = useUserStore();
    const { token } = useTokenStore();

    const formatDate = (date) => {
        return format(date, "yyyy-MM-dd");
    };

    const handleButtonClose = async () => {
        try {
            const currentDate = formatDate(selectedDate);

            const data = {
                supplier: user.id_supplier,
                day: currentDate,
            };

            const response = await axios.post(closeDay, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        } catch (error) {
            // Maneja los errores de la solicitud
            console.error("Error al enviar la solicitud POST:", error);
        }
    };

    // TODO: borrar funcion para abrir el día
    const handleButtonOpen = async () => {
        try {
            const currentDate = formatDate(selectedDate);

            const data = {
                supplier: user.id_supplier,
                day: currentDate,
            };

            const response = await axios.post(openDay, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

        } catch (error) {
            // Maneja los errores de la solicitud
            console.error("Error al enviar la solicitud POST:", error);
        }
    };

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
                    {/* TODO: borrar botón para abrir el día */}
                    <button className="bg-green p-5 text-white hover:scale-105 transition-all font-semibold rounded-lg mt-4"
                        onClick={handleButtonOpen}
                    >
                        Open Day
                    </button>
                    <button className="bg-green p-5 text-white hover:scale-105 transition-all font-semibold rounded-lg mt-4"
                        onClick={handleButtonClose}
                    >
                        Close Day
                    </button>
                </div>
            </div>
        </Layout>
    );
}
export default Suppliers;
