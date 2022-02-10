import { React } from "react";
import styles from "./ModalTemplate.module.css";
import xIcon from "../../assets/x-icon.svg";
import { createPortal } from "react-dom";
import { useEffect } from "react";

function ModalTemplate({ changeModalView, children, dataCy, isOpen }) {
  useEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        changeModalView();
      }
    });
  });

  if (!isOpen) return null;
  const backgroundId = "modal-background";
  return createPortal(
    <>
      <div
        onClick={(e) => {
          if (e.target.id == backgroundId) {
            changeModalView();
          }
        }}
        id={backgroundId}
        data-cy={dataCy ? `${dataCy}-background` : null}
        className={`${styles["modal-background"]}`}>
        <div
          className={styles["modal-main"]}
          data-cy={dataCy ? `${dataCy}-main` : null}>
          <img
            onClick={() => changeModalView()}
            src={xIcon}
            className={styles["modal-close-icon"]}
            data-cy={dataCy ? `${dataCy}-close-icon` : null}
            alt="X"
          />
          {children}
        </div>
      </div>
    </>,
    document.body
  );
}

export default ModalTemplate;
