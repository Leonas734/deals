import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDealComments } from "../hooks/useDealComments";
import { useDeal } from "../hooks/useDeal";
import { useAuth } from "../context/authContext";
import { useCreateComment } from "../hooks/useCreateComment";

import createdAgoDateTime from "../../utils/createdAgoDateTime";

import styles from "./DealView.module.css";
import commentIcon from "../../assets/annotation-icon.svg";
import deliveryIcon from "../../assets/delivery-icon.svg";
import urlIcon from "../../assets/link-icon.svg";
import clockIcon from "../../assets/clock-icon.svg";
import calendarIcon from "../../assets/calendar-icon.svg";
import closeIcon from "../../assets/x-icon.svg";

import DealComment from "./DealComment";
import ButtonPrimary from "../buttons/ButtonPrimary";
import DealRating from "../rating/DealRating";
import UserIcon from "../misc/UserIcon";
import LoginModal from "../modals/LoginModal";
import VerifyEmailModal from "../modals/VerifyEmailModal";

function DealView() {
  const { state: locationState } = useLocation();
  const params = useParams();
  const commentsDiv = useRef(null);
  const newCommentDiv = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [quotedComment, setQuotedComment] = useState(null);
  const [newComment, setNewComment] = useState("");
  const { state: userAuthState } = useAuth();
  const { getDeal, setDeal, dealError, dealIsPending, deal } = useDeal();
  const {
    getDealComments,
    setDealComments,
    dealCommentsError,
    dealCommentsIsPending,
    dealComments,
  } = useDealComments();

  const {
    createComment,
    createCommentError,
    createCommentIsPending,
    createCommentResponse,
    setCreateCommentResponse,
  } = useCreateComment();

  useEffect(() => {
    getDeal(params.dealId);
    getDealComments(params.dealId);

    // On successfull comment submission clear fields
    if (createCommentResponse && !createCommentError) {
      setNewComment("");
      setQuotedComment(null);
    }
  }, [userAuthState, createCommentError, createCommentResponse]);

  // Used when comment is liked
  function updateComment(newComment) {
    setDealComments((prevState) => {
      const newState = prevState.map((prevStateComment) => {
        if (prevStateComment.id === newComment.id) {
          return {
            ...prevStateComment,
            liked_by_user: newComment.liked_by_user,
            total_likes: newComment.total_likes,
            quoted_comment_data: newComment.quoted_comment_data,
          };
        }
        return prevStateComment;
      });
      return newState;
    });
  }
  function userHasAccessToAllFeatures() {
    if (!userAuthState) {
      setShowLoginModal(true);
      return false;
    }
    if (!userAuthState.emailVerified) {
      setShowVerifyEmailModal(true);
      return false;
    }
    return true;
  }
  function scrollToComments() {
    commentsDiv.current.scrollIntoView({ behavior: "smooth" });
  }

  function scrollToPostNewComment() {
    newCommentDiv.current.scrollIntoView({ behavior: "smooth" });
  }

  function showCommentsOnceLoaded() {
    scrollToComments();
    // Set locationState back to null after deal comments are in view
    locationState.scrollToCommentsOnLoad = null;
    // Resetting states if user refreshes page.
    window.history.replaceState({}, document.title);
  }

  function quoteComment(comment) {
    setQuotedComment(comment);
    scrollToPostNewComment();
  }

  function postNewComment() {
    if (!userHasAccessToAllFeatures()) return;
    createComment(deal.id, newComment, quotedComment);
  }

  return (
    <>
      {(!deal || !dealComments) && (dealIsPending || dealCommentsIsPending) && (
        <div className={styles["deal-view-loading"]}>
          <p>Loading...</p>
        </div>
      )}
      {deal && dealComments && !dealIsPending && !dealCommentsIsPending && (
        <div className={styles["deal-view-main"]}>
          <VerifyEmailModal
            setModalIsOpen={setShowVerifyEmailModal}
            modalIsOpen={showVerifyEmailModal}
          />
          <LoginModal
            setModalIsOpen={setShowLoginModal}
            modalIsOpen={showLoginModal}
          />

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
            <div
              className={styles["deal-view-view-comments"]}
              onClick={scrollToComments}>
              <img
                src={commentIcon}
                alt="Comments"
                className={styles["deal-view-view-comments-icon"]}
              />
              <p
                className={styles["deal-view-view-comments-total"]}
                data-cy="deal-view-comments-total">
                {dealComments.length}
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
                  {`${new Date(deal.deal_end_date).toLocaleDateString(
                    "en-US"
                  )}`}
                </p>
              </div>
            )}
          </div>
          <p
            className={styles["deal-view-description"]}
            data-cy="deal-view-description">
            {deal.description}
          </p>
          <p
            className={styles["deal-view-comments-header"]}
            ref={(el) => {
              commentsDiv.current = el;
              if (
                locationState?.userRequestedDealCommentsOnLoad &&
                commentsDiv.current
              ) {
                showCommentsOnceLoaded();
              }
            }}>
            {dealComments.length} Comment
            {dealComments.length > 1 || dealComments.length === 0 ? "s" : ""}
          </p>

          <div className={styles["deal-view-comments"]}>
            {dealComments.length === 0 && (
              <p className={styles["deal-view-no-comments"]}>
                There are currently no comments for this deal.
              </p>
            )}
            {dealComments &&
              dealComments.map((comment) => {
                return (
                  <DealComment
                    key={comment.id}
                    comment={comment}
                    updateComment={updateComment}
                    userAuthState={userAuthState}
                    quoteComment={quoteComment}
                    userHasAccessToAllFeatures={userHasAccessToAllFeatures}
                  />
                );
              })}
          </div>
          <div className={styles["deal-view-new-comment"]} ref={newCommentDiv}>
            <p>Post a comment</p>
            {quotedComment && (
              <div className={styles["deal-view-new-comment-quoted-comment"]}>
                <img
                  src={closeIcon}
                  alt="Close"
                  className={
                    styles["deal-view-new-comment-quoted-comment-close-icon"]
                  }
                  onClick={() => {
                    setQuotedComment(null);
                  }}
                />
                <p
                  className={
                    styles["deal-view-new-comment-quoted-comment-user"]
                  }>
                  {quotedComment.user.username}
                </p>
                <p
                  className={
                    styles["deal-view-new-comment-quoted-comment-text"]
                  }>
                  {quotedComment.text}
                </p>
              </div>
            )}
            <img
              src={
                new URL(
                  deal.user.profile_picture,
                  process.env.REACT_APP_BASE_URL
                ).href
              }
            />
            <textarea
              rows="4"
              cols="100"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              data-cy="deal-view-new-comment-textarea"
            />
            <ButtonPrimary
              text={"Submit"}
              action={postNewComment}
              dataCy={"deal-view-new-comment-submit-button"}
            />
            {createCommentError && (
              <p className={styles["deal-view-new-comment-error"]}>
                {createCommentError.text}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default DealView;
