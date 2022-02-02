import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useEmailVerification from "../hooks/useEmailVerification";
import styles from "./EmailVerification.module.css";
import { useAuth } from "../context/authContext";

function EmailVerification() {
  const params = useParams();
  const { verifyEmail, error, isPending, response } = useEmailVerification();
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.userId && params.emailToken && !response) {
      verifyEmail(params.userId, params.emailToken);
    }
    if (response && !error) {
      dispatch({
        type: "logout",
      });
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [params, response]);
  return (
    <div className={styles["container"]}>
      {response && !error && (
        <p className={styles["text"]}>
          {response.detail} Redirecting back to homepage...
        </p>
      )}
      {error && <p className={styles["text"]}>{error.detail}</p>}
    </div>
  );
}

export default EmailVerification;
