import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getOutfits = async (baseId, budget) => {
  const res = await axios.post(`${API_URL}/recommendations/outfit`, {
    base_product_id: baseId,
    budget_tier: budget
  });
  return res.data;
};
