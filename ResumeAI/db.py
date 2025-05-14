
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Load database URL from environment variables or use default
# Database Configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:HubGit%20coding%4029@localhost/resume_db"
)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Resume Model
class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    resume_text = Column(Text, nullable=False)

# Function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to fetch resume by ID
def fetch_resume(resume_id: int):
    db = SessionLocal()
    resume = db.query(Resume).filter(Resume.id == resume_id).first()
    db.close()
    return resume