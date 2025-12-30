from pydantic import BaseModel, EmailStr, ConfigDict
from enum import Enum
from typing import Optional, List, Dict
from datetime import datetime

class RoleEnum(str, Enum):
    student = "Student"
    admin = "Admin"

class UserBase(BaseModel):
    full_name : str
    email : EmailStr
    phone : str
    role : RoleEnum

class UserCreate(UserBase):
    password : str

def decrypt(value: str) -> str:
    return value  

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    role: RoleEnum
    model_config = ConfigDict(from_attributes=True)

class UserProfile(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    bio: str | None = ""
    joined_date: datetime
    career_goal: Optional[str] = None
    experience_level: Optional[str] = None
    weekly_hours: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    career_goal: Optional[str] = None
    experience_level: Optional[str] = None
    weekly_hours: Optional[str] = None

class UserLogin(BaseModel):
    identifier : str
    password : str

class Token(BaseModel):
    access_token : str
    token_type : str

class TokenData(BaseModel):
    identifier : Optional[str] = None

class LessonCreate(BaseModel):
    title: str
    content: str
    difficulty: str
    estimated_time: str
    module_id: int

class LessonOut(BaseModel):
    id: int
    title: str
    content: str 
    difficulty: str
    estimated_time: str
    why_it_matters: Optional[str] = None
    what_you_learn: Optional[str] = None
    ai_resources: Optional[str] = None
    status: Optional[str] = "upcoming"
    prerequisites_list: List[str] = []

    model_config = ConfigDict(from_attributes=True)

class ModuleCreate(BaseModel):
    title: str
    order: int
    learning_path_id: int

class ModuleOut(BaseModel):
    id: int
    title: str
    order: int
    lessons: List[LessonOut]
    
    model_config = ConfigDict(from_attributes=True)

class LearningPathCreate(BaseModel):
    title: str
    description: str
    difficulty: str
    
class LearningPathOut(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    modules: List[ModuleOut]

    model_config = ConfigDict(from_attributes=True)

class ProjectCreate(BaseModel):
    title: str
    description: str
    difficulty: str
    estimated_hours: str
    technologies: str
    files: Optional[Dict[str, str]] = None # Add this

class ProjectOut(BaseModel):
    id: int
    title: str
    description: str
    status: str
    difficulty: str
    start_date: datetime
    estimated_hours: str
    technologies: str
    files: Optional[Dict[str, str]] = {} # Add this
    user_id: int

    model_config = ConfigDict(from_attributes=True)

class ResourceCreate(BaseModel):
    title: str
    description: str
    type: str
    category: str
    url: str
    icon_name: str

class ResourceOut(BaseModel):
    id: int
    title: str
    description: str
    type: str
    category: str
    url: str
    icon_name: str

    model_config = ConfigDict(from_attributes=True)

class ProgressCreate(BaseModel):
    lesson_id: int
    completed: bool

class PathGenerationRequest(BaseModel):
    topic: str
    difficulty: str
    weeks: int
    hours_per_week: int
    user_id: int

class LessonContentRequest(BaseModel):
    lesson_id: int

class ChatMessage(BaseModel):
    text: str
    isUser: bool

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    reply: str

class QuizRequest(BaseModel):
    topic: str
    difficulty: str
    question_count: int = 5

class QuizQuestion(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_index: int
    explanation: str

class QuizResponse(BaseModel):
    title: str
    questions: List[QuizQuestion]
