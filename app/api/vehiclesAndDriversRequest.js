import axios from "axios";
import { vehiclesAndDrivers } from "../config/urls.config";

export const fetchVehicleAndDriver = async (token) => {
    try {
        const response = await axios.get(vehiclesAndDrivers, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { status: true, data: response.data };
    } catch (error) {
        console.error("Error fetching vehicles and drivers", error);
        return { status: false, message: 'Error fetching vehicles and drivers' };
    }
}