import { useState } from "react";
import useAxios from "./useAxios";
import { useAuth } from "../context/authContext";

export const useUpdateUserPassword = () => {
  const [updateUserPasswordError, setUpdateUserPasswordError] = useState(null);
  const [updateUserPasswordIsPending, setUpdateUserPasswordIsPending] =
    useState(false);
  const [updateUserPasswordResponse, setUpdateUserPasswordResponse] =
    useState(null);
  const api = useAxios();
  const { state, dispatch: userAuthDispatch } = useAuth();

  const updateUserPassword = async (
    curPassword,
    newPassword,
    newPasswordRepeat
  ) => {
    setUpdateUserPasswordError(null);
    setUpdateUserPasswordIsPending(true);
    setUpdateUserPasswordResponse(null);
    try {
      const res = await api.post("/api/user/update_password/", {
        password: curPassword,
        new_password: newPassword,
        new_password_repeat: newPasswordRepeat,
      });
      userAuthDispatch({ type: "logout" });
      setUpdateUserPasswordResponse(res.data.detail);
    } catch (err) {
      console.log(err.response);
      setUpdateUserPasswordError(err.response.data);
    }
    setUpdateUserPasswordIsPending(false);
  };

  return {
    updateUserPassword,
    updateUserPasswordResponse,
    updateUserPasswordIsPending,
    updateUserPasswordError,
  };
};
