"""
CarbonWise AI — FastAPI Application Entry Point

Production-ready FastAPI application with CORS, router configuration,
and database initialization.
"""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models.database import init_db
from app.routes import calculate, ai_coach, progress, challenges

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup."""
    init_db()
    yield


app = FastAPI(
    title="CarbonWise AI",
    description="AI-powered carbon footprint awareness and sustainability coaching platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(calculate.router)
app.include_router(ai_coach.router)
app.include_router(progress.router)
app.include_router(challenges.router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": "CarbonWise AI",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check for deployment monitoring."""
    return {"status": "healthy"}
