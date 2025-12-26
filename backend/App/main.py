from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from .database import engine, Base
from . import models
from .routers import (
    login,
    register,
    profile,
    learning_path,
    progress,
    module,
    lesson,
    project,
    resource,
    ai,
)

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pathora API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(login.router)
app.include_router(register.router)
app.include_router(profile.router)
app.include_router(learning_path.router)
app.include_router(progress.router)
app.include_router(module.router)
app.include_router(lesson.router)
app.include_router(project.router)
app.include_router(resource.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {"message": "Pathora Backend Running"}
