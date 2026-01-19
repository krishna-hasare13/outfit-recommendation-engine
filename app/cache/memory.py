CACHE = {}

def cache_get(key):
    return CACHE.get(key)

def cache_set(key, value):
    CACHE[key] = value
