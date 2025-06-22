import re
import unicodedata
from sqlalchemy.orm import Session
from models.post import Post

# Türkçe karakter eşleştirme sözlüğü
TURKISH_CHAR_MAP = {
    'ı': 'i', 'İ': 'i',
    'ğ': 'g', 'Ğ': 'g',
    'ü': 'u', 'Ü': 'u',
    'ş': 's', 'Ş': 's',
    'ö': 'o', 'Ö': 'o',
    'ç': 'c', 'Ç': 'c'
}

def create_slug(title: str, db: Session) -> str:
    """
    Başlıktan slug oluşturur ve benzersiz olduğundan emin olur.
    """
    # Türkçe karakterleri dönüştür
    for turkish_char, english_char in TURKISH_CHAR_MAP.items():
        title = title.replace(turkish_char, english_char)
    
    # Diğer özel karakterleri kaldır
    title = unicodedata.normalize('NFKD', title).encode('ASCII', 'ignore').decode('ASCII')
    
    # Küçük harfe çevir ve özel karakterleri kaldır
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower())
    
    # Baştaki ve sondaki tireleri kaldır
    slug = slug.strip('-')
    
    # Benzersiz slug oluştur
    original_slug = slug
    counter = 1
    
    while db.query(Post).filter(Post.slug == slug).first() is not None:
        slug = f"{original_slug}-{counter}"
        counter += 1
    
    return slug 