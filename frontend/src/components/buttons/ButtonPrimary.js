import React from "react";
import styles from "./ButtonPrimary.module.css";

const ButtonPrimary = ({ text, action, actionState, dataCy }) => {
  return (
    <>
      <button
        className={styles["button-primary"]}
        data-cy={dataCy ? dataCy : null}
        onClick={() => {
          if (action == null && actionState == null) {
          } else {
            actionState != null ? action(!actionState) : action();
          }
        }}>
        {text}
      </button>
    </>
  );
};

export default ButtonPrimary;
