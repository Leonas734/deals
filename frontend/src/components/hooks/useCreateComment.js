import { useState } from "react";
import useAxios from "./useAxios";

export const useCreateComment = () => {
  const [createCommentError, setCreateCommentError] = useState(null);
  const [createCommentIsPending, setCreateCommentIsPending] = useState(false);
  const [createCommentResponse, setCreateCommentResponse] = useState(null);
  const api = useAxios();

  const createComment = async (dealId, text, quotedComment) => {
    setCreateCommentError(null);
    setCreateCommentIsPending(true);
    try {
      const res = await api.post(`/api/deal_comment/`, {
        deal: dealId,
        text,
        quoted_comment: quotedComment ? quotedComment.id : null,
      });
      setCreateCommentResponse(res.data);
    } catch (err) {
      setCreateCommentError(err.response.data);
    }
    setCreateCommentIsPending(false);
  };

  return {
    createComment,
    createCommentError,
    createCommentIsPending,
    createCommentResponse,
    setCreateCommentResponse,
  };
};
