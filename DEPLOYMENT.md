# 🚀 Pathora Deployment Guide

This guide will help you deploy the Pathora platform (FastAPI Backend + Vite Frontend).

## 1. Backend Deployment (Render.com)

Render is recommended for the FastAPI backend as it supports Docker and has a generous free tier.

### Steps:
1.  **Create a Render Account**: Go to [render.com](https://render.com).
2.  **New Web Service**: Click "New +" and select "Web Service".
3.  **Connect Repository**: Link your GitHub/GitLab repository.
4.  **Configure**:
    *   **Name**: `pathora-backend`
    *   **Root Directory**: `backend`
    *   **Runtime**: `Python 3` (or `Docker` if you prefer my Dockerfile)
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker App.main:app`
5.  **Environment Variables**:
    *   `DATABASE_URL`: Your PostgreSQL URL.
    *   `OPENAI_API_KEY`: Your key.
    *   `PYTHON_VERSION`: `3.11.0` (Recommended)
6.  **Deploy**: Render will build the image using the `Dockerfile` I created.

---

## 2. Frontend Deployment (Vercel)

Vercel is the industry standard for Vite/React applications.

### Steps:
1.  **Create a Vercel Account**: Go to [vercel.com](https://vercel.com).
2.  **Add New Project**: Select your repository.
3.  **Configure**:
    *   **Framework Preset**: `Vite`
    *   **Root Directory**: `frontend` (CRITICAL: set this to the frontend folder)
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`
4.  **Environment Variables**:
    *   `VITE_API_URL`: Set this to your **Render Backend URL** (e.g., `https://pathora-backend.onrender.com`).
5.  **Deploy**: Vercel will build and host your frontend.

---

## 3. Database Migration
If you are using a managed PostgreSQL (like on Render):
1.  The `Base.metadata.create_all(bind=engine)` in `backend/App/main.py` will automatically create the tables on the first run.
2.  Ensure your `DATABASE_URL` starts with `postgresql://` (if you get a 'postgres://' error, change it to 'postgresql://' in the environment variable).

---

## 4. Post-Deployment Check
1.  Open your Vercel URL.
2.  Try to Register/Login.
3.  Check if the AI features generate content (this confirms the Backend -> AI connection).
