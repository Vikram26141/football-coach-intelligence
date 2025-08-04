from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from services.db import db, User, UserProfile
import re
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """
    User registration endpoint
    
    Expected JSON:
    {
        "username": "string",
        "email": "string", 
        "password": "string",
        "display_name": "string" (optional)
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        required_fields = ['username', 'email', 'password']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        display_name = data.get('display_name', '').strip()
        
        # Validate username
        if len(username) < 3 or len(username) > 20:
            return jsonify({"error": "Username must be between 3 and 20 characters"}), 400
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return jsonify({"error": "Username can only contain letters, numbers, and underscores"}), 400
        
        # Validate email
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Validate password
        if len(password) < 8:
            return jsonify({"error": "Password must be at least 8 characters long"}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=username).first():
            return jsonify({"error": "Username already exists"}), 409
        
        # Check if email already exists
        if User.query.filter_by(email=email).first():
            return jsonify({"error": "Email already registered"}), 409
        
        # Create new user
        user = User(
            username=username,
            email=email,
            display_name=display_name or username
        )
        user.set_password(password)
        
        # Create user profile
        profile = UserProfile(user_id=user.id)
        
        # Save to database
        db.session.add(user)
        db.session.add(profile)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        logger.info(f"New user registered: {username}")
        
        return jsonify({
            "message": "User registered successfully",
            "access_token": access_token,
            "user": user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error during signup: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    """
    User login endpoint
    
    Expected JSON:
    {
        "username": "string" (or "email": "string"),
        "password": "string"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Get credentials
        username_or_email = data.get('username') or data.get('email')
        password = data.get('password')
        
        if not username_or_email or not password:
            return jsonify({"error": "Username/email and password are required"}), 400
        
        # Find user by username or email
        user = None
        if '@' in username_or_email:
            user = User.query.filter_by(email=username_or_email.lower()).first()
        else:
            user = User.query.filter_by(username=username_or_email).first()
        
        # Check if user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid username/email or password"}), 401
        
        # Check if user is active
        if not user.is_active:
            return jsonify({"error": "Account is deactivated"}), 401
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        logger.info(f"User signed in: {user.username}")
        
        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error during signin: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "user": user.to_dict(),
            "profile": user.profile.analysis_preferences if user.profile else None
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting profile: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    Update user profile
    
    Expected JSON:
    {
        "display_name": "string" (optional),
        "analysis_preferences": "object" (optional)
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Update display name
        if 'display_name' in data:
            display_name = data['display_name'].strip()
            if display_name and len(display_name) <= 100:
                user.display_name = display_name
        
        # Update analysis preferences
        if 'analysis_preferences' in data and user.profile:
            user.profile.analysis_preferences = data['analysis_preferences']
        
        db.session.commit()
        
        logger.info(f"Profile updated for user: {user.username}")
        
        return jsonify({
            "message": "Profile updated successfully",
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating profile: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change user password
    
    Expected JSON:
    {
        "current_password": "string",
        "new_password": "string"
    }
    """
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        if not current_password or not new_password:
            return jsonify({"error": "Current password and new password are required"}), 400
        
        # Verify current password
        if not user.check_password(current_password):
            return jsonify({"error": "Current password is incorrect"}), 401
        
        # Validate new password
        if len(new_password) < 8:
            return jsonify({"error": "New password must be at least 8 characters long"}), 400
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        logger.info(f"Password changed for user: {user.username}")
        
        return jsonify({"message": "Password changed successfully"}), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error changing password: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@auth_bp.route('/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    """Validate JWT token and return user info"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "valid": True,
            "user": user.to_dict()
        }), 200
        
    except Exception as e:
        logger.error(f"Error validating token: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500 