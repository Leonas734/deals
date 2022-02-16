import React from "react";
import styles from "./UserIcon.module.css";
import { useNavigate } from "react-router-dom";

function UserIcon({ username, profilePictureUrl, dataCy, extraClassName }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/user/${username}`)}
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
