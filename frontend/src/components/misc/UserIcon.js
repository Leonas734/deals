import React from "react";
import styles from "./UserIcon.module.css";

function UserIcon({ username, profilePictureUrl, dataCy, extraClassName }) {
  return (
    <div
      className={`${styles["user-icon"]} ${
        extraClassName ? extraClassName : null
      } `}
      data-cy={dataCy ? dataCy : null}>
      <img
        src={new URL(profilePictureUrl, process.env.REACT_APP_BASE_URL).href}
      />
      <p>{username}</p>
    </div>
  );
}

export default UserIcon;
