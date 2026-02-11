from fastapi import FastAPI
from app.core.config import settings

from app.api import auth, api_plans, api_workouts, api_user_workouts, api_progress

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.PROJECT_NAME)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    print(f"CORS Origins: {settings.BACKEND_CORS_ORIGINS}")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # Force wildcard for debugging
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

else:
    # Fallback for dev if settings not populated or just hardcode for simplicity in this MVP
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(api_plans.router, prefix="/plans", tags=["plans"])
app.include_router(api_workouts.router, prefix="/workouts", tags=["workouts"])
app.include_router(api_user_workouts.router, prefix="/user-workouts", tags=["user-workouts"])
app.include_router(api_progress.router, prefix="/progress", tags=["progress"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Yeimi Fitness Platform API"}
