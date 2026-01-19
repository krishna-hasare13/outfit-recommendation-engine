from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.recommend import router as recommend_router

app = FastAPI(
    title="AI Outfit Recommendation Engine",
    version="1.0"
)

# ✅ CORS (Local + Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://outfit-recommendation-frontend.vercel.app"  # 🔁 CHANGE to your real Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(recommend_router, prefix="/recommendations")

@app.get("/")
def health():
    return {"status": "ok"}
