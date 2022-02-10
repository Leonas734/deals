import React from "react";
import styles from "./DealRating.module.css";
import arrowDownIcon from "../../assets/arrow-down-icon.svg";
import arrowUpIcon from "../../assets/arrow-up-icon.svg";
import { useRateDeal } from "../hooks/useRateDeal";
import { useState, useEffect } from "react";
import LoginModal from "../modals/LoginModal";
import VerifyEmailModal from "../modals/VerifyEmailModal";

function DealRating({
  deal,
  userAuthState,
  setDeal,
  setDeals,
  extraClassName,
  dataCy,
}) {
  const { rateDeal, rateDealError, rateDealIsPending, rateDealResponse } =
    useRateDeal();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);

  useEffect(() => {
    if (rateDealResponse) {
      if (setDeal) {
        setDeal(rateDealResponse);
      }
      if (setDeals) {
        setDeals((prevState) => {
          const newState = prevState.map((stateDeal) => {
            if (stateDeal.id === rateDealResponse.id) {
              return {
                ...stateDeal,
                rated_by_user: rateDealResponse.rated_by_user,
                rating: rateDealResponse.rating,
              };
            }
            return stateDeal;
          });

          return newState;
        });
      }
    }
    return () => {};
  }, [rateDealResponse]);

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
      deal.rated_by_user === true ? (rating = null) : (rating = true);
    }
    if (e.target.id === "rate-deal-down") {
      deal.rated_by_user === false ? (rating = null) : (rating = false);
    }
    rateDeal(deal.id, rating);
  }

  return (
    <>
      <VerifyEmailModal
        setModalIsOpen={setShowVerifyEmailModal}
        modalIsOpen={showVerifyEmailModal}
      />
      <LoginModal
        setModalIsOpen={setShowLoginModal}
        modalIsOpen={showLoginModal}
      />
      <div
        className={`${styles["deal-rating"]} ${extraClassName}`}
        data-cy={dataCy}>
        <img
          src={arrowUpIcon}
          id="rate-deal-up"
          alt="Arrow up"
          onClick={sendNewRating}
          className={`${styles["deal-list-view-rating-arrow-icon"]} ${
            deal.rated_by_user === true
              ? styles["deal-list-view-rating-arrow-icon-active"]
              : null
          }`}
        />
        <p>{deal.rating}</p>
        <img
          src={arrowDownIcon}
          id="rate-deal-down"
          alt="Arrow down"
          onClick={sendNewRating}
          className={`${styles["deal-list-view-rating-arrow-icon"]} ${
            deal.rated_by_user === false
              ? styles["deal-list-view-rating-arrow-icon-active"]
              : null
          }`}
        />
      </div>
    </>
  );
}

export default DealRating;
