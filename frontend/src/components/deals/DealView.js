import React from "react";
import { useParams } from "react-router-dom";
import { useDeal } from "../hooks/useDeal";
import { useDealComments } from "../hooks/useDealComments";
import { useEffect } from "react";
import Loader from "../misc/Loader";
import createdAgoDateTime from "../../utils/createdAgoDateTime";
import openInNewTab from "../../utils/openInNewTab";

import styles from "./DealView.module.css";
import UserIcon from "../misc/UserIcon";
import arrowUpIcon from "../../assets/arrow-up-icon.svg";
import arrowDownIcon from "../../assets/arrow-down-icon.svg";
import commentIcon from "../../assets/annotation-icon.svg";
import urlIcon from "../../assets/link-icon.svg";
import deliveryIcon from "../../assets/delivery-icon.svg";
import poundIcon from "../../assets/pound-icon.svg";
import calendarIcon from "../../assets/calendar-icon.svg";

function DealView() {
  const params = useParams();
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
  }, []);

  if (deal && dealComments) {
    return (
      <div className={styles["deal-view-main"]}>
        <div className={styles["deal-view-deal"]}>
          <img
            src={new URL(deal.image, process.env.REACT_APP_BASE_URL).href}
            className={styles["deal-view-deal-image"]}
            alt="Deal"
          />
          <div className={styles["deal-view-deal-details"]}>
            <h1>{deal.title}</h1>
            <p className={styles["deal-view-deal-details-posted"]}>
              Posted {createdAgoDateTime(deal.created)}
            </p>
            <UserIcon
              extraClassName={styles["deal-view-user-icon"]}
              username={deal.user.username}
              profilePictureUrl={deal.user.profile_picture}
            />
            <div className={styles["deal-view-deal-price"]}>
              <img src={poundIcon} alt="Pound" />
              <p>{deal.price}</p>
            </div>
            <div className={styles["deal-view-deal-postage"]}>
              <img src={deliveryIcon} alt="Delivery truck" />
              <p>{deal.postage_cost}</p>
            </div>
            {deal.deal_end_date && (
              <div className={styles["deal-view-deal-postage"]}>
                <img src={calendarIcon} alt="Calendar" />
                <p>{`${new Date(deal.deal_end_date).toLocaleDateString(
                  "en-US"
                )}`}</p>
              </div>
            )}
            <div
              className={styles["deal-view-get-deal-button"]}
              onClick={() => {
                openInNewTab(deal.url);
              }}>
              <p>Get the deal</p>
              <img src={urlIcon} alt="Get deal" />
            </div>

            <div className={styles["deal-view-deal-extras"]}>
              <div className={styles["deal-view-deal-rating"]}>
                <img src={arrowUpIcon} alt="Vote up" />
                <p>{deal.rating}</p>
                <img src={arrowDownIcon} alt="Vote down" />
              </div>
              <div className={styles["deal-view-all-comments-icon"]}>
                <p>{dealComments.length}</p>
                <img src={commentIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <Loader isOpen={true} />;
  }
}

export default DealView;
