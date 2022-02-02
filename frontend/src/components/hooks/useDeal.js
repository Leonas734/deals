import { useState } from "react";
import useAxios from "./useAxios";

export const useDeal = () => {
  const [dealError, setDealError] = useState(null);
  const [dealIsPending, setDealIsPending] = useState(false);
  const [deal, setDeal] = useState(null);
  const api = useAxios();

  const getDeal = async (dealId) => {
    setDealError(null);
    setDealIsPending(true);
    try {
      const res = await api.get(`/api/deal/${dealId}`);
      setDeal(res.data);
    } catch (err) {
      setDealError(err.response.data);
    }
    setDealIsPending(false);
  };

  return { getDeal, setDeal, dealError, dealIsPending, deal };
};
