from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models, schemas
import os
import json
from openai import OpenAI

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
    print(f"OPENAI KEY: {api_key}")
    
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
        Write a detailed, comprehensive study guide/notes for the following topic:
        Title: {lesson.title}
        Context: Part of a {lesson.module.learning_path.title} curriculum.
        Difficulty: {lesson.difficulty}
        
        The content should include:
        1. Comprehensive explanation of concepts.
        2. Code examples (if applicable) in professional formatting.
        3. Practical use cases.
        4. Summary and Key Takeaways.
        
        Format the entire response in high-quality GitHub-style Markdown.
        Use clear headings, bold text for importance, and code blocks for code.
        The content should be approximately 800-1200 words.
        Return ONLY the markdown content.
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a technical expert."},
                {"role": "user", "content": prompt}
            ]
        )
        
        detailed_content = response.choices[0].message.content.strip()
        
        # Update lesson content in database
        lesson.content = detailed_content
        db.commit()
        
        return {"message": "Content generated successfully via GPT-4", "content": detailed_content}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")
