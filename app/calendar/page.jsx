"use client";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { closeDay, openDay } from "../config/urls.config";
import Layout from "../layoutS";
import useTokenStore from "../store/useTokenStore";
import useUserStore from "../store/useUserStore";


function CalendarView() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [csvFile, setCsvFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const { user, setUser } = useUserStore();
    const { token } = useTokenStore();
    const [fileContent, setFileContent] = useState("");

    useEffect(() => {
        // Si cambia el archivo, intenta leer su contenido
        if (csvFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                setFileContent(content);
            };
            reader.readAsText(csvFile);
        }
    }, [csvFile]);

    const formatDate = (date) => {
        return format(date, "yyyy-MM-dd");
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setCsvFile(file);
        setFileName(file ? file.name : "");
    };

    const handleUpload = () => {
        if (csvFile) {
            console.log("Archivo CSV seleccionado:", csvFile);
        } else {
            console.log("No se seleccionó ningún archivo CSV.");
        }
    };

    const handleRemoveFile = () => {
        const fileInput = document.getElementById("fileInput");
        if (fileInput) {
            fileInput.value = null;
        }
        setCsvFile(null);
        setFileName("");
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
                    <div className="flex flex-col gap-0 mt-10">
                        <div className="flex items-center gap-1">
                            <label className="bg-dark-green p-5 text-white h-20 w-56 hover:scale-105 transition-all font-semibold rounded-lg cursor-pointer flex flex-col items-center justify-center">
                                Select CSV
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileChange}
                                    className="absolute hidden opacity-0"
                                />
                                {fileName && (
                                    <div className="text-sm text-gray-300 mt-2">{fileName}</div>
                                )}
                            </label>
                            {csvFile && (
                                <button
                                    className="bg-none p-2 transition-all text-white hover:scale-110 h-12 w-12 rounded-lg"
                                    onClick={handleRemoveFile}
                                >
                                    <TrashIcon className="h-8 w-8 text-red-600 font-bold" />
                                </button>
                            )}
                        </div>
                        <button
                            className="bg-dark-green p-2 text-white hover:scale-105 transition-all font-semibold rounded-lg w-56 mt-4"
                            onClick={handleUpload}
                        >
                            Upload CSV
                        </button>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
export default CalendarView;
