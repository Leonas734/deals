import React, { useState } from "react";
import styles from "./AccountSettings.module.css";
import { useAuth } from "../context/authContext";
import arrowDownIcon from "../../assets/arrow-down-icon.svg";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { useUpdateUserEmail } from "../hooks/useUpdateUserEmail";
import { useUpdateUserPassword } from "../hooks/useUpdateUserPassword";
import { useUpdateUserProfilePicture } from "../hooks/useUpdateUserProfilePicture";
import { useResendEmailVerification } from "../hooks/useResendEmailVerification";

export default function AccountSettings() {
  const { state: userAuthState } = useAuth();
  const {
    resendEmailVerification,
    resendEmailVerificationResponse,
    resendEmailVerificationIsPending,
    resendEmailVerificationError,
  } = useResendEmailVerification();

  const {
    updateUserPassword,
    updateUserPasswordResponse,
    updateUserPasswordIsPending,
    updateUserPasswordError,
  } = useUpdateUserPassword();
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [updatePasswordCurPass, setUpdatePasswordCurPas] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassRepeat, setNewPassRepeat] = useState("");

  const {
    updateUserEmail,
    updateUserEmailResponse,
    updateUserEmailIsPending,
    updateUserEmailError,
  } = useUpdateUserEmail();
  const [showUpdateEmail, setShowUpdateEmail] = useState(false);
  const [updateEmailCurPas, setUpdateEmailCurPas] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const {
    updateUserProfilePicture,
    updateUserProfilePictureResponse,
    updateUserProfilePictureIsPending,
    updateUserProfilePictureError,
  } = useUpdateUserProfilePicture();
  const [showUpdateProfilePicture, setShowUpdateProfilePicture] =
    useState(false);
  const [updateProfilePicCurPas, setUpdateProfilePicCurPas] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);

  function handleEmailUpdate() {
    updateUserEmail(updateEmailCurPas, newEmail);
  }

  function handlePasswordUpdate() {
    updateUserPassword(updatePasswordCurPass, newPass, newPassRepeat);
  }

  function handleUpdateProfilePicture() {
    updateUserProfilePicture(updateProfilePicCurPas, newProfilePic);
  }

  return (
    <div className={styles["account-settings-main"]}>
      {!userAuthState.emailVerified && (
        <div data-cy="account-settings-main-verify-email-message">
          {!resendEmailVerificationResponse && (
            <>
              <p
                className={
                  styles["account-settings-main-verify-email-message"]
                }>
                Email verification required
              </p>

              <p
                onClick={() => resendEmailVerification()}
                className={styles["account-settings-main-verify-email-link"]}>
                Click here if you want us to send you another verification email
              </p>
            </>
          )}
          {resendEmailVerificationResponse && (
            <p
              className={
                styles["account-settings-main-verify-email-message-success"]
              }>
              New email verification sent. Please check your inbox
            </p>
          )}
        </div>
      )}
      <div className={styles["account-settings-main-option"]}>
        <img
          src={arrowDownIcon}
          alt="Arrow down"
          onClick={() => setShowUpdateEmail(!showUpdateEmail)}
        />
        <p
          data-cy="account-settings-update-email"
          onClick={() => setShowUpdateEmail(!showUpdateEmail)}>
          Update email
        </p>
      </div>
      {showUpdateEmail && (
        <label>
          <span>Current password</span>
          <input
            data-cy="account-settings-update-email-cur-pass"
            type="password"
            value={updateEmailCurPas}
            onChange={(e) => setUpdateEmailCurPas(e.target.value)}></input>
          {updateUserEmailError && updateUserEmailError.password && (
            <p className={styles["account-settings-error"]}>
              {updateUserEmailError.password}
            </p>
          )}
          <span>New email address</span>
          <input
            data-cy="account-settings-update-email-new-email"
            type="text"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
            }}></input>
          {updateUserEmailError && updateUserEmailError.email && (
            <p className={styles["account-settings-error"]}>
              {updateUserEmailError.email}
            </p>
          )}
          <ButtonPrimary
            action={handleEmailUpdate}
            text="Update email"
            dataCy="account-settings-update-user-email-btn"
          />
        </label>
      )}
      {updateUserEmailError &&
        !updateUserEmailError.email &&
        !updateUserEmailError.password && (
          <p className={styles["account-settings-error"]}>
            {updateUserEmailError[Object.keys(updateUserEmailError)[0]]}
          </p>
        )}
      {updateUserEmailResponse && (
        <p
          className={styles["account-settings-response"]}
          data-cy="account-settings-update-email-response">
          {updateUserEmailResponse.detail}
        </p>
      )}
      <div className={styles["account-settings-main-option"]}>
        <img
          src={arrowDownIcon}
          alt="Arrow down"
          onClick={() => setShowUpdatePassword(!showUpdatePassword)}
        />
        <p
          data-cy="account-settings-update-password"
          onClick={() => setShowUpdatePassword(!showUpdatePassword)}>
          Update password
        </p>
      </div>
      {showUpdatePassword && (
        <label>
          <span>Current password</span>
          <input
            data-cy="account-settings-update-password-cur-pass"
            type="password"
            value={updatePasswordCurPass}
            onChange={(e) => setUpdatePasswordCurPas(e.target.value)}></input>
          {updateUserPasswordError && updateUserPasswordError.password && (
            <p className={styles["account-settings-error"]}>
              {updateUserPasswordError.password}
            </p>
          )}
          <span>New password</span>
          <input
            data-cy="account-settings-update-password-new-password"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}></input>
          {updateUserPasswordError && updateUserPasswordError.new_password && (
            <p className={styles["account-settings-error"]}>
              {updateUserPasswordError.new_password}
            </p>
          )}
          <span>New password repeat</span>
          <input
            data-cy="account-settings-update-password-new-password-repeat"
            type="password"
            value={newPassRepeat}
            onChange={(e) => setNewPassRepeat(e.target.value)}></input>
          {updateUserPasswordError &&
            updateUserPasswordError.new_password_repeat && (
              <p className={styles["account-settings-error"]}>
                {updateUserPasswordError.new_password_repeat}
              </p>
            )}
          <ButtonPrimary
            action={handlePasswordUpdate}
            text="Update password"
            dataCy="account-settings-update-user-password-btn"
          />
        </label>
      )}
      {updateUserPasswordResponse && (
        <p className={styles["account-settings-response"]}>
          {updateUserPasswordResponse.detail}
        </p>
      )}
      {updateUserPasswordError &&
        !updateUserPasswordError.password &&
        !updateUserPasswordError.new_password &&
        !updateUserPasswordError.new_password_repeat && (
          <p className={styles["account-settings-error"]}>
            {updateUserPasswordError[Object.keys(updateUserPasswordError)[0]]}
          </p>
        )}
      <div className={styles["account-settings-main-option"]}>
        <img
          src={arrowDownIcon}
          alt="Arrow down"
          onClick={() => setShowUpdateProfilePicture(!showUpdateProfilePicture)}
        />
        <p
          data-cy="account-settings-update-profile-picture"
          onClick={() =>
            setShowUpdateProfilePicture(!showUpdateProfilePicture)
          }>
          Update profile picture
        </p>
      </div>
      {showUpdateProfilePicture && (
        <label>
          <span>Current password</span>
          <input
            data-cy="account-settings-update-profile-picture-cur-pass"
            type="password"
            value={updateProfilePicCurPas}
            onChange={(e) => setUpdateProfilePicCurPas(e.target.value)}></input>
          {updateUserProfilePictureError &&
            updateUserProfilePictureError.password && (
              <p className={styles["account-settings-error"]}>
                {updateUserProfilePictureError.password}
              </p>
            )}
          <span>New profile picture</span>
          <label
            className={
              styles["account-settings-update-profile-picture-new-pic-label"]
            }
            htmlFor="new-profile-picture">
            Upload profile picture
          </label>
          <input
            id="new-profile-picture"
            className={
              styles["account-settings-update-profile-picture-new-pic-input"]
            }
            data-cy="account-settings-update-profile-picture-new-pic"
            type="file"
            onChange={(e) => setNewProfilePic(e.target.files[0])}></input>
          {updateUserProfilePictureError &&
            updateUserProfilePictureError.profile_picture && (
              <p className={styles["account-settings-error"]}>
                {updateUserProfilePictureError.profile_picture}
              </p>
            )}
          <ButtonPrimary
            action={handleUpdateProfilePicture}
            text="Update profile picture"
            dataCy="account-settings-update-user-profile-pic-btn"
          />
        </label>
      )}
      {updateUserProfilePictureError &&
        !updateUserProfilePictureError.password &&
        !updateUserProfilePictureError.profile_picture && (
          <p className={styles["account-settings-error"]}>
            {
              updateUserProfilePictureError[
                Object.keys(updateUserProfilePictureError)[0]
              ]
            }
          </p>
        )}
      {updateUserProfilePictureResponse && (
        <p
          className={styles["account-settings-response"]}
          data-cy="account-settings-update-password-response">
          {updateUserProfilePictureResponse.detail}
        </p>
      )}
    </div>
  );
}
