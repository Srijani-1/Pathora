from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .. import models, schemas
from ..database import get_db
from ..core.security import verify_password
from ..core.auth import generate_token

router = APIRouter()

@router.post("/login")
def login(request: schemas.UserLogin, db: Session = Depends(get_db)):
    identifier = request.identifier

    # search by hashed email/phone
    user = db.query(models.User).filter(
        (models.User.email == identifier) |
        (models.User.phone == identifier)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not registered"
        )

    # ✅ verify password
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid password"
        )

    # ✅ generate JWT token
    access_token = generate_token(
        data={"sub": str(user.id), "role": user.role}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,  # decrypt for API response
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "is_onboarded": user.is_onboarded
        }
    }
