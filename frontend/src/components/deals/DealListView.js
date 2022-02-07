import styles from "./DealListView.module.css";
import clockIcon from "../../assets/clock-icon.svg";
import calendarIcon from "../../assets/calendar-icon.svg";
import deliveryIcon from "../../assets/delivery-icon.svg";
import commentIcon from "../../assets/annotation-icon.svg";
import urlIcon from "../../assets/link-icon.svg";
import verticalDotsIcon from "../../assets/vertical-dots-icon.svg";
import LoginModal from "../modals/LoginModal";
import VerifyEmailModal from "../modals/VerifyEmailModal";
import DealRating from "../rating/DealRating";
import UserIcon from "../misc/UserIcon";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRateDeal } from "../hooks/useRateDeal";
import { useAuth } from "../context/authContext";

import createdAgoDateTime from "../../utils/createdAgoDateTime";

function DealListView({ deal, setDeals }) {
  const { rateDeal, rateDealError, rateDealIsPending, rateDealResponse } =
    useRateDeal();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [showDatesOnMobile, setShowDatesOnMobile] = useState(false);
  const { state: userAuthState } = useAuth();
  const navigate = useNavigate();

  function goToDealView() {
    navigate(`/deal/${deal.id}`);
  }

  return (
    <div className={styles["deal-list-view-container"]}>
      <VerifyEmailModal
        setModalIsOpen={setShowVerifyEmailModal}
        modalIsOpen={showVerifyEmailModal}
      />
      <LoginModal
        setModalIsOpen={setShowLoginModal}
        modalIsOpen={showLoginModal}
      />
      <img
        src={new URL(deal.image, process.env.REACT_APP_BASE_URL).href}
        className={styles["deal-list-view-image"]}
        alt="Deal image"
        data-cy="deal-list-view-image"
        onClick={goToDealView}
      />
      <div className={styles["deal-list-view-rating-and-dates-container"]}>
        <DealRating
          deal={deal}
          userAuthState={userAuthState}
          setDeals={setDeals}
          dataCy={"deal-list-view-rating"}
        />
        <div className={styles["deal-list-view-deal-posted-date"]}>
          <img
            src={clockIcon}
            className={styles["deal-list-view-deal-posted-date-icon"]}
          />
          <p data-cy="deal-list-view-posted-date">
            Posted {`${createdAgoDateTime(deal.created)}`}
          </p>
        </div>
        {deal.deal_end_date && (
          <div className={styles["deal-list-view-deal-expiry-date"]}>
            <img
              src={calendarIcon}
              className={styles["deal-list-view-deal-expiry-date-icon"]}
            />
            <p data-cy="deal-list-view-expiration-date">
              Expires{" "}
              {`${new Date(deal.deal_end_date).toLocaleDateString("en-US")}`}
            </p>
          </div>
        )}
        <div
          className={styles["deal-list-view-dates-mobile"]}
          onClick={() => setShowDatesOnMobile(!showDatesOnMobile)}>
          <img
            src={verticalDotsIcon}
            alt="Dates"
            className={styles["deal-list-view-dates-mobile-icon"]}
          />
          {showDatesOnMobile && (
            <div className={styles["deal-list-view-dates-mobile-list"]}>
              {deal.deal_end_date && <img src={calendarIcon} /> && (
                <p>Expires {deal.deal_end_date}</p>
              )}
              <img src={clockIcon} />
              <p>Posted {`${createdAgoDateTime(deal.created)}`}</p>
            </div>
          )}
        </div>
      </div>
      <h1 className={styles["deal-list-view-title"]} onClick={goToDealView}>
        {deal.title}
      </h1>
      <div className={styles["deal-list-view-prices-container"]}>
        {+deal.price > 0.0 && (
          <p
            className={styles["deal-list-view-price"]}
            data-cy="deal-list-view-price">
            £ {deal.price}
          </p>
        )}
        {+deal.postage_cost > 0.0 && (
          <div className={styles["deal-list-view-price-delivery-container"]}>
            <img
              src={deliveryIcon}
              alt="Delivery van"
              className={styles["deal-list-view-delivery-icon"]}
            />
            <p data-cy="deal-list-view-postage-cost">£ {deal.postage_cost}</p>
          </div>
        )}
      </div>
      <div className={styles["deal-list-view-extras"]}>
        <UserIcon
          username={deal.user.username}
          profilePictureUrl={deal.user.profile_picture}
          dataCy="deal-list-view-user"
        />

        <div className={styles["deal-list-view-comments"]}>
          <img
            src={commentIcon}
            alt="Comments"
            className={styles["deal-list-view-comments-icon"]}
          />
          <p data-cy="deal-list-view-comments-total">{deal.total_comments}</p>
        </div>
        <a
          href={deal.url}
          className={styles["deal-list-view-get-deal"]}
          data-cy="deal-list-view-get-deal">
          <img
            src={urlIcon}
            alt="Go to deal"
            className={styles["deal-list-view-get-deal-icon"]}
          />
          <p>Get deal</p>
        </a>
      </div>
      <a href={deal.url} className={styles["deal-list-view-get-deal-mobile"]}>
        <img
          src={urlIcon}
          alt="Go to deal"
          className={styles["deal-list-view-get-deal-icon"]}
        />
        <p>Get deal</p>
      </a>
    </div>
  );
}

export default DealListView;
