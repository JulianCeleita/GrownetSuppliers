import axios from "axios";
import { productStatusUrl } from "../config/urls.config";
import { formatISO } from "date-fns";

export const fetchProductStatus = (
  start,
  end,
  token,
  setProductsStatus,
  setIsLoading,
  presentation,
  group
) => {
  if (!end || !start || start === new Date()) {
    return;
  }
  setIsLoading(true);

  const formattedStartDate = formatISO(start, { representation: "date" });
  const formattedEndDate = formatISO(end, { representation: "date" });
  console.log("🚀 ~ `${productStatusUrl}`:", `${productStatusUrl}?startDate=${formattedStartDate}&endDate=${formattedEndDate}&page=1`)

  const postData = {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    groupId: group,
    presentationId: presentation
  }
  console.log("🚀 ~ postData:", postData)
  axios
    .get(productStatusUrl, {
      params: postData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      console.log("🚀 ~ .then ~ response:", response);
      setProductsStatus(response.data.data);
      setIsLoading(false);
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};
