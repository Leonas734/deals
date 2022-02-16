import styles from "./UserView.module.css";
import { useParams } from "react-router-dom";
import React from "react";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { useGetUser } from "../hooks/useGetUser";

function UserView() {
  const { state: userAuthState } = useAuth();
  const params = useParams();
  const { getUser, getUserError, getUserIsPending, getUserResponse } =
    useGetUser();
  useEffect(() => {
    getUser(params.userName);
  }, []);

  return (
    <div className={styles["user-view-main"]}>
      {getUserResponse && (
        <div className={styles["user-view-user-details"]}>
          <img
            data-cy="user-view-profile-picture"
            className={styles["user-view-profile-picture"]}
            src={
              new URL(
                getUserResponse.profile_picture,
                process.env.REACT_APP_BASE_URL
              ).href
            }
          />
          <p className={styles["user-view-username"]}>
            {getUserResponse.username}
          </p>
          <p className={styles["user-view-total-deals-posted"]}>
            Total deals posted: {getUserResponse.total_deals_posted}
          </p>
          <p className={styles["user-view-user-joined"]}>
            Member since:{" "}
            {new Date(getUserResponse.date_joined).toDateString("en-GB")}
          </p>
        </div>
      )}
      {getUserError && getUserError.detail && (
        <p className={styles["user-view-error"]}>{getUserError.detail}</p>
      )}
    </div>
  );
}

export default UserView;
