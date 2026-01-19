import json
from itertools import combinations

INPUT_FILE = "app/data/products.json"
OUTPUT_FILE = "app/data/compatibility_graph.json"


def is_compatible(p1, p2):
    # Style overlap
    if not set(p1["style"]).intersection(p2["style"]):
        return False

    # Occasion overlap
    if not set(p1["occasion"]).intersection(p2["occasion"]):
        return False

    # Season overlap
    if not (
        set(p1["season"]).intersection(p2["season"])
        or "all" in p1["season"]
        or "all" in p2["season"]
    ):
        return False

    return True


def build_graph(products):
    graph = {pid: [] for pid in products}

    for (id1, p1), (id2, p2) in combinations(products.items(), 2):
        if is_compatible(p1, p2):
            graph[id1].append(id2)
            graph[id2].append(id1)

    return graph


if __name__ == "__main__":
    with open(INPUT_FILE) as f:
        products = json.load(f)

    graph = build_graph(products)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(graph, f, indent=2)

    print("Compatibility graph generated successfully.")
