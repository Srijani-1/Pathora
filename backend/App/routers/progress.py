from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Progress, Lesson, Module, LearningSession, LearningPath
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List

router = APIRouter(prefix="/progress", tags=["Progress"])

@router.post("/complete/{lesson_id}")
def complete_lesson(
    lesson_id: int,
    user_id: int,
    time_spent: float,
    db: Session = Depends(get_db)
):
    session = LearningSession(
        user_id=user_id,
        lesson_id=lesson_id,
        time_spent=time_spent,
        completed=True
    )
    db.add(session)

    progress = db.query(Progress).filter_by(
        user_id=user_id,
        lesson_id=lesson_id
    ).first()

    if not progress:
        progress = Progress(user_id=user_id, lesson_id=lesson_id, completed=True)
        db.add(progress)
    else:
        progress.completed = True

    db.commit()
    return {"status": "completed"}


@router.get("/overview/{user_id}")
def get_progress_overview(user_id: int, db: Session = Depends(get_db)):
    # All progress records for this user
    user_progress = db.query(Progress).filter(Progress.user_id == user_id).all()
    
    completed_ids = [str(p.lesson_id) for p in user_progress if p.completed]
    in_progress_ids = [str(p.lesson_id) for p in user_progress if not p.completed]

    # Total hours
    total_hours = db.query(func.sum(LearningSession.time_spent))\
        .filter(LearningSession.user_id == user_id).scalar() or 0

    # Weekly streak (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    weekly_sessions = db.query(LearningSession)\
        .filter(
            LearningSession.user_id == user_id,
            LearningSession.created_at >= seven_days_ago
        ).all()

    weekly_days = len(set(s.created_at.date() for s in weekly_sessions))

    # Weekly goal
    weekly_goal = 10

    # Milestones
    milestones = []
    if len(completed_ids) >= 1:
        milestones.append({"id": "1", "title": "First Lesson", "description": "You completed your first lesson!", "achievedDate": str(datetime.utcnow().date()), "icon": "Trophy"})
    if len(completed_ids) >= 5:
        milestones.append({"id": "2", "title": "5 Lessons", "description": "You've completed 5 lessons!", "achievedDate": str(datetime.utcnow().date()), "icon": "Flame"})
    if len(completed_ids) >= 10:
        milestones.append({"id": "3", "title": "Master", "description": "10 lessons mastered!", "achievedDate": str(datetime.utcnow().date()), "icon": "Target"})

    return {
        "completedSkills": completed_ids,
        "inProgressSkills": in_progress_ids,
        "weeklyStreak": weekly_days,
        "weeklyGoalHours": weekly_goal,
        "totalHoursSpent": round(total_hours, 2),
        "milestones": milestones,
        "currentPath": "Frontend Development" # Placeholder
    }

@router.get("/path/{path_id}/{user_id}")
def get_path_progress(
    path_id: int,
    user_id: int,
    db: Session = Depends(get_db)
):
    # Check path exists
    path = db.query(LearningPath).filter(LearningPath.id == path_id).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")

    # Get all lessons under this path
    lessons = (
        db.query(Lesson.id)
        .join(Module, Lesson.module_id == Module.id)
        .filter(Module.learning_path_id == path_id)
        .all()
    )

    lesson_ids = [l.id for l in lessons]

    total_lessons = len(lesson_ids)

    if total_lessons == 0:
        return {
            "pathId": path_id,
            "completedLessons": 0,
            "totalLessons": 0,
            "progressPercent": 0,
            "weeklyStreak": 0,
            "totalHoursSpent": 0,
            "milestones": []
        }

    # Completed lessons
    completed = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.lesson_id.in_(lesson_ids),
        Progress.completed == True
    ).count()

    # Total hours spent
    total_hours = db.query(func.sum(LearningSession.time_spent)).filter(
        LearningSession.user_id == user_id,
        LearningSession.lesson_id.in_(lesson_ids)
    ).scalar() or 0

    # Weekly streak
    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    weekly_sessions = db.query(LearningSession).filter(
        LearningSession.user_id == user_id,
        LearningSession.lesson_id.in_(lesson_ids),
        LearningSession.created_at >= seven_days_ago
    ).all()

    weekly_days = len(set(s.created_at.date() for s in weekly_sessions))

    # Milestones
    milestones = []
    if completed >= 1:
        milestones.append({"id": "start", "title": "Started Path", "description": "You began your journey on this path!", "achievedDate": str(datetime.utcnow().date()), "icon": "PlayCircle"})
    if completed >= total_lessons // 2 and total_lessons > 0:
        milestones.append({"id": "half", "title": "Halfway There", "description": "You've completed half of the path!", "achievedDate": str(datetime.utcnow().date()), "icon": "TrendingUp"})
    if completed == total_lessons:
        milestones.append({"id": "complete", "title": "Path Completed", "description": "Congratulations! You've finished the entire path.", "achievedDate": str(datetime.utcnow().date()), "icon": "Trophy"})

    return {
        "pathId": path_id,
        "completedLessons": completed,
        "totalLessons": total_lessons,
        "progressPercent": round((completed / total_lessons) * 100, 2),
        "weeklyStreak": weekly_days,
        "totalHoursSpent": round(total_hours, 2),
        "milestones": milestones
    }
