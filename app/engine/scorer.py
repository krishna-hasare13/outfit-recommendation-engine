def budget_target(tier):
    if tier == "low":
        return 3000, 2000
    if tier == "mid":
        return 7000, 4000
    if tier == "high":
        return 12000, 6000
    return 7000, 4000


def budget_score(total, tier):
    target, tolerance = budget_target(tier)
    distance = abs(total - target)
    return max(0.0, 1 - (distance / tolerance))


def score_outfit(base, products, budget_tier):
    color_score = 0.9
    style_score = 0.85
    occasion_score = 0.8
    season_score = 0.9

    total_price = sum(p["price"] for p in products.values())
    b_score = budget_score(total_price, budget_tier)

    accessory_price = products["accessory"]["price"]
    accessory_bonus = 0.05 if accessory_price < 1000 else 0.02

    final = (
        0.30 * color_score +
        0.25 * style_score +
        0.20 * occasion_score +
        0.15 * season_score +
        0.10 * b_score +
        accessory_bonus
    )

    return round(final, 2)
