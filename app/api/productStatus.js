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
  group,
  page,
  setPage,
  setTotalPages,
  missing
) => {
  if (!end || !start || start === new Date()) {
    return;
  }
  setIsLoading(true);

  const formattedStartDate = formatISO(start, { representation: "date" });
  const formattedEndDate = formatISO(end, { representation: "date" });

  const postData = {
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    groupId: group,
    presentationId: presentation,
    page: page,
    missing: missing
  }
  axios
    .get(productStatusUrl, {
      params: postData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setProductsStatus(response.data.data);
      setIsLoading(false);
      setTotalPages(response.data.last_page);
      setPage(response.data.current_page);
    })
    .catch((error) => {
      console.log("🚀 ~ error:", error);
    });
};
