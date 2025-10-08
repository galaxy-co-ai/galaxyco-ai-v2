from fastapi import FastAPI
from datetime import datetime
import os

app = FastAPI(title="GalaxyCo.ai Agents Service", version="0.1.0")

@app.get("/")
def root():
    return {
        "message": "GalaxyCo.ai Agents Service v2.0",
        "docs": "/docs",
        "health": "/health",
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "galaxyco-agents",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "environment": os.getenv("ENV", "development"),
        "openai_configured": bool(os.getenv("OPENAI_API_KEY")),
    }
