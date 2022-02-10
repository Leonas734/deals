import { useState } from "react";
import useAxios from "./useAxios";

export const useLikeComment = () => {
  const [likeCommentError, setLikeCommentError] = useState(null);
  const [likeCommentIsPending, setLikeCommentIsPending] = useState(false);
  const [likeCommentResponse, setLikeCommentResponse] = useState(null);
  const api = useAxios();

  const likeComment = async (commentId) => {
    setLikeCommentError(null);
    setLikeCommentIsPending(true);

    try {
      const res = await api.post(`/api/deal_comment/${commentId}/like/`);
      setLikeCommentResponse(res.data);
    } catch (err) {
      setLikeCommentError(err.response.data);
    }
    setLikeCommentIsPending(false);
  };

  return {
    likeComment,
    setLikeCommentResponse,
    likeCommentError,
    likeCommentIsPending,
    likeCommentResponse,
  };
};
