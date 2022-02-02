import { useState } from "react";
import useAxios from "./useAxios";

export const useLoginUser = () => {
  const [error, setError] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState("");
  const api = useAxios();

  const loginUser = async (username, password) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await api.post("/api/log_in/", { username, password });
      setResponse(res.data);
    } catch (err) {
      setError(err.response.data);
    }
    setIsPending(false);
  };

  return { loginUser, error, isPending, response };
};
