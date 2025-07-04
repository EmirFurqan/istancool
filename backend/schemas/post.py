from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any
from .category import Category
from .user import User
from models.post import PostStatus
from .district import District

class PostBase(BaseModel):
    title: str
    slug: str
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category_id: int
    district_id: Optional[int] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    blocks: List[Dict[str, Any]]

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    category_id: Optional[int] = None
    district_id: Optional[int] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    status: Optional[PostStatus] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    featured_order: Optional[int] = None
    blocks: Optional[List[Dict[str, Any]]] = None

class Post(PostBase):
    id: int
    status: PostStatus
    is_active: bool
    is_featured: bool
    featured_order: Optional[int] = None
    author_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # İlişkiler
    category: Category
    author: User
    district: Optional[District] = None
    blocks: Optional[List[Dict[str, Any]]] = None

    class Config:
        from_attributes = True

class CategoryShort(BaseModel):
    name: str
    color: Optional[str] = None

class FeaturedPostSchema(BaseModel):
    id: int
    title: str
    slug: str
    cover_image: Optional[str]
    category: Category
    summary: Optional[str]

    class Config:
        from_attributes = True 