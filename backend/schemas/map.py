from pydantic import BaseModel
from typing import Optional

class MapPost(BaseModel):
    id: int
    title: str
    content: Optional[str] = None
    cover_image: Optional[str] = None
    latitude: str
    longitude: str
    category_id: int
    category_name: str
    category_color: Optional[str] = None

    class Config:
        from_attributes = True 