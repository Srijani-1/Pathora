from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from sqlalchemy.exc import IntegrityError
from ..models import User
from .. import schemas
from ..core.security import hash_password

router = APIRouter()

@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    print(f"DEBUG: Registering user {user.email}")
    # check duplicates directly on plain email/phone
    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        print(f"DEBUG: Email {user.email} already exists")
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_phone = db.query(User).filter(User.phone == user.phone).first()
    if existing_phone:
        print(f"DEBUG: Phone {user.phone} already exists")
        raise HTTPException(status_code=400, detail="Phone number already registered")

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        hashed_password=hash_password(user.password),
        role=user.role,
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"DEBUG: User {user.email} created successfully")
    except Exception as e:
        db.rollback()
        print(f"DEBUG: Error during registration: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")

    return {"message": "User registered successfully"}