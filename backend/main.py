from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, categories, posts, districts

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

app = FastAPI(title="istancool Blog API", description="Blog sitesi için REST API")

# CORS ayarları
origins = [
    "http://localhost:3000",  # Frontend URL'i
    "http://localhost:8000",
    "https://istancool.vercel.app",  # Backend URL'i
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları ekle
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(posts.router)
app.include_router(districts.router)

@app.get("/")
async def root():
    return {"message": "Blog API'ye Hoş Geldiniz!"}
