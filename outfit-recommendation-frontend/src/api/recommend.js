import axios from "axios";

export async function getOutfits(baseProductId, budgetTier) {
  const res = await axios.post(
    "http://127.0.0.1:8000/recommendations/outfit",
    {
      base_product_id: baseProductId,
      occasion: "casual",
      budget_tier: budgetTier
    }
  );
  return res.data;
}
