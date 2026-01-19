from fastapi import APIRouter
from pydantic import BaseModel
from app.engine.generator import generate_outfits
from app.cache.redis_cache import get_cache, set_cache
from app.cache.memory import cache_get, cache_set
from app.utils.timing import timed

router = APIRouter()

class OutfitRequest(BaseModel):
    base_product_id: str
    occasion: str = "casual"
    budget_tier: str = "mid"

@router.post("/outfit")
@timed
def recommend_outfit(req: OutfitRequest):
    cache_key = f"{req.base_product_id}:{req.occasion}:{req.budget_tier}"

    cached = get_cache(cache_key)
    if cached:
        return cached

    cached = cache_get(cache_key)
    if cached:
        return cached


    result = generate_outfits(
        base_product_id=req.base_product_id,
        occasion=req.occasion,
        budget_tier=req.budget_tier
    )

    set_cache(cache_key, result)
    cache_set(cache_key, result)
    return result
