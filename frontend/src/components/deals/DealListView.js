import styles from "./DealListView.module.css";
import arrowDownIcon from "../../assets/arrow-down-icon.svg";
import arrowUpIcon from "../../assets/arrow-up-icon.svg";
import urlIcon from "../../assets/link-icon.svg";
import LoginModal from "../modals/LoginModal";
import VerifyEmailModal from "../modals/VerifyEmailModal";

import createdAgoDateTime from "../../utils/createdAgoDateTime";
import openInNewTab from "../../utils/openInNewTab";

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRateDeal } from "../hooks/useRateDeal";
import { useAuth } from "../context/authContext";
import UserIcon from "../misc/UserIcon";

function DealListView({ deal, setDeals }) {
  const { rateDeal, rateDealError, rateDealIsPending, rateDealResponse } =
    useRateDeal();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const { state: userAuthState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (rateDealResponse) {
      setDeals((prevState) => {
        const newState = prevState.map((stateDeal) => {
          if (stateDeal.id === rateDealResponse.id) {
            return {
              ...stateDeal,
              voted_by_user: rateDealResponse.voted_by_user,
              rating: rateDealResponse.rating,
            };
          }
          return stateDeal;
        });

        return newState;
      });
    }
  }, [rateDealResponse, userAuthState]);

  function sendNewRating(e) {
    let rating = null;
    if (!userAuthState) {
      setShowLoginModal(true);
      return;
    }
    if (!userAuthState.emailVerified) {
      setShowVerifyEmailModal(true);
      return;
    }
    // null = no vote, true = vote up, false = vote down.
    if (e.target.id === "rate-deal-up") {
      deal.voted_by_user === true ? (rating = null) : (rating = true);
    }
    if (e.target.id === "rate-deal-down") {
      deal.voted_by_user === false ? (rating = null) : (rating = false);
    }
    rateDeal(deal.id, rating);
  }

  function goToDealView() {
    navigate(`/deal/${deal.id}`);
  }

  const dealImg = new URL(deal.image, process.env.REACT_APP_BASE_URL).href;
  const userImg = new URL(
    deal.user.profile_picture,
    process.env.REACT_APP_BASE_URL
  ).href;
  const dealCreatedDate = createdAgoDateTime(deal.created);

  return (
    <div className={styles["deal-list-view-container"]}>
      <LoginModal
        modalIsOpen={showLoginModal}
        setModalIsOpen={setShowLoginModal}
      />
      <VerifyEmailModal
        modalIsOpen={showVerifyEmailModal}
        setModalIsOpen={setShowVerifyEmailModal}
      />
      <div
        className={styles["deal-list-view-rating"]}
        data-cy="deal-list-view-rating">
        <img
          src={arrowUpIcon}
          className={
            deal.voted_by_user === true
              ? styles["deal-list-view-rating-vote"]
              : null
          }
          id="rate-deal-up"
          onClick={sendNewRating}
        />
        <p className={styles["deal-list-view-rating-count"]}>{deal.rating}</p>
        <img
          src={arrowDownIcon}
          className={
            deal.voted_by_user === false
              ? styles["deal-list-view-rating-vote"]
              : null
          }
          id="rate-deal-down"
          onClick={sendNewRating}
        />
      </div>
      <img
        src={dealImg}
        className={styles["deal-list-view-image"]}
        alt="Deal image"
        data-cy="deal-list-view-image"
        onClick={goToDealView}
      />
      <div
        className={styles["deal-list-view-details"]}
        data-cy="deal-list-view-details">
        <h2 className={styles["deal-list-view-title"]} onClick={goToDealView}>
          {deal.title}
        </h2>
        {deal.price > 0 ? (
          <p
            className={styles["deal-list-view-price"]}
            data-cy="deal-list-view-price">
            £{deal.price}
          </p>
        ) : (
          ""
        )}
        <UserIcon
          dataCy={"deal-list-view-user-details"}
          username={deal.user.username}
          profilePictureUrl={deal.user.profile_picture}
        />
        <div
          className={styles["deal-list-view-extras"]}
          data-cy="deal-list-view-extras">
          <div
            className={styles["deal-list-view-link"]}
            onClick={() => {
              openInNewTab(deal.url);
            }}>
            <img
              src={urlIcon}
              alt="Go to deal"
              className={styles["deal-list-view-link-icon"]}
            />
            <p className={styles["deal-list-view-link-text"]}>Get deal</p>
          </div>
          <p
            className={styles["deal-list-view-date"]}
            data-cy="deal-list-view-date-created">
            Posted {dealCreatedDate}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DealListView;
