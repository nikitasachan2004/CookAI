def precision_at_k(recommended_ids: list[int], relevant_ids: list[int], k: int) -> float:
    if k <= 0:
        return 0.0

    top_k = recommended_ids[:k]
    if not top_k:
        return 0.0

    relevant_set = set(relevant_ids)
    hits = sum(1 for recipe_id in top_k if recipe_id in relevant_set)
    return hits / k


def hit_rate(recommended_ids: list[int], relevant_ids: list[int]) -> int:
    relevant_set = set(relevant_ids)
    return int(any(recipe_id in relevant_set for recipe_id in recommended_ids))
