import { useState } from "react";
import useAxios from "./useAxios";

export const useEmailVerification = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState(null);
  const api = useAxios();

  const verifyEmail = async (userId, emailToken) => {
    try {
      const res = await api.post(
        `/api/email_verification/${userId}/${emailToken}/`
      );

      setResponse(res.data);
    } catch (err) {
      setError(err.response.data);
    }
    setIsPending(false);
  };

  return { verifyEmail, error, isPending, response };
};

export default useEmailVerification;
