import { useState } from "react";
import useAxios from "./useAxios";

export const useGetUser = () => {
  const [getUserError, setGetUserError] = useState(null);
  const [getUserIsPending, setGetUserIsPending] = useState(false);
  const [getUserResponse, setGetUserResponse] = useState(null);
  const api = useAxios();

  const getUser = async (userName) => {
    setGetUserError(null);
    setGetUserIsPending(true);
    try {
      const res = await api.get(`/api/user/${userName}`);
      setGetUserResponse(res.data);
    } catch (err) {
      setGetUserError(err.response.data);
    }
    setGetUserIsPending(false);
  };

  return { getUser, getUserError, getUserIsPending, getUserResponse };
};
