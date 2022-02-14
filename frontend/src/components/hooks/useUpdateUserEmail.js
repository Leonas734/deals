import { useState } from "react";
import useAxios from "./useAxios";
import { useAuth } from "../context/authContext";

export const useUpdateUserEmail = () => {
  const [updateUserEmailError, setUpdateUserEmailError] = useState(null);
  const [updateUserEmailIsPending, setUpdateUserEmailIsPending] =
    useState(false);
  const [updateUserEmailResponse, setUpdateUserEmailResponse] = useState(null);
  const api = useAxios();
  const { state, dispatch: userAuthDispatch } = useAuth();

  const updateUserEmail = async (curPassword, newEmail) => {
    setUpdateUserEmailError(null);
    setUpdateUserEmailIsPending(true);
    setUpdateUserEmailResponse(null);
    try {
      const res = await api.post("/api/user/update_email/", {
        password: curPassword,
        email: newEmail,
      });
      userAuthDispatch({ type: "login", payload: res.data.token });
      setUpdateUserEmailResponse({ detail: res.data.detail });
    } catch (err) {
      setUpdateUserEmailError(err.response.data);
    }
    setUpdateUserEmailIsPending(false);
  };

  return {
    updateUserEmail,
    updateUserEmailResponse,
    updateUserEmailIsPending,
    updateUserEmailError,
  };
};
