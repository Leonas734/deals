import { useState } from "react";
import useAxios from "./useAxios";

export const useRateDeal = () => {
  const [rateDealError, setRateDealError] = useState(null);
  const [rateDealIsPending, setRateDealIsPending] = useState(false);
  const [rateDealResponse, setRateDealResponse] = useState(null);
  const api = useAxios();

  /**
   * Send rating to API.
   * @param {string} dealId dealId - id of deal
   * @param {boolean} vote True=Upvote False=Downvote null=No vote
   */

  const rateDeal = async (dealId, vote) => {
    try {
      const res = await api.post(`/api/deals/${dealId}/vote/`, {
        vote,
      });
      setRateDealResponse(res.data.deal);
    } catch (err) {
      setRateDealError(err.response.data);
    }
    setRateDealIsPending(false);
  };

  return { rateDeal, rateDealError, rateDealIsPending, rateDealResponse };
};
