import React from "react";
import styles from "./ButtonSecondary.module.css";

const ButtonSecondary = ({ text, action, actionState, dataCy }) => {
  return (
    <>
      <button
        className={styles["button-secondary"]}
        data-cy={dataCy ? dataCy : null}
        onClick={() => {
          action(!actionState);
        }}>
        {text}
      </button>
    </>
  );
};

export default ButtonSecondary;
