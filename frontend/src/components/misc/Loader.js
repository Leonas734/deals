import React from "react";
import styles from "./Loader.module.css";
import ReactDOM from "react-dom";

const Loader = ({ isOpen }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className={styles["loader-background"]} data-cy="loader-background">
      <div className={styles["loader-container"]} data-cy="loader-container">
        <div className={styles["loader"]} data-cy="loader"></div>
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default Loader;
