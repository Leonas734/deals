import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import Nav from "./components/nav/Nav";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes></Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
