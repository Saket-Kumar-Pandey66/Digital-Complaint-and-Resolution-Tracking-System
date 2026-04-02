from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from backend.models.database import db
from backend.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    name = data.get('name')
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    if not all([name, email, username, password]):
        return jsonify({"msg": "Missing required fields"}), 400
        
    if User.query.filter_by(username=username).first() or \
       User.query.filter_by(email=email).first():
        return jsonify({"msg": "Username or email already exists"}), 409
        
    hashed_password = generate_password_hash(password)
    new_user = User(
        name=name,
        email=email,
        username=username,
        password_hash=hashed_password,
        role='user'
    )
    
    if username == 'admin':
        new_user.role = 'admin'
        
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User created successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"msg": "Missing username or password"}), 400
        
    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Bad username or password"}), 401
        
    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token, user=user.to_dict()), 200
