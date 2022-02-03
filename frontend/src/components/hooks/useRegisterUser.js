import { useState } from "react";
import useAxios from "./useAxios";

export const useRegisterUser = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState(null);
  const api = useAxios();

  const registerUser = async (username, email, password, passwordRepeat) => {
    setError(null);
    setIsPending(true);
    try {
      if (password !== passwordRepeat) {
        throw {
          response: { data: { password: ["Passwords do not match"] } },
        };
      }

      const res = await api.post("/api/sign_up/", {
        username,
        email,
        password,
        password_repeat: passwordRepeat,
      });

      setResponse(res.data);
    } catch (err) {
      setError(err.response.data);
    }
    setIsPending(false);
  };

  return { registerUser, error, isPending, response };
};
