from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Resource
from ..schemas import ResourceCreate, ResourceOut
from typing import List

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.post("/", response_model=ResourceOut)
def create_resource(data: ResourceCreate, db: Session = Depends(get_db)):
    resource = Resource(**data.dict())
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource

@router.get("/", response_model=List[ResourceOut])
def get_all_resources(db: Session = Depends(get_db)):
    return db.query(Resource).all()

@router.get("/category/{category}", response_model=List[ResourceOut])
def get_resources_by_category(category: str, db: Session = Depends(get_db)):
    return db.query(Resource).filter(Resource.category == category).all()
