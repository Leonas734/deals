import { React, useEffect, useState } from "react";
import styles from "./ModalTemplate.module.css";
import { useResendEmailVerification } from "../hooks/useResendEmailVerification";

import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import ModalTemplate from "./ModalTemplate";

function VerifyEmailModal({ setModalIsOpen, modalIsOpen }) {
  const [newEmailSent, setNewEmailSent] = useState(false);
  function changeModalView() {
    setModalIsOpen(!modalIsOpen);
  }
  const {
    resendEmailVerification,
    resendEmailVerificationResponse,
    resendEmailVerificationIsPending,
    resendEmailVerificationError,
  } = useResendEmailVerification();
  useEffect(() => {
    if (resendEmailVerificationResponse) {
      setNewEmailSent(true);
    }
    return () => {
      setNewEmailSent(false);
    };
  }, [resendEmailVerificationResponse]);

  return (
    <>
      <ModalTemplate
        changeModalView={changeModalView}
        isOpen={modalIsOpen}
        dataCy={"verify-email-modal"}>
        {!resendEmailVerificationResponse && (
          <div>
            <h1 className={styles["modal-title"]}>
              Email verification required
            </h1>
            <p className={styles["modal-text"]}>
              You must verify your email to gain access to all website features.
            </p>
            <p
              onClick={() => resendEmailVerification()}
              className={styles["modal-resend-email"]}>
              Click here if you want us to send you another verification email
            </p>
            <ButtonPrimary
              text="Close"
              dataCy="email-verification-modal-button"
              action={changeModalView}
            />
          </div>
        )}
        {resendEmailVerificationResponse && (
          <div>
            <h1 className={styles["modal-title"]}>Email verification sent</h1>
            <ButtonPrimary
              text="Close"
              dataCy="email-verification-modal-button"
              action={changeModalView}
            />
          </div>
        )}
      </ModalTemplate>
    </>
  );
}

export default VerifyEmailModal;
