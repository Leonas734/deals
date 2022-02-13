import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";
import searchIcon from "../../assets/search-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import userIcon from "../../assets/user-icon.svg";
import closeIcon from "../../assets/x-icon.svg";

import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import VerifyEmailModal from "../modals/VerifyEmailModal";
import NavAccount from "./NavAccount";
import { useAuth } from "../context/authContext";

function Nav() {
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
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
        setShowMobileSearchBar(false);
      }
    });
  }, [userAuthState]);

  function logUserOut() {
    userAuthDispatch({ type: "logout" });
  }

  function navigateToNewDeal() {
    if (!userAuthState) {
      setShowLoginModal(true);
      return;
    }
    if (!userAuthState.emailVerified) {
      setShowVerifyEmailModal(true);
      return;
    }
    navigate("new_deal/");
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
      <VerifyEmailModal
        setModalIsOpen={setShowVerifyEmailModal}
        modalIsOpen={showVerifyEmailModal}
      />
      {!showMobileSearchBar && (
        <h1 className={styles["nav-title"]} onClick={() => navigate("/")}>
          Deals
        </h1>
      )}
      {(!mobileView || showMobileSearchBar) && (
        <div
          className={`${styles["nav-search-bar"]} ${
            showMobileSearchBar ? styles["nav-search-bar-mobile"] : null
          }`}>
          <img
            className={styles["nav-search-bar-icon"]}
            src={searchIcon}
            alt="Search"
          />
          {showMobileSearchBar && (
            <img
              src={closeIcon}
              alt="Close"
              className={`${styles["nav-search-bar-close-icon"]} ${styles["nav-search-bar-icon"]}`}
              onClick={() => setShowMobileSearchBar(!showMobileSearchBar)}
            />
          )}
          <input className={styles["nav-search-bar-input"]} />
        </div>
      )}
      {mobileView && !showMobileSearchBar && (
        <div
          className={`${styles["nav-button"]} ${styles["nav-button-search"]}`}
          onClick={() => setShowMobileSearchBar(!showMobileSearchBar)}>
          <img
            src={searchIcon}
            className={`${styles["nav-icon"]}`}
            alt="Search"
          />
        </div>
      )}
      {!userAuthState && (
        <div
          className={`${styles["nav-button"]} ${styles["nav-button-login-register"]}`}
          data-cy="nav-login-register-button"
          onClick={() => setShowLoginModal(true)}>
          <img src={userIcon} className={styles["nav-icon"]} alt="Person" />
          <p>Login / Register</p>
        </div>
      )}
      {userAuthState && <NavAccount user={userAuthState} logout={logUserOut} />}
      <div
        className={`${styles["nav-button"]} ${styles["nav-button-submit"]}`}
        data-cy="go-to-new-deal-button"
        onClick={() => {
          navigateToNewDeal();
        }}>
        <img src={plusIcon} className={styles["nav-icon"]} alt="Plus" />
        <p>Submit</p>
      </div>
    </div>
  );
}

export default Nav;
