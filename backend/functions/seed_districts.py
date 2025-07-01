from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.district import District, DistrictRegion
from config import DATABASE_URL
import unicodedata

# Veritabanı bağlantısı
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def slugify(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    value = value.lower().replace('ı', 'i').replace('ç', 'c').replace('ş', 's').replace('ğ', 'g').replace('ü', 'u').replace('ö', 'o')
    value = value.replace(' ', '-')
    value = ''.join(char for char in value if char.isalnum() or char == '-')
    return value

# İstanbul ilçeleri
districts = [
    # Avrupa Yakası
    {"name": "Adalar", "region": DistrictRegion.EUROPE},
    {"name": "Arnavutköy", "region": DistrictRegion.EUROPE},
    {"name": "Ataşehir", "region": DistrictRegion.EUROPE},
    {"name": "Avcılar", "region": DistrictRegion.EUROPE},
    {"name": "Bağcılar", "region": DistrictRegion.EUROPE},
    {"name": "Bahçelievler", "region": DistrictRegion.EUROPE},
    {"name": "Bakırköy", "region": DistrictRegion.EUROPE},
    {"name": "Başakşehir", "region": DistrictRegion.EUROPE},
    {"name": "Bayrampaşa", "region": DistrictRegion.EUROPE},
    {"name": "Beşiktaş", "region": DistrictRegion.EUROPE},
    {"name": "Beylikdüzü", "region": DistrictRegion.EUROPE},
    {"name": "Beyoğlu", "region": DistrictRegion.EUROPE},
    {"name": "Büyükçekmece", "region": DistrictRegion.EUROPE},
    {"name": "Çatalca", "region": DistrictRegion.EUROPE},
    {"name": "Çekmeköy", "region": DistrictRegion.EUROPE},
    {"name": "Esenler", "region": DistrictRegion.EUROPE},
    {"name": "Esenyurt", "region": DistrictRegion.EUROPE},
    {"name": "Eyüp", "region": DistrictRegion.EUROPE},
    {"name": "Fatih", "region": DistrictRegion.EUROPE},
    {"name": "Gaziosmanpaşa", "region": DistrictRegion.EUROPE},
    {"name": "Güngören", "region": DistrictRegion.EUROPE},
    {"name": "Kağıthane", "region": DistrictRegion.EUROPE},
    {"name": "Küçükçekmece", "region": DistrictRegion.EUROPE},
    {"name": "Sarıyer", "region": DistrictRegion.EUROPE},
    {"name": "Silivri", "region": DistrictRegion.EUROPE},
    {"name": "Sultangazi", "region": DistrictRegion.EUROPE},
    {"name": "Şişli", "region": DistrictRegion.EUROPE},
    {"name": "Zeytinburnu", "region": DistrictRegion.EUROPE},
    
    # Anadolu Yakası
    {"name": "Beykoz", "region": DistrictRegion.ASIA},
    {"name": "Kadıköy", "region": DistrictRegion.ASIA},
    {"name": "Kartal", "region": DistrictRegion.ASIA},
    {"name": "Maltepe", "region": DistrictRegion.ASIA},
    {"name": "Pendik", "region": DistrictRegion.ASIA},
    {"name": "Sancaktepe", "region": DistrictRegion.ASIA},
    {"name": "Sultanbeyli", "region": DistrictRegion.ASIA},
    {"name": "Şile", "region": DistrictRegion.ASIA},
    {"name": "Tuzla", "region": DistrictRegion.ASIA},
    {"name": "Ümraniye", "region": DistrictRegion.ASIA},
    {"name": "Üsküdar", "region": DistrictRegion.ASIA}
]

def seed_districts():
    try:
        # Mevcut ilçeleri temizle
        db.query(District).delete()
        
        # Yeni ilçeleri ekle
        for district_data in districts:
            slug = slugify(district_data['name'])
            district = District(name=district_data['name'], region=district_data['region'], slug=slug)
            db.add(district)
        
        db.commit()
        print("İlçeler başarıyla eklendi!")
    except Exception as e:
        db.rollback()
        print(f"Hata oluştu: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_districts() 