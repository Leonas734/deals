import { React, useState } from "react";
import ModalTemplate from "./ModalTemplate";
import styles from "./ModalTemplate.module.css";
import ButtonPrimary from "../buttons/ButtonPrimary";
import Loader from "../misc/Loader";

import { useRegisterUser } from "../hooks/useRegisterUser";

function RegisterModal({ setModalIsOpen, modalIsOpen }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const { registerUser, error, isPending, response } = useRegisterUser();

  function changeModalView() {
    setModalIsOpen(false);
  }

  function handleCreateAccount(e) {
    e.preventDefault();
    registerUser(username, email, password, passwordRepeat);
  }

  return (
    <>
      <ModalTemplate
        changeModalView={changeModalView}
        dataCy={"register-modal"}
        isOpen={modalIsOpen}>
        {response && (
          <div>
            <h1 className={styles["modal-title"]} data-cy="response-title">
              {response.username}
            </h1>
            <p className={styles["modal-text"]} data-cy="response-text">
              Your account has been created. You can now login. But first please
              check your inbox and validate your email.
            </p>
            <ButtonPrimary
              text="Close window"
              action={changeModalView}
              dataCy={"response-close-button"}
            />
          </div>
        )}
        {!response && (
          <>
            <h1 className={styles["modal-title"]}>Register</h1>
            <form
              className={styles["input-form"]}
              onSubmit={handleCreateAccount}>
              <label>
                <span>Username</span>
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  type="text"
                  data-cy="register-username"></input>
              </label>
              {error && error.username && (
                <p
                  className={styles["modal-error-message"]}
                  data-cy="register-username-error">
                  {error.username}
                </p>
              )}

              <label>
                <span>Email</span>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="text"
                  data-cy="register-email"></input>
              </label>
              {error && error.email && (
                <p
                  className={styles["modal-error-message"]}
                  data-cy="register-email-error">
                  {error.email}
                </p>
              )}

              <label>
                <span>Password</span>
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  data-cy="register-password"></input>
              </label>
              {error && error.password && (
                <p
                  className={styles["modal-error-message"]}
                  data-cy="register-password-error">
                  {error.password}
                </p>
              )}

              <label>
                <span>Repeat password</span>
                <input
                  value={passwordRepeat}
                  onChange={(e) => {
                    setPasswordRepeat(e.target.value);
                  }}
                  type="password"
                  data-cy="register-password-repeat"></input>
              </label>
              {error && error.password_repeat && (
                <p
                  className={styles["modal-error-message"]}
                  data-cy="register-password-repeat-error">
                  {error.password_repeat}
                </p>
              )}

              <ButtonPrimary
                text="Create account"
                dataCy="create-account-button"
              />
            </form>
          </>
        )}
      </ModalTemplate>

      <Loader isOpen={isPending} />
    </>
  );
}

export default RegisterModal;
