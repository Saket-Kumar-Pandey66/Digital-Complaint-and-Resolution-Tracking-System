from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models.database import db
from backend.models.user import User
from backend.models.complaint import Complaint

complaints_bp = Blueprint('complaints', __name__)

@complaints_bp.route('', methods=['POST'])
@jwt_required()
def create_complaint():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    title = data.get('title')
    category = data.get('category')
    priority = data.get('priority')
    description = data.get('description')
    
    if not all([title, category, priority, description]):
        return jsonify({"msg": "Missing fields"}), 400
        
    new_complaint = Complaint(
        user_id=user_id,
        title=title,
        category=category,
        priority=priority,
        description=description,
        status='Pending'
    )
    
    db.session.add(new_complaint)
    db.session.commit()
    
    return jsonify(new_complaint.to_dict()), 201

@complaints_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_complaints():
    user_id = int(get_jwt_identity())
    complaints = Complaint.query.filter_by(user_id=user_id, is_archived=False).order_by(Complaint.created_at.desc()).all()
    return jsonify([c.to_dict() for c in complaints]), 200

@complaints_bp.route('', methods=['GET'])
@jwt_required()
def get_all_complaints():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    
    if not user or user.role != 'admin':
        return jsonify({"msg": "Admin access required"}), 403
        
    complaints = Complaint.query.order_by(Complaint.created_at.desc()).all()
    return jsonify([c.to_dict() for c in complaints]), 200

@complaints_bp.route('/<int:comp_id>/status', methods=['PUT'])
@jwt_required()
def update_status(comp_id):
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
    
    if not user or user.role != 'admin':
        return jsonify({"msg": "Admin access required"}), 403
        
    complaint = db.session.get(Complaint, comp_id)
    if not complaint:
        return jsonify({"msg": "Complaint not found"}), 404
        
    data = request.get_json()
    new_status = data.get('status')
    
    if new_status in ['Pending', 'In Progress', 'Resolved', 'Reopened']:
        complaint.status = new_status
        if new_status == 'Resolved':
            complaint.user_verified = False
        db.session.commit()
        return jsonify(complaint.to_dict()), 200
        
    return jsonify({"msg": "Invalid status"}), 400

@complaints_bp.route('/<int:comp_id>/verify', methods=['PUT'])
@jwt_required()
def verify_resolution(comp_id):
    user_id = int(get_jwt_identity())
    complaint = db.session.get(Complaint, comp_id)
    
    if not complaint:
        return jsonify({"msg": "Complaint not found"}), 404
        
    if complaint.user_id != user_id:
        return jsonify({"msg": "Not authorized to verify this complaint"}), 403
        
    data = request.get_json()
    verified = data.get('verified')
    
    if verified is True:
        complaint.user_verified = True
        complaint.is_archived = True
    elif verified is False:
        complaint.status = "Reopened"
        complaint.user_verified = False
        
    db.session.commit()
    return jsonify(complaint.to_dict()), 200
