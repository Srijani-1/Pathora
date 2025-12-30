from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Resource, Lesson, Module, LearningPath # Import hierarchy
from ..schemas import ResourceCreate, ResourceOut
from ..core.auth import get_current_user # Import auth dependency
from .. import models
from typing import List
from sqlalchemy import func
import json

router = APIRouter(prefix="/resources", tags=["Resources"])

@router.get("/", response_model=List[ResourceOut])
def get_all_resources(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # Add Auth here
):
    # 1. Get manual resources (Global library for everyone)
    manual_resources = db.query(Resource).all()
    
    # 2. Get AI resources ONLY from Lessons belonging to this user's paths
    lessons = (
        db.query(Lesson)
        .join(Module, Lesson.module_id == Module.id)
        .join(LearningPath, Module.learning_path_id == LearningPath.id)
        .filter(
            LearningPath.creator_id == current_user.id, # Filter by current user
            Lesson.ai_resources.isnot(None)
        )
        .all()
    )
    
    ai_resources_list = []
    current_id = -1
    
    for lesson in lessons:
        if not lesson.ai_resources:
            continue
            
        try:
            resources_data = json.loads(lesson.ai_resources)
            if not isinstance(resources_data, list):
                continue
                
            for res in resources_data:
                res_type = res.get("type", "").lower()
                category = "Articles & Tutorials"
                icon_name = "FileText"
                
                if "video" in res_type:
                    category = "Video Courses"
                    icon_name = "Video"
                elif "practice" in res_type or "code" in res_type:
                    category = "Practice Platforms"
                    icon_name = "Code"
                
                raw_url = res.get("url", "#").strip()
                title = res.get("title", "Resource")
                
                # Protocol fix
                final_url = raw_url
                if not (raw_url.startswith("http://") or raw_url.startswith("https://")) and raw_url != "#":
                    final_url = f"https://{raw_url}"

                ai_res = ResourceOut(
                    id=current_id,
                    title=title,
                    description=f"{res.get('duration', '')} • From Lesson: {lesson.title}",
                    type=res.get("type", "AI Generated"),
                    category=category,
                    url=final_url,
                    icon_name=icon_name
                )
                ai_resources_list.append(ai_res)
                current_id -= 1
                
        except json.JSONDecodeError:
            continue
            
    return manual_resources + ai_resources_list

@router.get("/stats")
def get_resource_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # Add Auth here
):
    """Returns counts of resources per category specific to the user"""
    
    # Global counts
    stats = db.query(
        Resource.category, 
        func.count(Resource.id).label('count')
    ).group_by(Resource.category).all()
    
    stats_dict = {category: count for category, count in stats}
    
    # User-specific AI counts
    lessons = (
        db.query(Lesson)
        .join(Module, Lesson.module_id == Module.id)
        .join(LearningPath, Module.learning_path_id == LearningPath.id)
        .filter(
            LearningPath.creator_id == current_user.id,
            Lesson.ai_resources.isnot(None)
        )
        .all()
    )
    
    for lesson in lessons:
        try:
            resources_data = json.loads(lesson.ai_resources)
            for res in resources_data:
                res_type = res.get("type", "").lower()
                category = "Articles & Tutorials"
                if "video" in res_type: category = "Video Courses"
                elif "practice" in res_type: category = "Practice Platforms"
                
                stats_dict[category] = stats_dict.get(category, 0) + 1
        except:
            continue
            
    return stats_dict