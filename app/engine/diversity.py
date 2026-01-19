def diversify(outfits, base_category="top", limit=3):
    used_bottoms = set()
    used_footwear = set()
    used_accessories = set()

    diversified = []

    for outfit in outfits:
        items = outfit["items"]

        # If base is top, enforce diversity on others
        if base_category == "top":
            if (
                items["bottom"] in used_bottoms or
                items["footwear"] in used_footwear or
                items["accessory"] in used_accessories
            ):
                continue

            used_bottoms.add(items["bottom"])
            used_footwear.add(items["footwear"])
            used_accessories.add(items["accessory"])

        diversified.append(outfit)

        if len(diversified) >= limit:
            break

    return diversified
