import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useEmailVerification from "../hooks/useEmailVerification";
import styles from "./EmailVerification.module.css";

function EmailVerification() {
  const params = useParams();
  const {
    verifyEmail,
    emailVerificationError,
    emailVerificationIsPending,
    emailVerificationResponse,
  } = useEmailVerification();
  const navigate = useNavigate();

  useEffect(() => {
    if (params.userId && params.emailToken && !emailVerificationResponse) {
      verifyEmail(params.userId, params.emailToken);
    }
    if (emailVerificationResponse && !emailVerificationError) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
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
