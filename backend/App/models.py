from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, func, Boolean, Float
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String(16))
    bio = Column(String, default="")
    role = Column(String, default="user")
    joined_date = Column(DateTime(timezone=True), server_default=func.now())
    
    # Onboarding fields
    career_goal = Column(String)
    experience_level = Column(String)
    weekly_hours = Column(String)

    learning_paths = relationship("LearningPath", back_populates="creator", cascade="all, delete-orphan")
    progress = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    difficulty = Column(String)
    tags = Column(String)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="learning_paths")
    modules = relationship("Module", back_populates="learning_path", cascade="all, delete-orphan")

class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    order = Column(Integer)
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id"))
    learning_path = relationship("LearningPath", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    content = Column(Text)
    difficulty = Column(String)
    estimated_time = Column(String)
    why_it_matters = Column(Text)
    what_you_learn = Column(Text)  # Stored as JSON string
    module_id = Column(Integer, ForeignKey("modules.id"))
    module = relationship("Module", back_populates="lessons")
    progress = relationship("Progress", back_populates="lesson", cascade="all, delete-orphan")
    prerequisites = relationship("LessonPrerequisite", foreign_keys="LessonPrerequisite.lesson_id", cascade="all, delete-orphan")

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), index=True)
    completed = Column(Boolean, default=False)
    user = relationship("User", back_populates="progress")
    lesson = relationship("Lesson", back_populates="progress")

class LessonPrerequisite(Base):
    __tablename__ = "lesson_prerequisites"

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), index=True)
    prerequisite_id = Column(Integer, ForeignKey("lessons.id"), index=True)
    lesson = relationship("Lesson", foreign_keys=[lesson_id], back_populates="prerequisites")
    prerequisite = relationship("Lesson", foreign_keys=[prerequisite_id])

class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), index=True)
    time_spent = Column(Float)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="planning") 
    difficulty = Column(String)
    start_date = Column(DateTime(timezone=True), server_default=func.now())
    estimated_hours = Column(String)
    technologies = Column(String) 
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="projects")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    type = Column(String) 
    category = Column(String)
    url = Column(String)
    icon_name = Column(String)
