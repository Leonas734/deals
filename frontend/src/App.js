import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Settings from "./components/settings/Settings";
import Nav from "./components/nav/Nav";

import { useAuth } from "./components/context/authContext";

function App() {
  const { state: authState } = useAuth();
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route
            path="account/settings"
            element={!authState ? <Navigate replace to="/" /> : <Settings />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
