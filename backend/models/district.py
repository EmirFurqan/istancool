from sqlalchemy import Column, Integer, String, Boolean, Enum
from database import Base
import enum

class DistrictRegion(enum.Enum):
    EUROPE = "europe"
    ASIA = "asia"

class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    region = Column(Enum(DistrictRegion))
    is_active = Column(Boolean, default=True) 