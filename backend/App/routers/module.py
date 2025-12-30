from ..schemas import ModuleCreate
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Module

router = APIRouter(prefix="/modules", tags=["Modules"])

@router.post("/")
def create_module(data: ModuleCreate, db: Session = Depends(get_db)):
    module = Module(**data.dict())
    db.add(module)
    db.commit()
    return module
