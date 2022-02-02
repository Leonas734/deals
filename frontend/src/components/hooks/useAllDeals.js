import { useState } from "react";
import useAxios from "./useAxios";

export const useAllDeals = () => {
  const [allDealsError, setAllDealsError] = useState(null);
  const [allDealsIsPending, setAllDealsIsPending] = useState(false);
  const [allDeals, setAllDeals] = useState(null);
  const api = useAxios();

  const getAllDeals = async () => {
    setAllDealsError(null);
    setAllDealsIsPending(true);
    try {
      const res = await api.get("/api/deal/");
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
