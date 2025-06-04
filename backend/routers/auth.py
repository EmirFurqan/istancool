from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional
from pydantic import BaseModel

from database import get_db
from models.user import User
from schemas.user import UserCreate, User as UserSchema, PasswordReset, TokenResponse
from functions.auth_functions import (
    verify_password,
    get_password_hash,
    create_access_token,
    authenticate_user,
    create_reset_token,
    verify_reset_token,
    verify_token,
    get_user_by_email
)
from functions.oauth_functions import handle_google_login
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=UserSchema)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        hashed_password=hashed_password,
        role="user"  # Varsayılan rol ataması
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "is_active": user.is_active,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    }

@router.post("/forgot-password")
async def forgot_password(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    reset_token = create_reset_token(email)
    # Burada email gönderme işlemi yapılacak
    return {"message": "Password reset email sent"}

@router.post("/reset-password")
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    email = verify_reset_token(reset_data.token)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = get_password_hash(reset_data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.post("/google-login")
async def google_login(token: str, db: Session = Depends(get_db)):
    return await handle_google_login(db, token)

@router.get("/me", response_model=UserSchema)
def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Geçersiz token")
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return user 