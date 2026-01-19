import time
from functools import wraps

def timed(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = fn(*args, **kwargs)
        duration = (time.perf_counter() - start) * 1000
        result["latency_ms"] = round(duration, 2)
        return result
    return wrapper
