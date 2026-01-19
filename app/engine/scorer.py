def budget_target(tier):
    """
    Returns (target_price, tolerance)
    Target = ideal total outfit price
    Tolerance = how much deviation is acceptable
    """
    if tier == "low":
        return 5000, 3000       # budget-friendly
    if tier == "mid":
        return 12000, 5000     # balanced
    if tier == "high":
        return 30000, 15000    # premium
    return 12000, 5000


def budget_score(total_price, tier):
    target, tolerance = budget_target(tier)
    distance = abs(total_price - target)

    # Normalize score between 0 and 1
    score = 1 - (distance / tolerance)
    return max(0.0, min(score, 1.0))


def score_outfit(base, products, budget_tier):
    """
    Final outfit scoring function
    """

    # --- Static heuristic scores (fast, deterministic) ---
    color_score = 0.9
    style_score = 0.85
    occasion_score = 0.8
    season_score = 0.9

    # --- Budget score ---
    total_price = sum(p.get("price", 0) for p in products.values())
    b_score = budget_score(total_price, budget_tier)

    # --- Accessory sanity bonus ---
    accessory_price = products["accessory"].get("price", 0)

    # Encourage reasonable accessories (not dominating budget)
    if accessory_price == 0:
        accessory_bonus = 0.0
    elif accessory_price < 1500:
        accessory_bonus = 0.05
    else:
        accessory_bonus = 0.02

    # --- Final weighted score ---
    final_score = (
        0.30 * color_score +
        0.25 * style_score +
        0.20 * occasion_score +
        0.15 * season_score +
        0.10 * b_score +
        accessory_bonus
    )

    return round(min(final_score, 1.0), 2)
