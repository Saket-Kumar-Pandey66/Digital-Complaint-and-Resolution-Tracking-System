import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Use SQLite by default, pointing to the database directory in the project root
    basedir = os.path.abspath(os.path.dirname(__file__))
    project_root = os.path.dirname(os.path.dirname(basedir))
    default_db_path = os.path.join(project_root, 'database', 'complaints.db')
    
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", f"sqlite:///{default_db_path}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "academic-project-super-secret-key")
