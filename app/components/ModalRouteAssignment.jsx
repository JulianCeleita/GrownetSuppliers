import React, { useEffect, useRef, useState } from 'react'
import Spinner from './Spinner';
import { fetchAssignRoute } from '../api/assignRouteRequest';
import useTokenStore from '../store/useTokenStore';
import { fetchVehicleAndDriver } from '../api/vehiclesAndDriversRequest';
import { set } from 'date-fns';

export const ModalRouteAssignment = ({ show, onClose }) => {

    const modalRef = useRef();
    const [loading, setLoading] = useState(false);
    const { token } = useTokenStore();
    const [statusFetch, setStatusFetch] = useState({ status: 0, message: '' });
    const [vehicles, setVehicles] = useState([])
    const [drivers, setDrivers] = useState([])
    const [form, setForm] = useState({
        driverId: '',
        vehicleId: '',
        date: '',
        routeId: '',
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.driverId === '' || form.vehicleId === '' || form.date === '' || form.routeId === '') {
            setStatusFetch({ status: 3, message: 'All fields are required' });
            return;
        }

        setLoading(true);
        const { status, message } = await fetchAssignRoute(token, form);
        setLoading(false);
        setForm({
            driverId: '',
            vehicleId: '',
            date: '',
            routeId: '',
        });
        setStatusFetch({ status: status ? 1 : 2, message });
    };

    const getVehiclesAndDrivers = async () => {
        const { status, data } = await fetchVehicleAndDriver(token);
        if (status) {
            setDrivers(data.employees);
            setVehicles(data.vehicles);
        } else {
            setStatusFetch({ status: 2, message: 'Error fetching vehicles and drivers' });
        }
    };

    useEffect(() => {
        if (show) {
            modalRef.current.focus();
            getVehiclesAndDrivers();
        }

        return () => {
            setForm({
                driverId: '',
                vehicleId: '',
                date: '',
                routeId: '',
            });
            setStatusFetch({ status: 0, message: '' });
            setVehicles([]);
            setDrivers([]);
        }
    }, [show]);

    const handleKeyCloseModal = (event) => {
        if (event.key === "Escape") {
            onClose();
        }

        if (event.key === "Enter") {
            handleSubmit();
        }
    };

    const handleFocus = () => {
        setStatusFetch({ status: 0, message: '' });
    };

    const handleBlur = () => {
        setStatusFetch({ status: 0, message: '' });
    };

    if (!show) {
        return null;
    }

    const routes = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R100']

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            ref={modalRef}
            tabIndex="0"
            onKeyDown={handleKeyCloseModal}
        >
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-white p-4 rounded shadow-lg z-10 relative min-w-[800px] min-h-[600px]">
                <button onClick={onClose} className="absolute top-2 right-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h1 className='text-center'>Assignment</h1>

                <form className='space-y-4 p-10' onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Driver:
                        </label>
                        <select
                            name="driverId"
                            value={form.driverId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm p-3"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        >
                            <option value="">Select a driver</option>
                            {drivers.map((driver, index) => (
                                <option key={index} value={driver.id}>{driver.name}</option>
                            ))}

                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Vehicle:
                        </label>
                        <select
                            name="vehicleId"
                            value={form.vehicleId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm p-3"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        >
                            <option value="">Select a vehicle</option>
                            {vehicles.map((vehicle, index) => (
                                <option key={index} value={vehicle.id}>{vehicle.plaque}</option>
                            ))}

                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Date:
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm p-3"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Route:
                        </label>
                        <select
                            name="routeId"
                            value={form.routeId}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 border-2 shadow-sm p-3"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        >
                            <option value="">Select a route</option>
                            {routes.map((route, index) => (
                                <option key={index} value={route.substring(1)}>{route}</option>
                            ))}

                        </select>
                    </div>
                    <button disabled={loading === true} type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 w-full">
                        <div className='flex justify-center items-center'>
                            {loading ? <Spinner size={20} /> : 'Assign'}
                        </div>
                    </button>
                    {statusFetch.status !== 0 && <p className={`${statusFetch.status === 1
                        ? 'bg-green'
                        : statusFetch.status === 2
                            ? 'bg-red-400'
                            : 'bg-blue-300'
                        } text-center text-white p-3 w-full rounded`}>{statusFetch.message}</p>}
                </form>

            </div>
        </div>
    )
}
