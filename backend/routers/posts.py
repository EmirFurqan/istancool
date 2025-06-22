from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.post import Post, PostStatus
from models.user import User, UserRole
from models.category import Category
from models.district import District
from schemas.post import PostCreate, PostUpdate, Post as PostSchema, FeaturedPostSchema
from schemas.map import MapPost
from dependencies import get_current_active_user, get_current_admin, get_current_editor_or_admin
from services.cloudinary_service import upload_image
from services.slug_service import create_slug
import json

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

@router.post("/", response_model=PostSchema)
async def create_post(
    request: Request,
    title: str = Form(...),
    content: Optional[str] = Form(None),
    category_id: int = Form(...),
    district_id: Optional[int] = Form(None),
    latitude: Optional[str] = Form(None),
    longitude: Optional[str] = Form(None),
    cover_image: Optional[UploadFile] = File(None),
    blocks: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category or not category.is_active:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı veya pasif")

    # İlçe kontrolü
    if district_id:
        district = db.query(District).filter(District.id == district_id).first()
        if not district:
            raise HTTPException(status_code=404, detail="İlçe bulunamadı")

    # Başlıktan otomatik slug oluştur
    slug = create_slug(title, db)
    
    # Slug'ın benzersiz olduğundan emin ol
    base_slug = slug
    counter = 1
    while db.query(Post).filter(Post.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    cover_image_url = None
    if cover_image:
        cover_image_url = await upload_image(cover_image)

    try:
        blocks_data = json.loads(blocks)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Geçersiz blocks formatı")

    form_data = await request.form()
    blocks_raw = form_data.get("blocks")
    blocks = json.loads(blocks_raw)

    # Blocks içindeki resimleri Cloudinary'ye yükle
    for i, block in enumerate(blocks):
        if block.get("type") == "image":
            file_key = f"block_image_{i}"
            if file_key in form_data:
                file: UploadFile = form_data[file_key]
                if file:
                    url = await upload_image(file)
                    block["src"] = url
        elif block.get("type") == "grid":
            # Grid içindeki blokları işle
            for j, grid_block in enumerate(block.get("blocks", [])):
                if grid_block.get("type") == "image":
                    file_key = f"grid_{i}_block_image_{j}"
                    if file_key in form_data:
                        file: UploadFile = form_data[file_key]
                        if file:
                            url = await upload_image(file)
                            grid_block["src"] = url
                            if "content" in grid_block:
                                del grid_block["content"]

    db_post = Post(
        title=title,
        slug=slug,
        content=content,
        cover_image=cover_image_url,
        category_id=category_id,
        district_id=district_id,
        latitude=latitude,
        longitude=longitude,
        author_id=current_user.id,
        blocks=blocks,
        status=PostStatus.APPROVED if current_user.role == "admin" else PostStatus.PENDING
    )

    try:
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Post oluşturulamadı: {str(e)}")


@router.get("/", response_model=List[PostSchema])
async def get_posts(
    category_name: Optional[str] = None,
    district_name: Optional[str] = None,
    search: Optional[str] = None,
    status: PostStatus = None,
    db: Session = Depends(get_db)
):
    query = db.query(Post)
    
    # Sadece onaylı yazıları göster
    query = query.filter(Post.status == PostStatus.APPROVED)
    
    # Kategori filtresi (isimle)
    if category_name:
        query = query.join(Post.category).filter(Category.name.ilike(f"%{category_name}%"))
    
    # İlçe filtresi (isimle)
    if district_name:
        query = query.join(Post.district).filter(District.name.ilike(f"%{district_name}%"))
    
    # Arama filtresi
    if search:
        search = f"%{search}%"
        query = query.filter(
            (Post.title.ilike(search)) |
            (Post.content.ilike(search))
        )
    
    posts = query
    return posts

@router.get("/featured", response_model=List[FeaturedPostSchema])
async def get_featured_posts(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    posts = db.query(Post).filter(
        Post.is_featured == True,
        Post.status == PostStatus.APPROVED,
        Post.is_active == True
    ).offset(skip).limit(limit).all()

    # Sadece gerekli alanları dön
    result = []
    for post in posts:
        # Blocks içinden metin içeriğini çıkar
        summary = ""
        if post.blocks:
            for block in post.blocks:
                if block.get('type') == 'text' and block.get('content'):
                    summary += block['content'] + " "
                    if len(summary) > 100:
                        summary = summary[:100] + "..."
                        break

        result.append({
            "id": post.id,
            "title": post.title,
            "cover_image": post.cover_image,
            "category": {"name": post.category.name} if post.category else None,
            "summary": summary,
            "slug": post.slug
        })
    return result

@router.get("/map-posts", response_model=List[MapPost])
def get_map_posts(db: Session = Depends(get_db)):
    """
    Haritada gösterilecek postları getirir.
    Sadece aktif ve konum bilgisi olan postları döndürür.
    """
    posts = db.query(Post).join(Post.category).filter(
        Post.is_active == True,
        Post.latitude.isnot(None),
        Post.longitude.isnot(None)
    ).all()
    
    # Her post için kategori adını ekle
    result = []
    for post in posts:
        post_dict = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "cover_image": post.cover_image,
            "latitude": post.latitude,
            "longitude": post.longitude,
            "category_id": post.category_id,
            "category_name": post.category.name if post.category else None,
            "category_color": post.category.color if post.category else None
        }
        result.append(post_dict)
    
    return result

@router.get("/{post_id}", response_model=PostSchema)
async def get_post(
    post_id: int,
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Sadece onaylı yazıları göster
    if post.status != PostStatus.APPROVED:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return post

@router.get("/admin/list", response_model=List[PostSchema])
async def get_all_posts(
    skip: int = 0,
    limit: int = 10,
    category_id: int = None,
    status: PostStatus = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_editor_or_admin)
):
    query = db.query(Post)
    
    if status:
        query = query.filter(Post.status == status)
    
    if category_id:
        query = query.filter(Post.category_id == category_id)
    
    posts = query.offset(skip).limit(limit).all()
    return posts

@router.put("/{post_id}", response_model=PostSchema)
async def update_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Sadece yazar, editör veya admin güncelleyebilir
    if db_post.author_id != current_user.id and current_user.role not in [UserRole.EDITOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Kategori kontrolü
    if post_update.category_id:
        category = db.query(Category).filter(Category.id == post_update.category_id).first()
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        if not category.is_active:
            raise HTTPException(status_code=400, detail="Category is not active")
    
    # Slug kontrolü
    if post_update.slug:
        existing_post = db.query(Post).filter(Post.slug == post_update.slug, Post.id != post_id).first()
        if existing_post:
            raise HTTPException(status_code=400, detail="Post with this slug already exists")
    
    update_data = post_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_post, field, value)
    
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/{post_id}")
async def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Sadece yazar, editör veya admin silebilir
    if db_post.author_id != current_user.id and current_user.role not in [UserRole.EDITOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted successfully"}

@router.patch("/{post_id}/toggle-status")
async def toggle_post_status(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Sadece yazar, editör veya admin durumu değiştirebilir
    if db_post.author_id != current_user.id and current_user.role not in [UserRole.EDITOR, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_post.is_active = not db_post.is_active
    db.commit()
    db.refresh(db_post)
    return {"message": f"Post status changed to {'active' if db_post.is_active else 'inactive'}"}

@router.patch("/{post_id}/approve")
async def approve_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_post.status = PostStatus.APPROVED
    db.commit()
    db.refresh(db_post)
    return {"message": "Post approved successfully"}

@router.patch("/{post_id}/reject")
async def reject_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_post.status = PostStatus.REJECTED
    db.commit()
    db.refresh(db_post)
    return {"message": "Post rejected successfully"}

@router.patch("/{post_id}/toggle-featured")
async def toggle_featured_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_editor_or_admin)
):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    db_post.is_featured = not db_post.is_featured
    db.commit()
    db.refresh(db_post)
    return {"message": f"Post featured status changed to {'featured' if db_post.is_featured else 'not featured'}"}

@router.get("/slug/{slug}", response_model=PostSchema)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post bulunamadı")
    return post