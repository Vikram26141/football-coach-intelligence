from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import logging
from pathlib import Path

# Import configurations and services
from config.settings import config
from services.db import db, init_db

# Import route blueprints
from api.routes.auth import auth_bp
from api.routes.user import user_bp
from api.routes.coach import coach_bp

def create_app(config_name='default'):
    """
    Flask application factory
    
    Args:
        config_name: Configuration name ('development', 'production', 'testing')
        
    Returns:
        Flask application instance
    """
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    init_extensions(app)
    
    # Setup logging
    setup_logging(app)
    
    # Register blueprints
    register_blueprints(app)
    
    # Create necessary directories
    create_directories(app)
    
    return app

def init_extensions(app):
    """Initialize Flask extensions"""
    
    # Initialize database
    init_db(app)
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    # Initialize CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"message": "Token has expired"}, 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {"message": "Invalid token"}, 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {"message": "Missing authorization token"}, 401

def setup_logging(app):
    """Setup application logging"""
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Configure logging
    logging.basicConfig(
        level=getattr(logging, app.config.get('LOG_LEVEL', 'INFO')),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(app.config.get('LOG_FILE', 'logs/app.log')),
            logging.StreamHandler()
        ]
    )

def register_blueprints(app):
    """Register Flask blueprints"""
    
    # API routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(coach_bp, url_prefix='/api/coach')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        return {"status": "healthy", "message": "Football Coach API is running"}

def create_directories(app):
    """Create necessary directories for the application"""
    
    directories = [
        app.config.get('UPLOAD_FOLDER', 'backend/data/raw'),
        'backend/data/labels',
        'backend/models/yolov8',
        'logs',
        'temp'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)

# Error handlers
def register_error_handlers(app):
    """Register error handlers"""
    
    @app.errorhandler(404)
    def not_found(error):
        return {"message": "Resource not found"}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return {"message": "Internal server error"}, 500
    
    @app.errorhandler(413)
    def file_too_large(error):
        return {"message": "File too large"}, 413

if __name__ == '__main__':
    # Create and run the application
    app = create_app('development')
    register_error_handlers(app)
    
    host = app.config.get('API_HOST', '0.0.0.0')
    port = app.config.get('API_PORT', 5000)
    debug = app.config.get('DEBUG', True)
    
    print(f"Starting Football Coach API on {host}:{port}")
    app.run(host=host, port=port, debug=debug) 