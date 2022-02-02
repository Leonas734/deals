import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import styles from "./Nav.module.css";
import searchIcon from "../../assets/search-icon.svg";
import giftIcon from "../../assets/gift-icon.svg";

import { useAuth } from "../context/authContext";

import ButtonPrimary from "../buttons/ButtonPrimary";
import ButtonSecondary from "../buttons/ButtonSecondary";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import NavAccount from "./NavAccount";

const Nav = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { state: authState, dispatch: authDispatch } = useAuth();

  function logUserOut() {
    authDispatch({ type: "logout" });
  }

  return (
    <>
      <div className={styles["nav-bar"]}>
        <li className={styles["nav-logo"]}>
          <img
            src={giftIcon}
            className={styles["nav-logo__icon"]}
            alt="Company icon"
          />
          <Link to="/" className={styles["nav-logo__text"]}>
            deals
          </Link>
        </li>
        <div className={styles["nav-search"]}>
          <img
            src={searchIcon}
            alt="Search icon"
            className={styles["nav-search__icon"]}
          />
          <input
            type="text"
            className={styles["nav-search__input"]}
            placeholder="Search..."></input>
        </div>
        {!authState && (
          <ButtonPrimary
            text="Log in"
            action={setShowLoginModal}
            actionState={showLoginModal}
            dataCy="nav-login-button"
          />
        )}
        {!authState && (
          <ButtonSecondary
            text="Register"
            action={setShowRegisterModal}
            actionState={showRegisterModal}
            dataCy="nav-register-button"
          />
        )}
        {authState && <NavAccount user={authState} logout={logUserOut} />}
      </div>
      {showLoginModal && (
        <LoginModal
          setModalIsOpen={setShowLoginModal}
          modalIsOpen={showLoginModal}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          setModalIsOpen={setShowRegisterModal}
          modalIsOpen={showRegisterModal}
          dataCy="register-modal"
        />
      )}
    </>
  );
};

export default Nav;
