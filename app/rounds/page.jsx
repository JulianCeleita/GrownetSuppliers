"use client";
import React, { useEffect, useState } from "react";
import Layout from "../layoutS";
import { fetchAssignRoute } from "../api/assignRouteRequest";
import useTokenStore from "../store/useTokenStore";
import { fetchVehicleAndDriver } from "../api/vehiclesAndDriversRequest";
import { getAllRoutes } from "../api/getAllRoutesRequest";
import Spinner from "../components/Spinner";

export default function RoundsAllocations() {
  const [loading, setLoading] = useState(false);
  const { token } = useTokenStore();
  const [statusFetch, setStatusFetch] = useState({ status: 0, message: "" });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([])
  const [form, setForm] = useState({
    driverId: "",
    vehicleId: "",
    date: "",
    routeId: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      form.driverId === "" ||
      form.vehicleId === "" ||
      form.date === "" ||
      form.routeId === ""
    ) {
      setStatusFetch({ status: 3, message: "All fields are required" });
      return;
    }

    setLoading(true);
    const { status, message } = await fetchAssignRoute(token, form);
    setLoading(false);
    setForm({
      driverId: "",
      vehicleId: "",
      date: "",
      routeId: "",
    });
    setStatusFetch({ status: status ? 1 : 2, message });
  };

  const getVehiclesAndDrivers = async () => {
    const { status, data } = await fetchVehicleAndDriver(token);
    if (status) {
      setDrivers(data.employees);
      setVehicles(data.vehicles);
    } else {
      setStatusFetch({
        status: 2,
        message: "Error fetching vehicles and drivers",
      });
    }
  };

  const getRoutes = async () => {
    const { status, message, data } = await getAllRoutes(token);
    if (status) {
      setRoutes(data.routes);
    } else {
      setStatusFetch({ status: 2, message });
    }

  }

  useEffect(() => {
    getVehiclesAndDrivers();
    getRoutes();
  }, []);

  const handleFocus = () => {
    setStatusFetch({ status: 0, message: "" });
  };

  const handleBlur = () => {
    setStatusFetch({ status: 0, message: "" });
  };

  return (
    <Layout>
      <div className="-mt-[97px]">
        <div className="flex justify-between p-8">
          <h1 className="text-2xl text-white font-semibold ml-20 mt-2">
            Rounds <span className="text-light-green">allocations</span>
          </h1>
        </div>
        <div className="mt-5 px-10">
          <h1 className="font-bold text-lg">Assignment</h1>
          <form
            className="space-y-4 mt-5 text-dark-blue flex items-left flex-col w-full"
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <label className="block text-base font-medium">Driver:</label>
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
                  <option key={index} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-base font-medium">Vehicle:</label>
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
                  <option key={index} value={vehicle.id}>
                    {vehicle.plaque}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label className="block text-base font-medium text-gray-700">
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
            <div className="w-full">
              <label className="block text-base font-medium text-gray-700">
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
                  <option key={index} value={route.id}>
                    {route.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              disabled={loading === true}
              type="submit"
              className="py-3 px-10 bg-primary-blue text-white rounded-lg hover:bg-green w-[20%]"
            >
              <div className="flex justify-center items-center">
                {loading ? <Spinner size={20} /> : "Assign"}
              </div>
            </button>
            {statusFetch.status !== 0 && (
              <p
                className={`${statusFetch.status === 1
                  ? "text-green"
                  : statusFetch.status === 2
                    ? "text-danger"
                    : "text-dark-blue"
                  } text-center rounded-lg bg-light-blue p-3 w-[full]`}
              >
                {statusFetch.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}
