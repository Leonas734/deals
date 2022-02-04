import { useState } from "react";
import useAxios from "./useAxios";

export const useDealComments = () => {
  const [dealCommentsError, setAllDealCommentsError] = useState(null);
  const [dealCommentsIsPending, setAllDealCommentsIsPending] = useState(false);
  const [dealComments, setDealComments] = useState(null);
  const api = useAxios();

  const getDealComments = async (dealId) => {
    setAllDealCommentsError(null);
    setAllDealCommentsIsPending(true);
    try {
      const res = await api.get(`/api/deals/${dealId}/comments/`);
      setDealComments(res.data);
    } catch (err) {
      setAllDealCommentsError(err.response.data);
    }
    setAllDealCommentsIsPending(false);
  };

  return {
    getDealComments,
    setDealComments,
    dealCommentsError,
    dealCommentsIsPending,
    dealComments,
  };
};
