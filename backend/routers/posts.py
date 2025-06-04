from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models.post import Post, PostStatus
from models.user import User, UserRole
from models.category import Category
from schemas.post import PostCreate, PostUpdate, Post as PostSchema
from dependencies import get_current_active_user, get_current_admin, get_current_editor_or_admin
from services.cloudinary_service import upload_image
import json

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

@router.post("/", response_model=PostSchema)
async def create_post(
    request: Request,
    title: str = Form(...),
    slug: str = Form(...),
    content: Optional[str] = Form(None),
    category_id: int = Form(...),
    cover_image: Optional[UploadFile] = File(None),
    blocks: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Kategori kontrolü
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Kategori bulunamadı")
    if not category.is_active:
        raise HTTPException(status_code=400, detail="Kategori aktif değil")

    # Slug kontrolü
    existing_post = db.query(Post).filter(Post.slug == slug).first()
    if existing_post:
        raise HTTPException(status_code=400, detail="Bu slug zaten kullanılıyor")

    # Kapak resmini yükle
    cover_image_url = None
    if cover_image:
        cover_image_url = await upload_image(cover_image)

    # Blocks'u parse et
    try:
        blocks_data = json.loads(blocks)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Geçersiz blocks formatı")

    # Form verilerini al
    form_data = await request.form()

    # Blok resimlerini yükle
    for i, block in enumerate(blocks_data):
        if block.get('type') == 'image':
            # FormData'dan resim dosyasını al
            image_file = form_data.get(f'block_image_{i}')
            if image_file and isinstance(image_file, UploadFile):
                try:
                    # Resmi Cloudinary'ye yükle
                    image_url = await upload_image(image_file)
                    # Blok verisini güncelle
                    block['content'] = image_url
                except Exception as e:
                    print(f"Resim yükleme hatası (blok {i}): {str(e)}")
                    raise HTTPException(status_code=500, detail=f"Resim yükleme hatası: {str(e)}")

    # Yeni post oluştur
    db_post = Post(
        title=title,
        slug=slug,
        content=content,
        cover_image=cover_image_url,
        category_id=category_id,
        author_id=current_user.id,
        blocks=blocks_data,
        status=PostStatus.APPROVED if current_user.role == "admin" else PostStatus.PENDING
    )

    try:
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Post oluşturma hatası: {str(e)}")

@router.get("/", response_model=List[PostSchema])
async def get_posts(
    skip: int = 0,
    limit: int = 10,
    category_id: int = None,
    status: PostStatus = None,
    db: Session = Depends(get_db)
):
    query = db.query(Post)
    
    # Sadece onaylı yazıları göster
    query = query.filter(Post.status == PostStatus.APPROVED)
    
    if category_id:
        query = query.filter(Post.category_id == category_id)
    
    posts = query.offset(skip).limit(limit).all()
    return posts

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