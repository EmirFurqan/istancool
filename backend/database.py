from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# .env dosyasını yükle
load_dotenv()

# Veritabanı URL'sini al
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Engine oluştur
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session oluştur
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class oluştur
Base = declarative_base()

# Veritabanı bağlantısı için dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 