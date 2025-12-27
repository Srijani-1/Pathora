from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project, User
from ..schemas import ProjectCreate, ProjectOut
from typing import List

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectOut)
def create_project(data: ProjectCreate, user_id: int, db: Session = Depends(get_db)):
    project = Project(**data.dict(), user_id=user_id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/user/{user_id}", response_model=List[ProjectOut])
def get_user_projects(user_id: int, db: Session = Depends(get_db)):
    return db.query(Project).filter(Project.user_id == user_id).all()

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}/status")
def update_project_status(project_id: int, status: str, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.status = status
    db.commit()
    return {"message": "Status updated"}

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Deleted"}

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, data: ProjectCreate, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Update all fields provided in the request
    for key, value in data.dict().items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    return project
