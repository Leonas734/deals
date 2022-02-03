import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";
import searchIcon from "../../assets/search-icon.svg";
import plusIcon from "../../assets/plus-icon.svg";
import userIcon from "../../assets/user-icon.svg";

function Nav() {
  const [mobileView, setMobileView] = useState(false);
  const [stickyNav, setStickyNav] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth <= 600) {
        setMobileView(true);
      } else {
        setMobileView(false);
      }
    });
  }, []);

  return (
    <div className={styles["nav"]} id="nav">
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
          <div
            className={`${styles["nav-button"]} ${styles["nav-button-search"]}`}>
            <img src={searchIcon} className={styles["nav-icon"]} alt="Search" />
          </div>
        )}
        <div
          className={`${styles["nav-button"]} ${styles["nav-button-login-register"]}`}>
          <img src={userIcon} className={styles["nav-icon"]} alt="Person" />
          <p>Login / Register</p>
        </div>
        <div
          className={`${styles["nav-button"]} ${styles["nav-button-submit"]}`}>
          <img src={plusIcon} className={styles["nav-icon"]} alt="Plus" />
          <p>Submit</p>
        </div>
      </div>
    </div>
  );
}

export default Nav;
