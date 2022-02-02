import { useState } from "react";
import useAxios from "./useAxios";

export const useAllDeals = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [allDeals, setAllDeals] = useState(null);
  const api = useAxios();

  const getAllDeals = async () => {
    setError(null);
    setIsPending(true);
    try {
      const res = await api.get("/api/deal/");
      setAllDeals(res.data);
    } catch (err) {
      setError(err.response.data);
    }
    setIsPending(false);
  };

  return { getAllDeals, error, isPending, allDeals, setAllDeals };
};
