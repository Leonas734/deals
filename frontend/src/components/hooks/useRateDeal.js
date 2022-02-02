import { useState } from "react";
import useAxios from "./useAxios";

export const useRateDeal = () => {
  const [error, setError] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState(null);
  const api = useAxios();

  /**
   * Send rating to API.
   * @param {string} dealId dealId - id of deal
   * @param {boolean} vote True=Upvote False=Downvote null=No vote
   */

  const rateDeal = async (dealId, vote) => {
    try {
      const res = await api.post(`/api/deal/${dealId}/vote/`, {
        vote,
      });
      console.log(res.data);
      console.log("SETTING RESPONSE");
      setResponse(res.data.deal);
    } catch (err) {
      console.log("ERROR");
      console.log(err.response);
      setError(err.response.data);
    }
    setIsPending(false);
  };

  return { rateDeal, error, isPending, response };
};
