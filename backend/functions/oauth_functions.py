from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.user import User
from functions.auth_functions import create_access_token, get_password_hash
from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

async def verify_google_token(token: str) -> dict:
    try:
        # Google token doğrulama işlemi burada yapılacak
        # Bu örnek için basit bir yapı kullanıyoruz
        return {"email": "user@example.com", "name": "Google User"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )

async def handle_google_login(db: Session, token: str):
    user_data = await verify_google_token(token)
    
    # Kullanıcı var mı kontrol et
    user = db.query(User).filter(User.email == user_data["email"]).first()
    
    if not user:
        # Yeni kullanıcı oluştur
        user = User(
            email=user_data["email"],
            first_name=user_data["name"],
            last_name="",
            hashed_password=get_password_hash("google_oauth"),  # Rastgele şifre
            is_google_oauth=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Access token oluştur
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    } 