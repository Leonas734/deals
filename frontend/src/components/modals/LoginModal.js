import { React, useState, useEffect } from "react";
import styles from "./ModalTemplate.module.css";

import ButtonPrimary from "../../components/buttons/ButtonPrimary";
import Loader from "../misc/Loader";
import ModalTemplate from "./ModalTemplate";
import { useLoginUser } from "../hooks/useLoginUser";
import { useAuth } from "../context/authContext";

function LoginModal({ setModalView, modalView }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser, error, isPending, response } = useLoginUser();
  const { dispatch, state } = useAuth();

  function changeModalView() {
    setModalView(!modalView);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(username, password);
  };

  useEffect(() => {
    // API login successfull
    if (response) {
      window.localStorage.setItem("deals.auth", JSON.stringify(response));
      const [, payload] = response.access.split(".");
      const decoded = JSON.parse(window.atob(payload));
      dispatch({
        type: "login",
        payload: {
          userId: decoded.id,
          username: decoded.username,
          profilePicture: decoded.profile_picture,
        },
      });
      changeModalView();
    }
  }, [response]);

  return (
    <>
      <ModalTemplate
        changeModalView={changeModalView}
        isOpen={modalView}
        dataCy={"login-modal"}>
        <h1 className={styles["modal-title"]}>Login</h1>
        <form className={styles["input-form"]} onSubmit={handleLogin}>
          <label>
            <span>Username/Email</span>
            <input
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              data-cy="login-username"></input>
          </label>
          {error && error.username && (
            <p
              className={styles["modal-error-message"]}
              data-cy="login-username-error">
              {error.username}
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
              data-cy="login-password"></input>
          </label>
          {error && error.password && (
            <p
              className={styles["modal-error-message"]}
              data-cy="login-password-error">
              {error.password}
            </p>
          )}
          {error && error.detail && (
            <p
              className={styles["modal-error-message"]}
              data-cy="login-detail-error">
              {error.detail}
            </p>
          )}
          <ButtonPrimary text="Log in" dataCy="login-modal-button" />
        </form>
      </ModalTemplate>
      <Loader isOpen={isPending} dataCy="loader-background" />
    </>
  );
}

export default LoginModal;
