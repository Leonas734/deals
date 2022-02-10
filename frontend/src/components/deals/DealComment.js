import { useEffect, useState } from "react";
import styles from "./DealComment.module.css";
import createdAgoDateAndTime from "../../utils/createdAgoDateTime";
import thumbsUpIcon from "../../assets/thumbs-up-icon.svg";
import quoteIcon from "../../assets/quote-icon.svg";
import { useLikeComment } from "../hooks/useLikeComment";

function DealComment({
  comment,
  updateComment,
  quoteComment,
  userHasAccessToAllFeatures,
}) {
  const {
    likeComment,
    likeCommentError,
    likeCommentIsPending,
    likeCommentResponse,
  } = useLikeComment();

  useEffect(() => {
    if (likeCommentResponse) {
      updateComment(likeCommentResponse);
    }
  }, [likeCommentResponse]);

  function sendCommentLike() {
    if (!userHasAccessToAllFeatures()) return;
    likeComment(comment.id);
  }

  return (
    <div className={styles["deal-view-comment"]}>
      {comment.quoted_comment_data && (
        <div className={styles["deal-view-comment-quoted-comment"]}>
          <p
            className={styles["deal-view-comment-quoted-comment-user"]}
            data-cy="deal-view-comment-quoted-comment-user">
            {comment.quoted_comment_data.user}
          </p>
          <p data-cy="deal-view-comment-quoted-comment-text">
            {comment.quoted_comment_data.text}
          </p>
        </div>
      )}
      <img
        className={styles["deal-view-comment-user-profile-picture"]}
        src={
          new URL(comment.user.profile_picture, process.env.REACT_APP_BASE_URL)
            .href
        }
        data-cy="deal-view-comment-user-profile-picture"
      />
      <p
        className={styles["deal-view-comment-user-username"]}
        data-cy="deal-view-comment-user-username">
        {comment.user.username}
      </p>
      <p
        className={styles["deal-view-comment-date"]}
        data-cy="deal-view-comment-date">
        {createdAgoDateAndTime(comment.created)}
      </p>
      <p
        className={styles["deal-view-comment-text"]}
        data-cy="deal-view-comment-text">
        {comment.text}
      </p>
      <div className={styles["deal-view-comment-extras"]}>
        <div
          className={styles["deal-view-comment-like"]}
          onClick={sendCommentLike}>
          <img
            src={thumbsUpIcon}
            className={`${styles["deal-view-comment-extras-icon"]} ${
              comment.liked_by_user
                ? styles["deal-view-comment-like-active"]
                : null
            }`}
            alt="Thumbs up"
            data-cy="deal-view-comment-like"
          />
          <p>Like</p>
        </div>
        <div
          className={styles["deal-view-comment-quote"]}
          onClick={() => quoteComment(comment)}
          data-cy="deal-view-comment-quote">
          <img
            src={quoteIcon}
            className={styles["deal-view-comment-extras-icon"]}
            alt="Quote comment"
          />
          <p>Quote</p>
        </div>
        <div className={styles["deal-view-comment-total-likes"]}>
          <img
            src={thumbsUpIcon}
            className={styles["deal-view-comment-extras-icon"]}
            alt="Total likes"
          />
          <p data-cy="deal-view-comment-total-likes">{comment.total_likes}</p>
        </div>
      </div>
    </div>
  );
}

export default DealComment;
