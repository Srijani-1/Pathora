from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/ai", tags=["AI Generator"])

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    # Remove surrounding quotes if present
    if (api_key.startswith('"') and api_key.endswith('"')) or \
       (api_key.startswith("'") and api_key.endswith("'")):
        api_key = api_key[1:-1]
        
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="OPENAI_API_KEY environment variable is not set. Please add it to your environment."
        )
    
    # Debug print (masked) to terminal for the user to verify
    print(f"DEBUG: Key length: {len(api_key)}")
    print(f"DEBUG: Key prefix/suffix: {api_key[:12]}...{api_key[-4:]}")
    
    return OpenAI(api_key=api_key)

@router.post("/generate-path")
async def generate_learning_path(
    req: schemas.PathGenerationRequest,
    db: Session = Depends(get_db)
):
    client = get_openai_client()

    try:
        prompt = f"""
        You are a world-class educational path designer. 
        Create a comprehensive, professional learning path for '{req.topic}' at a '{req.difficulty}' level.
        The path should be designed for {req.weeks} weeks, with approximately {req.hours_per_week} hours of study per week.
        
        Return the result as a strictly valid JSON object with the following exact structure:
        {{
            "title": "A catchy title for the path",
            "description": "A brief overview of the learning journey",
            "difficulty": "{req.difficulty}",
            "modules": [
                {{
                    "title": "Module Name (e.g., Week 1: Fundamentals)",
                    "order": 1,
                    "lessons": [
                        {{
                            "title": "Lesson Name",
                            "content": "Specific learning objectives and topics covered",
                            "estimated_time": "Estimated hours (e.g., 2 hours)",
                            "difficulty": "{req.difficulty}"
                        }}
                    ]
                }}
            ]
        }}
        Ensure the curriculum is pedagogical, starts from foundations, and builds up.
        Return ONLY the raw JSON string. No markdown, no triple backticks.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that outputs only JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        text = response.choices[0].message.content.strip()
        path_data = json.loads(text)
        
        # Save to database
        new_path = models.LearningPath(
            title=path_data["title"],
            description=path_data["description"],
            difficulty=path_data.get("difficulty", req.difficulty),
            creator_id=req.user_id
        )
        db.add(new_path)
        db.commit()
        db.refresh(new_path)
        
        for m_idx, m_data in enumerate(path_data["modules"]):
            new_module = models.Module(
                title=m_data["title"],
                order=m_data.get("order", m_idx + 1),
                learning_path_id=new_path.id
            )
            db.add(new_module)
            db.commit()
            db.refresh(new_module)
            
            for l_data in m_data["lessons"]:
                new_lesson = models.Lesson(
                    title=l_data["title"],
                    content=l_data["content"],
                    difficulty=l_data.get("difficulty", req.difficulty),
                    estimated_time=l_data["estimated_time"],
                    module_id=new_module.id
                )
                db.add(new_lesson)
        
        db.commit()
        return {"message": "Learning path generated via GPT-4! 🚀", "path_id": new_path.id, "title": new_path.title}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/generate-lesson-content")
async def generate_lesson_content(
    req: schemas.LessonContentRequest,
    db: Session = Depends(get_db)
):
    client = get_openai_client()

    lesson = db.query(models.Lesson).filter(models.Lesson.id == req.lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    try:
        prompt = f"""
        You are a technical expert and educator. 
        Create a comprehensive learning package for the following topic:
        Title: {lesson.title}
        Context: Part of a {lesson.module.learning_path.title} curriculum.
        Difficulty: {lesson.difficulty}
        
        Return a valid JSON object with the following fields:
        {{
            "content": "Full study guide in GitHub-style Markdown (approx 1000 words). Include concepts, code examples, and summary.",
            "why_it_matters": "A 2-3 sentence explanation of why this skill is valuable in the industry.",
            "what_you_learn": ["Key takeaway 1", "Key takeaway 2", "Key takeaway 3"],
            "resources": [
                {{
                    "title": "Resource Title",
                    "type": "video/article/practice",
                    "url": "https://example.com/useful-link",
                    "duration": "e.g. 15 mins"
                }}
            ]
        }}
        
        Ensure the 'content' markdown uses clear headings (h1, h2, h3) and professional formatting.
        Return ONLY the raw JSON string.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a technical expert that outputs only JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        data = json.loads(response.choices[0].message.content.strip())
        detailed_content = data.get("content", "")
        why_it_matters = data.get("why_it_matters", "")
        what_you_learn = json.dumps(data.get("what_you_learn", []))
        resources_data = data.get("resources", [])
        
        # Update lesson in database
        lesson.content = detailed_content
        lesson.why_it_matters = why_it_matters
        lesson.what_you_learn = what_you_learn
        
        # We could also save resources to the Resource table if needed, 
        # but for now let's return them in the response.
        
        db.commit()
        
        return {
            "message": "Content generated successfully via GPT-4", 
            "content": detailed_content,
            "why_it_matters": why_it_matters,
            "what_you_learn": data.get("what_you_learn", []),
            "resources": resources_data
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")
