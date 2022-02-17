import React from "react";
import { useAllDeals } from "../hooks/useAllDeals";
import { useEffect, useState } from "react";
import filterIcon from "../../assets/filter-icon.svg";
import styles from "./AllDeals.module.css";
import { useAuth } from "../context/authContext";
import ButtonPrimary from "../buttons/ButtonPrimary";

import DealListView from "./DealListView";

function AllDeals() {
  const NO_CHOICE = "-------";
  const CATEGORIES = [
    NO_CHOICE,
    "GROCERIES",
    "ELECTRONICS",
    "SPORT & LEISURE",
    "FINANCE & INSURANCE",
    "HOME & GARDEN",
  ];

  const SORT_BY = [
    NO_CHOICE,
    "RATING - ASCENDING",
    "RATING - DESCENDING",
    "UPLOADED - ASCENDING",
    "UPLOADED - DESCENDING",
  ];
  const [showToolBarMenu, setShowToolBarMenu] = useState(false);
  const [category, setCategory] = useState(NO_CHOICE);
  const [sortBy, setSortBy] = useState(NO_CHOICE);

  const {
    getAllDeals,
    setAllDeals,
    allDeals,
    allDealsIsPending,
    allDealsError,
  } = useAllDeals();
  const userAuth = useAuth();

  useEffect(() => {
    getAllDeals();
  }, [userAuth.state]);

  function sortAndFilterDeals() {
    getAllDeals({
      category: category != NO_CHOICE ? category : null,
      sortBy: sortBy != NO_CHOICE ? sortBy : null,
    });
    setShowToolBarMenu(false);
  }

  if (allDealsIsPending)
    return <div className={styles["all-deals-loading"]}></div>;
  return (
    <>
      <div
        className={`${styles["all-deals-toolbar"]} ${
          showToolBarMenu ? `${styles["all-deals-open-toolbar"]}` : null
        }`}>
        <img
          data-cy="all-deals-toolbar-icon"
          className={styles["all-deals-toolbar-icon"]}
          src={filterIcon}
          onClick={() => {
            setShowToolBarMenu(!showToolBarMenu);
          }}
        />
        {showToolBarMenu && (
          <div className={styles["all-deals-toolbar-menu"]}>
            <label>
              <span>Category filter</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                data-cy="all-deals-toolbar-categories">
                {CATEGORIES.map((category) => {
                  return <option key={category}>{category}</option>;
                })}
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                data-cy="all-deals-toolbar-sort-by">
                {SORT_BY.map((sortOption) => {
                  return <option key={sortOption}>{sortOption}</option>;
                })}
              </select>
            </label>
            <ButtonPrimary
              text="Save"
              action={sortAndFilterDeals}
              dataCy="all-deals-toolbar-save-btn"
            />
          </div>
        )}
      </div>
      {allDeals?.length === 0 && (
        <div className={styles["all-deals-no-deals-found"]}>
          Sorry no deals found
        </div>
      )}
      {allDeals?.length > 0 && (
        <div className={styles["all-deals-main"]}>
          <div className={styles["all-deals-main"]} data-cy="all-deals-main">
            {allDeals &&
              allDeals.map((deal) => {
                return (
                  <DealListView
                    deal={deal}
                    setDeals={setAllDeals}
                    key={deal.id}
                  />
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}

export default AllDeals;
