import axios from "axios";
import { productStatusUrl } from "../config/urls.config";
import { formatISO } from "date-fns";

export const fetchProductStatus = (
  start,
  end,
  token,
  setProductsStatus,
  setIsLoading
) => {
  if (!end || !start || start === new Date()) {
    return;
  }

  const formattedStartDate = formatISO(start, { representation: "date" });
  const formattedEndDate = formatISO(end, { representation: "date" });
  console.log("🚀 ~ `${productStatusUrl}`:", `${productStatusUrl}?startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=1`)

  axios
    .get(`${productStatusUrl}?startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response);
      setProductsStatus(response.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};
