import json
import time
import random
from itertools import product
from app.engine.scorer import score_outfit
from app.engine.diversity import diversify

# ---------- Load data once ----------
with open("app/data/products.json") as f:
    PRODUCTS = json.load(f)

with open("app/data/compatibility_graph.json") as f:
    GRAPH = json.load(f)

# ---------- Budget totals (SOFT caps) ----------
BUDGET_TOTAL_LIMITS = {
    "low": 9000,
    "mid": 18000,
    "high": 10**9
}

# ---------- Semantic guards ----------
INVALID_FOOTWEAR_KEYWORDS = {
    "lace", "laces", "sock", "socks",
    "insole", "cleaner", "spray",
    "protector", "cream"
}

def is_valid_footwear(product):
    title = product.get("title", "").lower()
    return not any(word in title for word in INVALID_FOOTWEAR_KEYWORDS)


# ---------- Main generator ----------
def generate_outfits(base_product_id: str, occasion: str, budget_tier: str):
    start_time = time.perf_counter()

    base = PRODUCTS.get(base_product_id)
    if not base:
        return {"error": "Invalid base product"}

    if base["category"] == "accessory":
        return {
            "base_product": base_product_id,
            "outfits": [],
            "note": "Accessories cannot anchor a full outfit."
        }

    # ---------- Split products ----------
    others = [p for pid, p in PRODUCTS.items() if pid != base_product_id]

    tops = [p for p in others if p["category"] == "top"]
    bottoms = [p for p in others if p["category"] == "bottom"]
    accessories = [p for p in others if p["category"] == "accessory"]
    footwear = [
        p for p in others
        if p["category"] == "footwear" and is_valid_footwear(p)
    ]

    # ---------- Lock base ----------
    if base["category"] == "top":
        tops = [base]
    elif base["category"] == "bottom":
        bottoms = [base]
    elif base["category"] == "footwear":
        if not is_valid_footwear(base):
            return {
                "base_product": base_product_id,
                "outfits": [],
                "note": "Selected footwear item is not a valid shoe."
            }
        footwear = [base]

    # ---------- Performance limits ----------
    MAX_PER_CATEGORY = 8
    MAX_OUTFITS = 30
    MAX_TIME_SEC = 0.7

    random.shuffle(tops)
    random.shuffle(bottoms)
    random.shuffle(footwear)
    random.shuffle(accessories)

    tops = tops[:MAX_PER_CATEGORY]
    bottoms = bottoms[:MAX_PER_CATEGORY]
    footwear = footwear[:MAX_PER_CATEGORY]
    accessories = accessories[:MAX_PER_CATEGORY]

    outfits = []
    base_links = set(GRAPH.get(base_product_id, []))
    max_total = BUDGET_TOTAL_LIMITS.get(budget_tier, 18000)

    # ---------- Outfit generation ----------
    for top, bottom, shoe, accessory in product(tops, bottoms, footwear, accessories):

        if time.perf_counter() - start_time > MAX_TIME_SEC:
            break

        # Compatibility checks
        if base["category"] != "top" and top["id"] not in base_links:
            continue
        if base["category"] != "bottom" and bottom["id"] not in base_links:
            continue
        if base["category"] != "footwear" and shoe["id"] not in base_links:
            continue
        if accessory["id"] not in base_links:
            continue
        if bottom["id"] not in GRAPH.get(top["id"], []):
            continue

        products = {
            "top": top,
            "bottom": bottom,
            "footwear": shoe,
            "accessory": accessory
        }

        total_price = sum(p["price"] for p in products.values())

        # ❗ SOFT budget gate (only extreme rejection)
        if total_price > max_total:
            continue

        score = score_outfit(base, products, budget_tier)

        outfits.append({
            "items": {
                "top": top["id"],
                "bottom": bottom["id"],
                "footwear": shoe["id"],
                "accessory": accessory["id"]
            },
            "match_score": round(score, 2),
            "reasoning": {
                "summary": (
                    "Casual streetwear outfit built around the selected product, "
                    "balanced for daily wear and budget awareness."
                ),
                "budget": {
                    "tier": budget_tier,
                    "total_price": total_price
                }
            }
        })

        if len(outfits) >= MAX_OUTFITS:
            break

    # ---------- Diversity ----------
    outfits = diversify(
        sorted(outfits, key=lambda x: x["match_score"], reverse=True),
        base_category=base["category"],
        limit=2
    )

    return {
        "base_product": base_product_id,
        "budget_tier": budget_tier,
        "outfits": outfits
    }
