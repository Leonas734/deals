import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Settings from "./components/settings/Settings";
import Nav from "./components/nav/Nav";
import AllDeals from "./components/deals/AllDeals";
import EmailVerifcation from "./components/emails/EmailVerification";
import DealView from "./components/deals/DealView";
import { useAuth } from "./components/context/authContext";

function App() {
  const { state: authState } = useAuth();
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<AllDeals />} />
          <Route
            path="/email_verification/:userId/:emailToken"
            element={<EmailVerifcation />}
          />
          <Route
            path="account/settings"
            element={!authState ? <Navigate replace to="/" /> : <Settings />}
          />
          <Route path="deal/:dealId" element={<DealView />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
