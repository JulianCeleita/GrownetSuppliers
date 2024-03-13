import axios from "axios";
import { assignRoute } from "../config/urls.config";

export const fetchAssignRoute = async (token, form) => {

  const body = {
    driver_id: form.driverId,
    vehicle_id: form.vehicleId,
    date: form.date,
    route_id: form.routeId,
  };

  try {
    await axios.post(assignRoute, body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { status: true, message: 'Correctly assigned route' };
  } catch (error) {
    console.error("Error assigning route", error);
    return { status: false, message: 'Error assigning route' };
  }
};
