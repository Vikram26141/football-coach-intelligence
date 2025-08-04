from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
migrate = Migrate()

class User(db.Model):
    """User model for authentication and profile management"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    matches = db.relationship('Match', backref='user', lazy=True)
    profile = db.relationship('UserProfile', backref='user', uselist=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'display_name': self.display_name,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

class UserProfile(db.Model):
    """User profile settings and preferences"""
    __tablename__ = 'user_profiles'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    analysis_preferences = db.Column(db.JSON)  # Store analysis settings
    notification_settings = db.Column(db.JSON)  # Email/notification preferences
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Match(db.Model):
    """Match model for storing video uploads and metadata"""
    __tablename__ = 'matches'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.BigInteger)  # File size in bytes
    duration = db.Column(db.Float)  # Video duration in seconds
    resolution = db.Column(db.String(20))  # e.g., "1920x1080"
    fps = db.Column(db.Float)  # Frames per second
    status = db.Column(db.String(20), default='uploaded')  # uploaded, processing, completed, failed
    processing_progress = db.Column(db.Float, default=0.0)  # 0.0 to 1.0
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Optional metadata (future Soccernet integration)
    match_date = db.Column(db.Date)
    home_team = db.Column(db.String(100))
    away_team = db.Column(db.String(100))
    competition = db.Column(db.String(100))
    score = db.Column(db.String(10))  # e.g., "2-1"
    
    # Relationships
    events = db.relationship('Event', backref='match', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'duration': self.duration,
            'resolution': self.resolution,
            'fps': self.fps,
            'status': self.status,
            'processing_progress': self.processing_progress,
            'created_at': self.created_at.isoformat(),
            'match_date': self.match_date.isoformat() if self.match_date else None,
            'home_team': self.home_team,
            'away_team': self.away_team,
            'competition': self.competition,
            'score': self.score
        }

class Event(db.Model):
    """Fast-break event model"""
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('matches.id'), nullable=False)
    event_type = db.Column(db.String(50), default='fast_break')
    start_time = db.Column(db.Float, nullable=False)  # Start time in seconds
    end_time = db.Column(db.Float, nullable=False)  # End time in seconds
    duration = db.Column(db.Float)  # Event duration in seconds
    confidence_score = db.Column(db.Float)  # ML confidence score
    zone_sum = db.Column(db.Integer)  # Sum of zones involved
    pass_count = db.Column(db.Integer)  # Number of passes in sequence
    event_data = db.Column(db.JSON)  # Detailed event data (passes, zones, etc.)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    zones = db.relationship('Zone', backref='event', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_type': self.event_type,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'duration': self.duration,
            'confidence_score': self.confidence_score,
            'zone_sum': self.zone_sum,
            'pass_count': self.pass_count,
            'event_data': self.event_data,
            'created_at': self.created_at.isoformat()
        }

class Zone(db.Model):
    """18-zone pitch mapping model"""
    __tablename__ = 'zones'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    zone_number = db.Column(db.Integer, nullable=False)  # 1-18
    x_coord = db.Column(db.Float)  # Pixel coordinates
    y_coord = db.Column(db.Float)
    timestamp = db.Column(db.Float)  # Time in video
    ball_position = db.Column(db.Boolean, default=True)  # True if ball is in this zone
    player_count = db.Column(db.Integer, default=0)  # Number of players in zone
    
    def to_dict(self):
        return {
            'id': self.id,
            'zone_number': self.zone_number,
            'x_coord': self.x_coord,
            'y_coord': self.y_coord,
            'timestamp': self.timestamp,
            'ball_position': self.ball_position,
            'player_count': self.player_count
        }

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
        db.create_all()
    
    return db 