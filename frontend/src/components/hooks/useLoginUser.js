import { useState } from "react";

export const useLoginUser = () => {
  const [error, setError] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState("");

  const loginUser = async (username, password) => {
    setError(null);
    setIsPending(true);
    try {
      const res = await fetch(
        `http://${window.location.hostname}:8000/api/log_in/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(JSON.stringify(data));
      }
      setResponse(data);
    } catch (err) {
      setError({ ...JSON.parse(err.message) });
    }
    setIsPending(false);
  };

  return { loginUser, error, isPending, response };
};
