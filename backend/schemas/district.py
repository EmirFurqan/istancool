from pydantic import BaseModel
from models.district import DistrictRegion

class District(BaseModel):
    id: int
    name: str
    region: DistrictRegion
    is_active: bool

    class Config:
        from_attributes = True 