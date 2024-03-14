import axios from "axios";
const { allRoutes } = require("../config/urls.config");

export const getAllRoutes = async (token) => {
    try {
        const response = await axios.get(allRoutes,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { status: true, message: '', data: response.data };
    } catch (error) {
        console.error("Error when bringing routes", error);
        return { status: false, message: 'Error when bringing routes', data: [] };
    }
}