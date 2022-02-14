import { useState } from "react";
import useAxios from "./useAxios";
import { useAuth } from "../context/authContext";

export const useEmailVerification = () => {
  const [emailVerificationError, setEmailVerificationError] = useState(null);
  const [emailVerificationIsPending, setEmailVerificationIsPending] =
    useState(false);
  const [emailVerificationResponse, setEmailVerificationResponse] =
    useState(null);
  const api = useAxios();
  const { state: userAuthState, dispatch } = useAuth();

  const verifyEmail = async (userId, emailToken) => {
    try {
      const res = await api.post(
        `/api/email_verification/${userId}/${emailToken}/`
      );
      setEmailVerificationResponse(res.data);
      if (userAuthState) {
        dispatch({
          type: "login",
          payload: res.data.token,
        });
      }
    } catch (err) {
      setEmailVerificationError(err.response.data);
    }
    setEmailVerificationIsPending(false);
  };

  return {
    verifyEmail,
    emailVerificationError,
    emailVerificationIsPending,
    emailVerificationResponse,
  };
};

export default useEmailVerification;
