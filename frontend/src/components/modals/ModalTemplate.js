import { React } from "react";
import styles from "./ModalTemplate.module.css";
import xIcon from "../../assets/x-icon.svg";

function ModalTemplate({ changeModalView, children, dataCy }) {
  const backgroundId = "modal-background";
  return (
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
    </>
  );
}

export default ModalTemplate;
