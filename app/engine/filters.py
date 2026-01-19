def compatible(base, product, occasion):
    if occasion not in product["occasion"]:
        return False

    if not set(base["style"]).intersection(product["style"]):
        return False

    if not set(base["season"]).intersection(product["season"]) and "all" not in product["season"]:
        return False

    return True


def split_by_category(products):
    tops, bottoms, footwear, accessories = [], [], [], []

    for p in products:
        if p["category"] == "top":
            tops.append(p)
        elif p["category"] == "bottom":
            bottoms.append(p)
        elif p["category"] == "footwear":
            footwear.append(p)
        elif p["category"] == "accessory":
            accessories.append(p)

    return tops, bottoms, footwear, accessories
