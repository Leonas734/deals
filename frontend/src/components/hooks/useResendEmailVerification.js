import { useState } from "react";
import useAxios from "./useAxios";

export const useResendEmailVerification = () => {
  const [resendEmailVerificationError, setResendEmailVerificationError] =
    useState(null);
  const [
    resendEmailVerificationIsPending,
    setResendEmailVerificationIsPending,
  ] = useState(false);
  const [resendEmailVerificationResponse, setResendEmailVerificationResponse] =
    useState(null);
  const api = useAxios();

  const resendEmailVerification = async () => {
    setResendEmailVerificationError(null);
    setResendEmailVerificationIsPending(true);
    try {
      const res = await api.get("/api/email_verification/new_token/");
      setResendEmailVerificationResponse(res.data);
    } catch (err) {
      setResendEmailVerificationError(err.response.data);
    }
    setResendEmailVerificationIsPending(false);
  };

  return {
    resendEmailVerification,
    resendEmailVerificationResponse,
    resendEmailVerificationIsPending,
    resendEmailVerificationError,
  };
};
