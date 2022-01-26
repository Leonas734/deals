import React, { useState } from "react";
import styles from "./NavAccount.module.css";
import ModalTemplate from "../modals/ModalTemplate";
import ButtonPrimary from "../buttons/ButtonPrimary";
import ButtonSecondary from "../buttons/ButtonSecondary";
import { Link } from "react-router-dom";

function NavAccount({ user, logout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  function showMenu() {
    setShowUserMenu(!showUserMenu);
  }

  function showLogoutModal() {
    setShowLogoutConfirmation(!showLogoutConfirmation);
  }

  const profilePicture = new URL(
    user.profilePicture,
    process.env.REACT_APP_BASE_URL
  ).href;

  return (
    <div className={styles["nav-account"]}>
      <img
        src={profilePicture}
        className={styles["nav-account-image"]}
        data-cy="nav-account-image"
        alt="Profile picture-image"
        onClick={showMenu}
      />
      {showUserMenu && (
        <div className={styles["nav-account-menu"]} data-cy="nav-account-menu">
          <Link
            onClick={showMenu}
            to="account/settings"
            className={styles["account-menu-link"]}>
            Settings
          </Link>
          <p
            className={styles["account-menu-link"]}
            onClick={() => {
              setShowLogoutConfirmation(true);
            }}
            data-cy="nav-account-menu-logout">
            Logout
          </p>
        </div>
      )}
      <ModalTemplate
        changeModalView={showLogoutModal}
        isOpen={showLogoutConfirmation}
        dataCy="logout-confirmation-modal">
        <div className={styles["logout-content"]}>
          <h1
            className={styles["logout-title"]}
            data-cy="logout-confirmation-title">
            Are you sure you wish to logout?
          </h1>
          <ButtonPrimary
            text="Yes"
            action={logout}
            dataCy="logout-confirmation-yes-button"
          />
          <ButtonSecondary
            text="No"
            action={showLogoutModal}
            dataCy="logout-confirmation-no-button"
          />
        </div>
      </ModalTemplate>
    </div>
  );
}

export default NavAccount;
