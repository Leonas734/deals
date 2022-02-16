import React from "react";
import { useAuth } from "./components/context/authContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import styles from "./App.module.css";
import Nav from "./components/nav/Nav";
import AllDeals from "./components/deals/AllDeals";
import EmailVerification from "./components/emails/EmailVerification";
import DealView from "./components/deals/DealView";
import NewDeal from "./components/deals/NewDeal";
import AccountSettings from "./components/settings/AccountSettings";
import UserView from "./components/user/UserView";

function App() {
  const { state: userAuthState } = useAuth();
  return (
    <div className={styles["website"]}>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<AllDeals />}></Route>
          <Route path="deal/:dealId" element={<DealView />}></Route>
          <Route
            path="email_verification/:userId/:emailToken"
            element={<EmailVerification />}></Route>
          <Route
            path="account_settings/"
            element={
              userAuthState ? <AccountSettings /> : <Navigate to="/" />
            }></Route>
          <Route path="user/:userName/" element={<UserView />}></Route>
          <Route
            path={"new_deal/"}
            element={
              userAuthState && userAuthState.emailVerified ? (
                <NewDeal />
              ) : (
                <Navigate to="/" />
              )
            }></Route>
        </Routes>
      </BrowserRouter>

      <div className={styles["footer"]} id="footer">
        <div className={styles["footer-links"]}>
          <a href="https://github.com/Leonas734/deals">Project repository</a>
          <a href="https://ladomaitis.com">My website</a>
        </div>
        <p className={styles["footer-disclaimer"]}>
          This website was built for educational purposes. I do not own any of
          the images shown on this website. All rights and credit go directly to
          its rightful owners. No copyright infringement intended.
        </p>
      </div>
    </div>
  );
}

export default App;
