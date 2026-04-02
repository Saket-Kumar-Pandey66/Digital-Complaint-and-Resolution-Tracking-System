from backend.models.database import db
from datetime import datetime

class Complaint(db.Model):
    __tablename__ = 'complaints'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Pending') # Pending, In Progress, Resolved, Reopened
    user_verified = db.Column(db.Boolean, default=False)
    is_archived = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': f"CMP-{self.id:04d}", # formatted id like frontend expects
            'db_id': self.id,
            'user_id': self.user_id,
            'submittedBy': self.user.username if self.user else 'Unknown',
            'name': self.user.name if self.user else 'Unknown',
            'email': self.user.email if self.user else 'Unknown',
            'title': self.title,
            'category': self.category,
            'priority': self.priority,
            'description': self.description,
            'status': self.status,
            'user_verified': self.user_verified,
            'is_archived': self.is_archived,
            'created_at': self.created_at.isoformat(),
            'date': self.created_at.strftime("%d %b %Y")
        }
