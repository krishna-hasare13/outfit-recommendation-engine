import csv
import json

INPUT_CSV = "Sample Products - exported_products_by_popularity.csv"
OUTPUT_JSON = "app/data/products.json"

products = {}

def infer_category(category, product_type):
    text = f"{category} {product_type}".lower()

    if any(k in text for k in ["shoe", "sneaker", "footwear"]):
        return "footwear"
    if any(k in text for k in ["t-shirt", "shirt", "top", "tee"]):
        return "top"
    if any(k in text for k in ["jeans", "pant", "trouser", "bottom"]):
        return "bottom"
    return "accessory"


with open(INPUT_CSV, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)

    for row in reader:
        pid = row.get("sku_id")

        if not pid:
            continue

        products[pid] = {
            "id": pid,
            "title": row.get("title", ""),
            "brand": row.get("brand_name", ""),
            "category": infer_category(
                row.get("category", ""),
                row.get("product_type", "")
            ),
            "price": int(float(row.get("lowest_price", 0) or 0)),
            "image_url": row.get("featured_image"),
            "gender": row.get("gender", "unisex").lower(),
            "colors": ["neutral"],       # assumption (documented)
            "style": ["casual"],         # assumption
            "occasion": ["casual"],      # assumption
            "season": ["all"]            # assumption
        }

with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2)

print(f"Converted {len(products)} products to JSON.")
