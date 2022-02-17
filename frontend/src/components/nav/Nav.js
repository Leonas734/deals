import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useAllDeals } from "../hooks/useAllDeals";

function Nav() {
  const mobileWidth = 600;
  const [showMobileSearchBar, setShowMobileSearchBar] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state: userAuthState, dispatch: userAuthDispatch } = useAuth();
  const {
    getAllDeals: searchDeals,
    allDeals: searchDealsResults,
    allDealsIsPending,
    allDealsError,
  } = useAllDeals();

  window.addEventListener("resize", () => {
    if (window.innerWidth <= mobileWidth) {
      setMobileView(true);
    } else {
      setMobileView(false);
      setShowMobileSearchBar(false);
    }
  });

  useEffect(() => {
    if (window.innerWidth <= mobileWidth) {
      setMobileView(true);
    }
    if (searchContent.length > 0) {
      searchDeals({ search: searchContent });
    }
  }, [userAuthState, searchContent]);

  function logUserOut() {
    userAuthDispatch({ type: "logout" });
  }

  function navigateHome() {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
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
        <h1 className={styles["nav-title"]} onClick={() => navigateHome()}>
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
          <input
            data-cy="nav-search-bar-input"
            className={styles["nav-search-bar-input"]}
            value={searchContent}
            onChange={(e) => setSearchContent(e.target.value)}
          />
          {searchContent.length > 0 && searchDealsResults && (
            <div
              className={styles["nav-search-bar-results"]}
              data-cy="nav-search-bar-results">
              {searchDealsResults.map((deal) => {
                return (
                  <div
                    onClick={() => {
                      navigate(`deal/${deal.id}`);
                      setSearchContent("");
                    }}
                    key={deal.id}
                    className={styles["nav-search-bar-result"]}>
                    <img
                      className={styles["nav-search-bar-result-img"]}
                      src={
                        new URL(deal.image, process.env.REACT_APP_BASE_URL).href
                      }
                    />
                    <p className={styles["nav-search-bar-result-title"]}>
                      {deal.title}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
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
