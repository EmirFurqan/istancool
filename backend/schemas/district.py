from pydantic import BaseModel
from models.district import DistrictRegion
from typing import Optional

class DistrictBase(BaseModel):
    name: str
    region: str

class DistrictCreate(DistrictBase):
    pass

class DistrictUpdate(BaseModel):
    name: Optional[str] = None
    region: Optional[str] = None
    is_active: Optional[bool] = None

class District(DistrictBase):
    id: int
    slug: str
    is_active: bool

    class Config:
        from_attributes = True 