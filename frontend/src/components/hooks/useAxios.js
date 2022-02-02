import axios from "axios";
import getAccessTokenData from "../../utils/getAccessTokenData";
import { useAuth } from "../context/authContext";

const baseURL = "http://127.0.0.1:8000";
// How many seconds before access token expires should a refresh request be sent
const EXTRA_SECONDS = 30;

const useAxios = () => {
  const { dispatch, state: authState } = useAuth();

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `${
        authState ? `Bearer ${authState.jwtToken.access}` : null
      }`,
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    // Check if access token has expired
    if (authState !== null) {
      const user = getAccessTokenData(authState.jwtToken);
      const currentDateTime = new Date();
      const tokenExp = new Date(user.exp * 1000);
      // Add seconds to current time to make sure new access token is requested early
      currentDateTime.setSeconds(currentDateTime.getSeconds() + EXTRA_SECONDS);
      // Access token expired
      if (currentDateTime > tokenExp) {
        // Get new token
        try {
          const response = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: authState.jwtToken.refresh,
          });

          dispatch({ type: "updateJwtAccessToken", payload: response.data });
          req.headers.Authorization = `Bearer ${response.data.access}`;
        } catch (err) {
          // Logout user as there was an issue fetching a new access token
          dispatch({ type: "logout" });
        }
      }
    }
    return req;
  });
  axiosInstance.interceptors.response.use(
    function (res) {
      return res;
    },
    (error) => {
      // Log user out as their JWT is no longer valid.
      if (error.response.data?.detail === "User not found") {
        dispatch({ type: "logout" });
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
