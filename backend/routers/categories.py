from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.category import Category
from models.user import User
from schemas.category import CategoryCreate, CategoryUpdate, Category as CategorySchema
from dependencies import get_current_admin
from services.slug_service import create_slug

router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)

@router.post("/", response_model=CategorySchema)
async def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    slug = create_slug(category.name, db)
    db_category_by_slug = db.query(Category).filter(Category.slug == slug).first()
    if db_category_by_slug:
        raise HTTPException(status_code=400, detail="Category with this slug already exists")
    
    db_category_by_name = db.query(Category).filter(Category.name == category.name).first()
    if db_category_by_name:
        raise HTTPException(status_code=400, detail="Category with this name already exists")

    db_category = Category(**category.model_dump(), slug=slug)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/homepage", response_model=List[CategorySchema])
async def get_homepage_categories(db: Session = Depends(get_db)):
    """Anasayfada gösterilecek aktif kategorileri getirir."""
    categories = db.query(Category).filter(
        Category.is_active == True,
        Category.show_on_homepage == True
    ).all()
    return categories

@router.get("/", response_model=List[CategorySchema])
async def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    categories = db.query(Category).offset(skip).limit(limit).all()
    return categories

@router.get("/count")
def get_categories_count(
    db: Session = Depends(get_db)
):
    count = db.query(Category).count()
    return {"count": count}

@router.get("/{category_id}", response_model=CategorySchema)
async def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/{category_id}", response_model=CategorySchema)
async def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_update.model_dump(exclude_unset=True)

    if 'name' in update_data and update_data['name'] != db_category.name:
        new_slug = create_slug(update_data['name'], db)
        existing_category = db.query(Category).filter(Category.slug == new_slug, Category.id != category_id).first()
        if existing_category:
            raise HTTPException(status_code=400, detail="A category with the new generated slug already exists.")
        db_category.slug = new_slug

    for field, value in update_data.items():
        setattr(db_category, field, value)
    
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}")
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db.delete(db_category)
    db.commit()
    return {"message": "Category deleted successfully"}

@router.patch("/{category_id}/toggle-homepage", response_model=CategorySchema)
async def toggle_category_homepage_status(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Kategorinin anasayfada gösterilip gösterilmeyeceğini değiştirir."""
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_category.show_on_homepage = not db_category.show_on_homepage
    db.commit()
    db.refresh(db_category)
    return db_category

@router.patch("/{category_id}/toggle-status")
async def toggle_category_status(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    db_category.is_active = not db_category.is_active
    db.commit()
    db.refresh(db_category)
    return {"message": f"Category status changed to {'active' if db_category.is_active else 'inactive'}"} 