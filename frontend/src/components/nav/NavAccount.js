import React, { useState } from "react";
import styles from "./NavAccount.module.css";
import navStyles from "./Nav.module.css";
import { useNavigate } from "react-router-dom";

function NavAccount({ user, logout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  function showMenu() {
    setShowUserMenu(!showUserMenu);
  }
  const navigate = useNavigate();

  const profilePicture = new URL(
    user.profilePicture,
    process.env.REACT_APP_BASE_URL
  ).href;

  return (
    <div className={styles["nav-account"]} data-cy="nav-account-button">
      <img
        src={profilePicture}
        className={styles["nav-account-image"]}
        data-cy="nav-account-image"
        alt="Profile picture-image"
        onClick={showMenu}
      />
      {showUserMenu && (
        <div className={styles["nav-account-menu"]}>
          <p className={styles["nav-account-menu-username"]}>{user.username}</p>
          <p
            data-cy="nav-account-settings"
            className={styles["nav-account-menu-action"]}
            onClick={() => {
              showMenu();
              navigate("/account_settings");
            }}>
            Settings
          </p>
          <p
            className={styles["nav-account-menu-action"]}
            onClick={() => {
              logout();
            }}
            data-cy="nav-account-logout">
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default NavAccount;
