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
                    "url": "URL",
                    "duration": "e.g. 15 mins"
                }}
            ]
        }}
        
        CRITICAL RULES FOR URLS:
        1. We will resolve specific URLs on the backend to ensure they are valid.
        2. In the 'url' field, provide a specific SEARCH QUERY prefixed with 'SEARCH:'.
        3. Examples:
           - "url": "SEARCH: React useEffect hook tutorial" (for video)
           - "url": "SEARCH: MDN Array map documentation" (for article)
        4. Make the query very specific to get the best top result.
        
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
        
        # --- SERVER-SIDE URL RESOLUTION ---
        from youtubesearchpython import VideosSearch
        from googlesearch import search as gsearch
        
        for res in resources_data:
            url_val = res.get("url", "").strip()
            if url_val.startswith("SEARCH:"):
                query = url_val.replace("SEARCH:", "").strip()
                resolved_url = None
                
                try:
                    if "video" in res.get("type", "").lower():
                        # Search YouTube
                        videosSearch = VideosSearch(query, limit = 1)
                        results = videosSearch.result()
                        if results and results['result']:
                            resolved_url = results['result'][0]['link']
                    else:
                        # Search Google (Articles/Docs/Practice)
                        # num_results/advanced might vary by version, using simple iterator
                        search_results = list(gsearch(query, num_results=1, advanced=True))
                        if search_results:
                            resolved_url = search_results[0].url
                except Exception as e:
                    print(f"Search resolution failed for '{query}': {e}")
                
                # Assign resolved URL or fallback to search page
                if resolved_url:
                    res["url"] = resolved_url
                else:
                     # Fallback to search result page if resolution fails
                    if "video" in res.get("type", "").lower():
                        res["url"] = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
                    else:
                        res["url"] = f"https://www.google.com/search?q={query.replace(' ', '+')}"
        # ----------------------------------
        
        # Update lesson in database
        lesson.content = detailed_content
        lesson.why_it_matters = why_it_matters
        lesson.what_you_learn = what_you_learn
        lesson.ai_resources = json.dumps(resources_data)
        
        db.commit()
        
        return {
            "message": "Content generated successfully via GPT-4 with Real-Time Validation", 
            "content": detailed_content,
            "why_it_matters": why_it_matters,
            "what_you_learn": data.get("what_you_learn", []),
            "resources": resources_data
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")

@router.post("/chat", response_model=schemas.ChatResponse)
async def chat_with_ai(req: schemas.ChatRequest):
    client = get_openai_client()

    messages = [
        {
            "role": "system",
            "content": "You are an AI learning assistant helping students with programming, planning, and career guidance."
        }
    ]

    for msg in req.history:
        messages.append({
            "role": "user" if msg.isUser else "assistant",
            "content": msg.text
        })

    messages.append({
        "role": "user",
        "content": req.message
    })

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages
    )

    return {
        "reply": response.choices[0].message.content.strip()
    }
