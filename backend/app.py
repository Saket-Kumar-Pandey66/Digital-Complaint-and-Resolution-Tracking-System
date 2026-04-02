import os
import sys
# Add parent dir to path so backend can be imported as module
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from backend.config.config import Config
from backend.models.database import db
from backend.models.user import User
from backend.routes.auth import auth_bp
from backend.routes.complaints import complaints_bp
from werkzeug.security import generate_password_hash

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    JWTManager(app)
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(complaints_bp, url_prefix='/api/complaints')
    
    with app.app_context():
        db.create_all()
        # Seed an admin user if not exists
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                name='Administrator',
                email='admin@institution.edu',
                username='admin',
                password_hash=generate_password_hash('admin123'),
                role='admin'
            )
            db.session.add(admin)
            db.session.commit()
            
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=8000)
