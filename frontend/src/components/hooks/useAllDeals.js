import { useState } from "react";
import useAxios from "./useAxios";

export const useAllDeals = () => {
  const [allDealsError, setAllDealsError] = useState(null);
  const [allDealsIsPending, setAllDealsIsPending] = useState(false);
  const [allDeals, setAllDeals] = useState(null);
  const api = useAxios();

  const getAllDeals = async (filters = null) => {
    setAllDealsError(null);
    setAllDealsIsPending(true);
    let sortOrder;
    let sortBy;
    const category = filters?.category?.replace(" & ", "+%26+");
    if (filters && filters.sortBy) {
      sortOrder = filters?.sortBy.toLowerCase().includes("descending")
        ? "-"
        : "";
      sortBy = filters?.sortBy.toLowerCase().includes("rating")
        ? `${sortOrder}rating`
        : `${sortOrder}created`;
    }
    let url = "/api/deals/";
    if (category && !sortBy) url += `?category=${category}`;
    if (sortBy && !category) url += `?ordering=${sortBy}`;
    if (category && sortBy) url += `?category=${category}&ordering=${sortBy}`;
    if (filters && filters.search)
      url += `?search=${filters.search.toLowerCase().replace(" ", "+")}`;
    try {
      const res = await api.get(url);
      setAllDeals(res.data);
    } catch (err) {
      setAllDealsError(err.response.data);
    }
    setAllDealsIsPending(false);
  };

  return {
    getAllDeals,
    setAllDeals,
    allDeals,
    allDealsIsPending,
    allDealsError,
  };
};
