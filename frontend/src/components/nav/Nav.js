import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";
import searchIcon from "../../assets/search-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import userIcon from "../../assets/user-icon.svg";

import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import NavAccount from "./NavAccount";
import { useAuth } from "../context/authContext";

function Nav() {
  const [mobileView, setMobileView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const { state: userAuthState, dispatch: userAuthDispatch } = useAuth();

  useEffect(() => {
    const mobileWidth = 600;
    if (window.innerWidth <= mobileWidth) {
      setMobileView(true);
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth <= mobileWidth) {
        setMobileView(true);
      } else {
        setMobileView(false);
      }
    });
  }, [userAuthState]);

  function logUserOut() {
    userAuthDispatch({ type: "logout" });
  }

  return (
    <div className={styles["nav"]} id="nav">
      {!userAuthState && (
        <LoginModal
          setModalIsOpen={setShowLoginModal}
          modalIsOpen={showLoginModal}
          setRegisterModalIsOpen={setShowRegisterModal}
        />
      )}
      {!userAuthState && (
        <RegisterModal
          setModalIsOpen={setShowRegisterModal}
          modalIsOpen={showRegisterModal}
        />
      )}
      <h1 className={styles["nav-title"]} onClick={() => navigate("/")}>
        Deals
      </h1>
      {!mobileView && (
        <div className={styles["nav-search-bar"]}>
          <img
            className={styles["nav-search-bar-icon"]}
            src={searchIcon}
            alt="Search"
          />
          <input className={styles["nav-search-bar-input"]} />
        </div>
      )}
      <div className={styles["nav-buttons"]}>
        {mobileView && (
          <div className={styles["nav-button"]}>
            <img src={searchIcon} className={styles["nav-icon"]} alt="Search" />
          </div>
        )}
        {!userAuthState && (
          <div
            className={`${styles["nav-button"]}`}
            data-cy="nav-login-register-button"
            onClick={() => setShowLoginModal(true)}>
            <img src={userIcon} className={styles["nav-icon"]} alt="Person" />
            <p>Login / Register</p>
          </div>
        )}
        {userAuthState && (
          <NavAccount user={userAuthState} logout={logUserOut} />
        )}
        <div className={`${styles["nav-button"]} `}>
          <img src={plusIcon} className={styles["nav-icon"]} alt="Plus" />
          <p>Submit</p>
        </div>
      </div>
    </div>
  );
}

export default Nav;
