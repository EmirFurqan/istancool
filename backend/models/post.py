from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Text, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from database import Base
from datetime import datetime

class PostStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, nullable=False)
    content = Column(Text)
    cover_image = Column(String)
    status = Column(Enum(PostStatus), default=PostStatus.PENDING)
    is_active = Column(Boolean, default=True)
    
    # İlişkiler
    category_id = Column(Integer, ForeignKey("categories.id"))
    category = relationship("Category", back_populates="posts")
    
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    blocks = Column(JSON) 