import { createContext, useReducer, useContext } from "react";
import getAccessTokenData from "../../utils/getAccessTokenData";

const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    case "login": {
      try {
        const accessTokenData = getAccessTokenData(action.payload);
        if (!accessTokenData.username) {
          throw new Error("Invalid JWT provided.");
        }

        window.localStorage.setItem(
          "deals.auth",
          JSON.stringify(action.payload)
        );
        return {
          userId: accessTokenData.id,
          username: accessTokenData.username,
          profilePicture: accessTokenData.profile_picture,
          emailVerified: accessTokenData.email_verified,
          jwtToken: action.payload,
        };
      } catch (err) {
        throw new Error(err.msg);
      }
    }
    case "updateJwtAccessToken": {
      const updatedJwt = {
        ...state.jwtToken,
        access: action.payload.access,
      };
      const newState = { ...state, jwtToken: updatedJwt };
      window.localStorage.setItem(
        "deals.auth",
        JSON.stringify(newState.jwtToken)
      );
      return newState;
    }
    case "logout": {
      window.localStorage.removeItem("deals.auth");
      return null;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AuthProvider({ children }) {
  const localData = JSON.parse(window.localStorage.getItem("deals.auth"));
  const data = {};
  if (localData) {
    const [, payload] = localData.access.split(".");
    const decoded = JSON.parse(window.atob(payload));
    data.username = decoded.username;
    data.userId = decoded.id;
    data.profilePicture = decoded.profile_picture;
    data.emailVerified = decoded.email_verified;
    data.jwtToken = localData;
  }

  // Return null if no user data was fetched from localStorage
  const [state, dispatch] = useReducer(
    authReducer,
    data.username ? data : null
  );
  const userDetails = { state, dispatch };
  return (
    <AuthContext.Provider value={userDetails}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a CountProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
