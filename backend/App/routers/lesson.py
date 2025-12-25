from ..schemas import LessonCreate
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Lesson

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.post("/")
def create_lesson(data: LessonCreate, db: Session = Depends(get_db)):
    lesson = Lesson(**data.dict())
    db.add(lesson)
    db.commit()
    return lesson
