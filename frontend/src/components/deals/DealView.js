import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDealComments } from "../hooks/useDealComments";
import { useDeal } from "../hooks/useDeal";
import { useAuth } from "../context/authContext";

import createdAgoDateTime from "../../utils/createdAgoDateTime";

import styles from "./DealView.module.css";
import commentIcon from "../../assets/annotation-icon.svg";
import deliveryIcon from "../../assets/delivery-icon.svg";
import urlIcon from "../../assets/link-icon.svg";
import DealRating from "../rating/DealRating";
import UserIcon from "../misc/UserIcon";
import clockIcon from "../../assets/clock-icon.svg";
import calendarIcon from "../../assets/calendar-icon.svg";

function DealView() {
  const params = useParams();
  const { state: userAuthState } = useAuth();
  const { getDeal, setDeal, dealError, dealIsPending, deal } = useDeal();
  const {
    getDealComments,
    setDealComments,
    dealCommentsError,
    dealCommentsIsPending,
    dealComments,
  } = useDealComments();
  useEffect(() => {
    getDeal(params.dealId);
    getDealComments(params.dealId);
  }, [userAuthState]);

  if (deal) {
    return (
      <div className={styles["deal-view-main"]}>
        <img
          src={deal.image}
          alt="Deal"
          className={styles["deal-view-image"]}
          data-cy="deal-view-image"
        />
        <div className={styles["deal-view-details"]}>
          <DealRating
            deal={deal}
            userAuthState={userAuthState}
            setDeal={setDeal}
            extraClassName={styles["deal-view-rating"]}
            dataCy="deal-view-rating"
          />
          <div className={styles["deal-view-view-comments"]}>
            <img
              src={commentIcon}
              alt="Comments"
              className={styles["deal-view-view-comments-icon"]}
            />
            <p
              className={styles["deal-view-view-comments-total"]}
              data-cy="deal-view-comments-total">
              {deal.total_comments}
            </p>
          </div>
          <h1 className={styles["deal-view-title"]}>{deal.title}</h1>
          <div className={styles["deal-view-prices"]}>
            {deal.price && (
              <p
                className={styles["deal-view-deal-price"]}
                data-cy="deal-view-deal-price">
                £ {deal.price}
              </p>
            )}
            {+deal.postage_cost > 0 && (
              <div
                className={styles["deal-view-postage"]}
                data-cy="deal-view-postage-cost">
                <img
                  src={deliveryIcon}
                  alt="Delivery truck"
                  className={styles["deal-view-postage-icon"]}
                />
                <p className={styles["deal-view-postage-price"]}>
                  £ {deal.postage_cost}
                </p>
              </div>
            )}
          </div>
          <a
            href={deal.url}
            className={styles["deal-view-get-deal"]}
            data-cy="deal-view-get-deal">
            <p>Get deal!</p>
            <img
              src={urlIcon}
              alt="Url"
              className={styles["deal-view-get-deal-icon"]}
            />
          </a>
          <UserIcon
            extraClassName={styles["deal-view-user"]}
            username={deal.user.username}
            profilePictureUrl={deal.user.profile_picture}
            dataCy="deal-view-user"
          />
        </div>
        <div className={styles["deal-view-extras"]}>
          <div className={styles["deal-view-posted"]}>
            <img src={calendarIcon} alt="Calendar" />
            <p data-cy="deal-view-posted-date">
              Posted {`${createdAgoDateTime(deal.created)}`}
            </p>
          </div>
          {deal.deal_end_date && (
            <div className={styles["deal-view-expiration"]}>
              <img src={clockIcon} alt="Clock" />
              <p data-cy="deal-view-expiration-date">
                Expires{" "}
                {`${new Date(deal.deal_end_date).toLocaleDateString("en-US")}`}
              </p>
            </div>
          )}
        </div>
        <p
          className={styles["deal-view-description"]}
          data-cy="deal-view-description">
          {deal.description}
        </p>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default DealView;
