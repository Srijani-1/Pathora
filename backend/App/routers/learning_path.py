from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import LearningPath, Progress, Lesson
from ..schemas import LearningPathOut, LearningPathCreate, ModuleOut, LessonOut
from typing import List

router = APIRouter(prefix="/learning-paths", tags=["Learning Paths"])

# CREATE
@router.post("/", response_model=LearningPathOut)
def create_learning_path(data: LearningPathCreate, db: Session = Depends(get_db)):
    path = LearningPath(**data.dict())
    db.add(path)
    db.commit()
    db.refresh(path)
    return path

# GET ALL
@router.get("/", response_model=List[LearningPathOut])
def get_all_learning_paths(user_id: int = None, db: Session = Depends(get_db)):
    paths = db.query(LearningPath).all()
    if not user_id:
        return paths

    for path in paths:
        for module in path.modules:
            for lesson in module.lessons:
                progress = db.query(Progress).filter_by(
                    user_id=user_id,
                    lesson_id=lesson.id
                ).first()

                lesson.status = (
                    "completed" if progress and progress.completed
                    else "in-progress" if progress
                    else "upcoming"
                )

                lesson.prerequisites_list = [
                    p.prerequisite.title for p in lesson.prerequisites
                ]
    return paths

# GET
@router.get("/{path_id}", response_model=LearningPathOut)
def get_learning_path(
    path_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        raise HTTPException(404, "Learning path not found")

    # The relationship modules should be loaded automatically
    for module in path.modules:
        for lesson in module.lessons:
            progress = db.query(Progress).filter_by(
                user_id=user_id,
                lesson_id=lesson.id
            ).first()

            lesson.status = (
                "completed" if progress and progress.completed
                else "in-progress" if progress
                else "upcoming"
            )

            # prerequisites in model is a list of LessonPrerequisite objects
            lesson.prerequisites_list = [
                p.prerequisite.title for p in lesson.prerequisites
            ]

    return path

# UPDATE
@router.put("/{path_id}", response_model=LearningPathOut)
def update_learning_path(path_id: int, data: LearningPathCreate, db: Session = Depends(get_db)):
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        raise HTTPException(404, "Learning path not found")
    for key, value in data.dict().items():
        setattr(path, key, value)
    db.commit()
    db.refresh(path)
    return path

# DELETE
@router.delete("/{path_id}")
def delete_learning_path(path_id: int, db: Session = Depends(get_db)):
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        raise HTTPException(404, "Learning path not found")
    db.delete(path)
    db.commit()
    return {"message": "Deleted"}
