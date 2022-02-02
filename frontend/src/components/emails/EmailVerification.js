import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useEmailVerification from "../hooks/useEmailVerification";
import styles from "./EmailVerification.module.css";
import { useAuth } from "../context/authContext";

function EmailVerification() {
  const params = useParams();
  const {
    verifyEmail,
    emailVerificationError,
    emailVerificationIsPending,
    emailVerificationResponse,
  } = useEmailVerification();
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.userId && params.emailToken && !emailVerificationResponse) {
      verifyEmail(params.userId, params.emailToken);
    }
    if (emailVerificationResponse && !emailVerificationError) {
      dispatch({
        type: "logout",
      });
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [params, emailVerificationResponse]);
  return (
    <div className={styles["container"]}>
      {emailVerificationResponse && !emailVerificationError && (
        <p className={styles["text"]}>
          {emailVerificationResponse.detail} Redirecting back to homepage...
        </p>
      )}
      {emailVerificationError && (
        <p className={styles["text"]}>{emailVerificationError.detail}</p>
      )}
    </div>
  );
}

export default EmailVerification;
