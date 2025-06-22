from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.district import District, DistrictRegion
from schemas.district import District as DistrictSchema

router = APIRouter(
    prefix="/districts",
    tags=["districts"]
)

@router.get("/", response_model=List[DistrictSchema])
async def get_districts(
    region: DistrictRegion = None,
    db: Session = Depends(get_db)
):
    query = db.query(District)
    
    if region:
        query = query.filter(District.region == region)
    
    districts = query.all()
    return districts

@router.get("/{district_id}", response_model=DistrictSchema)
async def get_district(
    district_id: int,
    db: Session = Depends(get_db)
):
    district = db.query(District).filter(District.id == district_id).first()
    if not district:
        raise HTTPException(status_code=404, detail="İlçe bulunamadı")
    return district 