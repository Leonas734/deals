import { React } from "react";
import styles from "./ModalTemplate.module.css";

import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import ModalTemplate from "./ModalTemplate";

function VerifyEmailModal({ setModalIsOpen, modalIsOpen }) {
  function changeModalView() {
    setModalIsOpen(!modalIsOpen);
  }

  return (
    <>
      <ModalTemplate
        changeModalView={changeModalView}
        isOpen={modalIsOpen}
        dataCy={"verify-email-modal"}>
        <div>
          <h1 className={styles["modal-title"]}>Email verification required</h1>
          <p className={styles["modal-text"]}>
            You must verify your email to gain access to all website features.
          </p>
          <ButtonPrimary
            text="Close"
            dataCy="email-verification-modal-button"
            action={changeModalView}
          />
        </div>
      </ModalTemplate>
    </>
  );
}

export default VerifyEmailModal;
