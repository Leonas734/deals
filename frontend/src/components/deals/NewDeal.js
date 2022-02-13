import React, { useEffect } from "react";
import styles from "./NewDeal.module.css";
import { useState } from "react";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { useCreateNewDeal } from "../hooks/useCreateNewDeal";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "GROCERIES",
  "ELECTRONICS",
  "SPORT & LEISURE",
  "FINANCE & INSURANCE",
  "HOME & GARDEN",
];

function NewDeal() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const [dealExpiration, setDealExpiration] = useState("");
  const [dealLink, setDealLink] = useState("");
  const [dealImage, setDealImage] = useState("");
  const {
    createNewDeal,
    createDealError,
    createDealIsPending,
    createDealResponse,
  } = useCreateNewDeal();

  useEffect(() => {
    if (createDealResponse && createDealResponse.id) {
      navigate(`/deal/${createDealResponse.id}`);
    }
  }, [createDealResponse]);

  function handleCreateNewDeal() {
    createNewDeal({
      title,
      description,
      category,
      price,
      deliveryPrice,
      expiration: dealExpiration,
      url: dealLink,
      image: dealImage,
    });
  }

  return (
    <div className={styles["new-deal-main"]}>
      <h1>New deal</h1>
      <form className={styles["new-deal-form"]}>
        <label>
          <span>Title</span>
          <textarea
            rows="2"
            cols="100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            data-cy="new-deal-title"></textarea>
          {createDealError && createDealError.title && (
            <p
              className={styles["new-deal-error"]}
              data-cy="new-deal-title-error">
              {createDealError.title}
            </p>
          )}
        </label>
        <label>
          <span>Description</span>
          <textarea
            rows="4"
            cols="100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            data-cy="new-deal-description"></textarea>
          {createDealError && createDealError.description && (
            <p
              className={styles["new-deal-error"]}
              data-cy="new-deal-description-error">
              {createDealError.description}
            </p>
          )}
        </label>
        <label>
          <span>Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            data-cy="new-deal-category">
            {CATEGORIES.map((category) => {
              return <option key={category}>{category}</option>;
            })}
          </select>
          {createDealError && createDealError.category && (
            <p className={styles["new-deal-error"]}>
              {createDealError.category}
            </p>
          )}
        </label>
        <label>
          <span>Price</span>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            data-cy="new-deal-price"></input>
          {createDealError && createDealError.price && (
            <p
              className={styles["new-deal-error"]}
              data-cy="new-deal-price-error">
              {createDealError.price}
            </p>
          )}
        </label>
        <label>
          <span>Delivery price</span>
          <input
            value={deliveryPrice}
            onChange={(e) => setDeliveryPrice(e.target.value)}
            data-cy="new-deal-delivery-price"></input>
          {createDealError && createDealError.postage_cost && (
            <p
              className={styles["new-deal-error"]}
              data-cy="new-deal-delivery-price-error">
              {createDealError.postage_cost}
            </p>
          )}
        </label>
        <label>
          <span>Deal expiration date</span>
          <input
            type="date"
            value={dealExpiration}
            onChange={(e) => setDealExpiration(e.target.value)}
            data-cy="new-deal-expiration-date"></input>
          {createDealError && createDealError.deal_end_date && (
            <p
              className={styles["new-deal-error"]}
              data-cy="new-deal-expiration-date-error">
              Invalid date. Please try again.
            </p>
          )}
        </label>
        <label>
          <span>Deal link</span>
          <input
            value={dealLink}
            onChange={(e) => setDealLink(e.target.value)}
            data-cy="new-deal-link"></input>
          {createDealError && createDealError.url && (
            <p
              className={styles["new-deal-error"]}
              data-cy="new-deal-link-error">
              {createDealError.url}
            </p>
          )}
        </label>
        <label>
          <span>Deal image</span>
          <input
            className={styles["new-deal-file-input"]}
            type="file"
            onChange={(e) => setDealImage(e.target.files[0])}
            data-cy="new-deal-image"></input>
          {createDealError && createDealError.image && (
            <p
              className={styles["new-deal-error"]}
              data-cy="new-deal-image-error">
              {createDealError.image}
            </p>
          )}
        </label>
      </form>
      <ButtonPrimary
        text="Submit"
        action={handleCreateNewDeal}
        dataCy="new-deal-submit-button"
      />
    </div>
  );
}

export default NewDeal;
