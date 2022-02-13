import { useState } from "react";
import useAxios from "./useAxios";

export const useCreateNewDeal = () => {
  const [createDealError, setCreateDealError] = useState(null);
  const [createDealIsPending, setCreateDealIsPending] = useState(false);
  const [createDealResponse, setCreateDealReponse] = useState(null);
  const api = useAxios();

  const createNewDeal = async (data) => {
    const form = new FormData();
    for (let key in data) {
      if (data[key] !== "") {
        console.log(key);
        if (key === "deliveryPrice") {
          form.append("postage_cost", data[key]);
        } else if (key === "expiration") {
          form.append("deal_end_date", data[key]);
        } else {
          form.append(key, data[key]);
        }
      }
    }
    setCreateDealError(null);
    setCreateDealIsPending(true);
    try {
      const res = await api.post("/api/deals/", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCreateDealReponse(res.data);
    } catch (err) {
      setCreateDealError(err.response.data);
    }
    setCreateDealIsPending(false);
  };

  return {
    createNewDeal,
    createDealError,
    createDealIsPending,
    createDealResponse,
  };
};
