import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

# Cloudinary yapılandırması
cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET
)

async def upload_image(file: UploadFile, folder: str = "blog_images") -> str:
    """
    Resmi Cloudinary'ye yükler ve URL'ini döndürür
    """
    try:
        # Dosyayı oku
        file_content = await file.read()
        
        # Cloudinary'ye yükle
        result = cloudinary.uploader.upload(
            file_content,
            folder=folder,
            resource_type="auto",
            transformation=[
                {
                    "width": 1200,  # Maksimum genişlik
                    "height": 800,  # Maksimum yükseklik
                    "crop": "limit",  # Oranı koru ve limitleri aşma
                    "quality": "auto",  # Otomatik kalite optimizasyonu
                    "fetch_format": "auto"  # Otomatik format optimizasyonu
                }
            ]
        )
        
        # Güvenli URL'i döndür
        return result["secure_url"]
    except Exception as e:
        raise Exception(f"Resim yükleme hatası: {str(e)}") 