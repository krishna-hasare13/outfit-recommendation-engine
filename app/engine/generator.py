import json
import time
import random
from itertools import product
from app.engine.scorer import score_outfit
from app.engine.diversity import diversify

# ---------- Load data once at startup ----------
with open("app/data/products.json") as f:
    PRODUCTS = json.load(f)

with open("app/data/compatibility_graph.json") as f:
    GRAPH = json.load(f)


# ---------- Semantic Guards ----------
def is_valid_footwear(product):
    """
    Filters out non-shoe items incorrectly tagged as footwear
    (laces, socks, cleaners, etc.)
    """
    title = product.get("title", "").lower()
    invalid_keywords = [
        "lace", "laces", "sock", "socks",
        "insole", "cleaner", "spray",
        "protector", "cream"
    ]
    return not any(word in title for word in invalid_keywords)


def generate_outfits(base_product_id: str, occasion: str, budget_tier: str):
    start_time = time.perf_counter()

    base = PRODUCTS.get(base_product_id)
    if not base:
        return {"error": "Invalid base product"}

    # ❌ Accessories cannot anchor outfits
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

    # ---------- 🔒 LOCK BASE PRODUCT INTO ITS CATEGORY ----------
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

    # ---------- HARD LIMITS (PERFORMANCE SAFE) ----------
    MAX_PER_CATEGORY = 6
    MAX_OUTFITS = 25
    MAX_TIME_SEC = 0.6

    # Shuffle ONLY non-base categories
    if base["category"] != "top":
        random.shuffle(tops)
        tops = tops[:MAX_PER_CATEGORY]

    if base["category"] != "bottom":
        random.shuffle(bottoms)
        bottoms = bottoms[:MAX_PER_CATEGORY]

    if base["category"] != "footwear":
        random.shuffle(footwear)
        footwear = footwear[:MAX_PER_CATEGORY]

    random.shuffle(accessories)
    accessories = accessories[:MAX_PER_CATEGORY]

    outfits = []
    base_links = set(GRAPH.get(base_product_id, []))

    # ---------- Outfit generation ----------
    for top, bottom, shoe, accessory in product(
        tops, bottoms, footwear, accessories
    ):
        # ⏱️ Hard safety cutoff
        if time.perf_counter() - start_time > MAX_TIME_SEC:
            break

        # ---- Graph compatibility rules ----
        if base["category"] != "top" and top["id"] not in base_links:
            continue

        if base["category"] != "bottom" and bottom["id"] not in base_links:
            continue

        if base["category"] != "footwear" and shoe["id"] not in base_links:
            continue

        if accessory["id"] not in base_links:
            continue

        # Bottom must be compatible with top
        if bottom["id"] not in GRAPH.get(top["id"], []):
            continue

        products = {
            "top": top,
            "bottom": bottom,
            "footwear": shoe,
            "accessory": accessory
        }

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
                "style": list(set(base["style"]) & set(top["style"])),
                "occasion": occasion,
                "season": list(set(base["season"]) & set(top["season"])),
                "budget": {
                    "tier": budget_tier,
                    "total_price": sum(p["price"] for p in products.values())
                }
            }
        })

        if len(outfits) >= MAX_OUTFITS:
            break

    # ---------- Enforce real diversity ----------
    outfits = diversify(
        sorted(outfits, key=lambda x: x["match_score"], reverse=True),
        base_category=base["category"],
        limit=2
    )

    return {
        "base_product": base_product_id,
        "outfits": outfits
    }
