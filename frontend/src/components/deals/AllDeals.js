import React from "react";
import { useAllDeals } from "../hooks/useAllDeals";
import { useEffect } from "react";
import filterIcon from "../../assets/filter-icon.svg";
import styles from "./AllDeals.module.css";
import { useAuth } from "../context/authContext";

import DealListView from "./DealListView";

function AllDeals() {
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

  if (allDeals?.length === 0) return <div>Sorry no deals found</div>;
  if (allDealsIsPending)
    return <div className={styles["all-deals-loading"]}></div>;
  return (
    <>
      <div className={styles["all-deals-main-toolbar"]}>
        <img
          className={styles["all-deals-main-toolbar-filter"]}
          src={filterIcon}
        />
      </div>

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
    </>
  );
}

export default AllDeals;
