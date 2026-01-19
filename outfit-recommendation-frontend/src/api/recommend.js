import axios from "axios";

const API_URL = "http://127.0.0.1:8000/recommendations/outfit";

export async function getOutfits(baseProductId) {
  const res = await axios.post(API_URL, {
    base_product_id: baseProductId,
    occasion: "casual",
    budget_tier: "mid"
  });
  return res.data;
}
