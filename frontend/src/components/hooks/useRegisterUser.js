import { useState } from "react";

export const useRegisterUser = () => {
  const [error, setError] = useState({});
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState("");

  const registerUser = async (username, email, password, passwordRepeat) => {
    setError(null);
    setIsPending(true);
    try {
      if (password !== passwordRepeat) {
        throw new Error(
          JSON.stringify({ password: ["Passwords do not match"] })
        );
      }
      const res = await fetch(
        `http://${window.location.hostname}:8000/api/sign_up/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
            password_repeat: passwordRepeat,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(JSON.stringify(data));
      }
      setResponse(data["username"]);
    } catch (err) {
      setError({ ...JSON.parse(err.message) });
    }
    setIsPending(false);
  };

  return { registerUser, error, isPending, response };
};
