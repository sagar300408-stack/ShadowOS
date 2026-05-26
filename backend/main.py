from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import analyze, dashboard, deploy, health, recommendations, upload, workflow

app = FastAPI(
    title="ShadowOS API",
    description="AI operational intelligence backend for real estate workflow analysis.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(upload.router)
app.include_router(analyze.router)
app.include_router(dashboard.router)
app.include_router(workflow.router)
app.include_router(recommendations.router)
app.include_router(deploy.router)

