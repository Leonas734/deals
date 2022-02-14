import { useState } from "react";
import useAxios from "./useAxios";
import { useAuth } from "../context/authContext";

export const useUpdateUserProfilePicture = () => {
  const [updateUserProfilePictureError, setUpdateUserProfilePictureError] =
    useState(null);
  const [
    updateUserProfilePictureIsPending,
    setUpdateUserProfilePictureIsPending,
  ] = useState(false);
  const [
    updateUserProfilePictureResponse,
    setUpdateUserProfilePictureResponse,
  ] = useState(null);
  const api = useAxios();
  const { state, dispatch: userAuthDispatch } = useAuth();

  const updateUserProfilePicture = async (curPassword, newProfilePic) => {
    const form = new FormData();
    form.append("password", curPassword);
    form.append("profile_picture", newProfilePic);
    setUpdateUserProfilePictureError(null);
    setUpdateUserProfilePictureIsPending(true);
    setUpdateUserProfilePictureResponse(null);
    try {
      const res = await api.post("/api/user/update_profile_picture/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      userAuthDispatch({ type: "login", payload: res.data.token });
      setUpdateUserProfilePictureResponse({ detail: res.data.detail });
    } catch (err) {
      setUpdateUserProfilePictureError(err.response.data);
    }
    setUpdateUserProfilePictureIsPending(false);
  };

  return {
    updateUserProfilePicture,
    updateUserProfilePictureResponse,
    updateUserProfilePictureIsPending,
    updateUserProfilePictureError,
  };
};
