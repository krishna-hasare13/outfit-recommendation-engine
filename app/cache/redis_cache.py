import json
import os
import redis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

try:
    redis_client = redis.Redis.from_url(
        REDIS_URL,
        decode_responses=True,
        socket_connect_timeout=1
    )
    redis_client.ping()
    REDIS_AVAILABLE = True
except Exception:
    redis_client = None
    REDIS_AVAILABLE = False


def get_cache(key: str):
    if not REDIS_AVAILABLE:
        return None

    value = redis_client.get(key)
    if value:
        return json.loads(value)
    return None


def set_cache(key: str, value: dict, ttl: int = 300):
    if not REDIS_AVAILABLE:
        return

    redis_client.setex(key, ttl, json.dumps(value))
