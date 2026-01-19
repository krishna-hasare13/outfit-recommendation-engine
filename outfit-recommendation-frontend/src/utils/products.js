import products from "../data/products.json";

// ❌ Disallowed anchor keywords (maintenance & micro-items)
const INVALID_KEYWORDS = [
  "lace",
  "laces",
  "sock",
  "socks",
  "insole",
  "cleaner",
  "spray",
  "protector",
  "cream"
];

// Only allow valid anchor products
export const anchorProducts = Object.values(products)
  .filter((p) => {
    // Only tops or footwear can anchor outfits
    if (!(p.category === "top" || p.category === "footwear")) {
      return false;
    }

    // Remove non-wearable / utility items by title
    const title = p.title.toLowerCase();
    return !INVALID_KEYWORDS.some(keyword => title.includes(keyword));
  })
  .map((p) => ({
    id: p.id,
    title: p.title,
    brand: p.brand,
    image: p.image_url
  }));
