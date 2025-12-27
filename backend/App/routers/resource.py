from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Resource, Lesson
from ..schemas import ResourceCreate, ResourceOut
from typing import List
from sqlalchemy import func
import json

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
    # Get manual resources
    manual_resources = db.query(Resource).all()
    
    # Get AI resources from Lessons
    lessons = db.query(Lesson).filter(Lesson.ai_resources.isnot(None)).all()
    
    ai_resources_list = []
    # Start ID from -1 for AI resources to avoid collision with DB IDs
    current_id = -1
    
    for lesson in lessons:
        if not lesson.ai_resources:
            continue
            
        try:
            resources_data = json.loads(lesson.ai_resources)
            if not isinstance(resources_data, list):
                continue
                
            for res in resources_data:
                # Map AI types to frontend categories
                res_type = res.get("type", "").lower()
                category = "Articles & Tutorials" # Default
                icon_name = "FileText"
                
                if "video" in res_type:
                    category = "Video Courses"
                    icon_name = "Video"
                elif "practice" in res_type or "code" in res_type:
                    category = "Practice Platforms"
                    icon_name = "Code"
                elif "doc" in res_type:
                    category = "Articles & Tutorials"
                    icon_name = "FileText"
                
                # Sanitize URL to prevent 404s
                raw_url = res.get("url", "#").strip()
                title = res.get("title", "Resource")
                
                # Logic to determine if URL is safe, otherwise fallback to Search
                final_url = raw_url
                
                # Conditions to trigger fallback to search
                is_invalid = (
                    "example.com" in raw_url or 
                    "localhost" in raw_url or 
                    len(raw_url) < 10 or 
                    " " in raw_url or
                    not ("." in raw_url)
                )
                
                # If it's a "deep" Youtube link (v=...), it might be hallucinated. 
                # But the user prefers specific links even if they might 404, rather than search results.
                # So we only fallback if it's strictly invalid or example.com
                
                if is_invalid:
                    # Fallback to search
                    query = title.replace(" ", "+")
                    if "video" in res_type or "youtube" in raw_url:
                        final_url = f"https://www.youtube.com/results?search_query={query}"
                    else:
                        final_url = f"https://www.google.com/search?q={query}"
                elif not (raw_url.startswith("http://") or raw_url.startswith("https://")):
                    # Fix missing protocol
                    final_url = f"https://{raw_url}"

                # Create ResourceOut compatible object
                ai_res = ResourceOut(
                    id=current_id,
                    title=title,
                    description=f"{res.get('duration', '')} • From Lesson: {lesson.title}",
                    type=res.get("type", "External"),
                    category=category,
                    url=final_url,
                    icon_name=icon_name
                )
                ai_resources_list.append(ai_res)
                current_id -= 1
                
        except json.JSONDecodeError:
            continue
            
    return manual_resources + ai_resources_list

@router.get("/category/{category}", response_model=List[ResourceOut])
def get_resources_by_category(category: str, db: Session = Depends(get_db)):
    # This might need similar update if used, but get_all handles the main view
    # For now, let's keep it simple and just do DB query, 
    # but the frontend seems to rely on client-side filtering of get_all_resources mostly?
    # Actually resources-view.tsx loads ALL resources initially.
    # So this endpoint might be for direct access or other views.
    # We should probably update this too if we want consistency, but let's stick to get_all first.
    return db.query(Resource).filter(Resource.category == category).all()

@router.get("/stats")
def get_resource_stats(db: Session = Depends(get_db)):
    """Returns counts of resources per category for the UI cards"""
    # Get DB counts
    stats = db.query(
        Resource.category, 
        func.count(Resource.id).label('count')
    ).group_by(Resource.category).all()
    
    stats_dict = {category: count for category, count in stats}
    
    # Add AI counts
    lessons = db.query(Lesson).filter(Lesson.ai_resources.isnot(None)).all()
    
    for lesson in lessons:
        if not lesson.ai_resources:
            continue
        try:
            resources_data = json.loads(lesson.ai_resources)
            if not isinstance(resources_data, list):
                continue
            for res in resources_data:
                res_type = res.get("type", "").lower()
                category = "Articles & Tutorials" # Default
                
                if "video" in res_type:
                    category = "Video Courses"
                elif "practice" in res_type or "code" in res_type:
                    category = "Practice Platforms"
                elif "doc" in res_type:
                    category = "Articles & Tutorials"
                
                stats_dict[category] = stats_dict.get(category, 0) + 1
        except:
            continue
            
    return stats_dict
