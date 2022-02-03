import React from "react";
import { AuthProvider } from "./components/context/authContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import Nav from "./components/nav/Nav";
import Main from "./components/main/Main";

function App() {
  return (
    <AuthProvider>
      <div className={styles["website"]}>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/" element={<Main />}></Route>
          </Routes>
        </BrowserRouter>

        <div className={styles["footer"]} id="footer"></div>
      </div>
    </AuthProvider>
  );
}

export default App;
