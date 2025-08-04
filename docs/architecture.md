# Football Coach Intelligence - Architecture Documentation

## Overview

Football Coach Intelligence is a full-stack web application that uses computer vision and machine learning to analyze football matches and detect fast-break events. The system consists of a React frontend, Flask backend, and YOLOv8-based object detection pipeline.

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Flask Backend │    │   ML Pipeline   │
│                 │    │                 │    │                 │
│ - User Interface│◄──►│ - REST API      │◄──►│ - YOLOv8        │
│ - Video Upload  │    │ - Authentication│    │ - Object Tracking│
│ - Analytics     │    │ - File Storage  │    │ - Event Detection│
│ - Reports       │    │ - Database      │    │ - Zone Mapping  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.8.1
- **State Management**: React Query 3.39.3
- **Styling**: Styled Components 5.3.9
- **HTTP Client**: Axios 1.3.4
- **Charts**: Chart.js 4.2.1 + React Chart.js 2
- **Video**: React Player 2.12.0
- **File Upload**: React Dropzone 14.2.3

#### Backend
- **Framework**: Flask 2.3.3
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **Authentication**: JWT (Flask-JWT-Extended)
- **CORS**: Flask-CORS
- **File Upload**: Werkzeug
- **Logging**: Python logging

#### Machine Learning
- **Object Detection**: YOLOv8 (Ultralytics)
- **Computer Vision**: OpenCV 4.8.1
- **Deep Learning**: PyTorch 2.0.1
- **Tracking**: OpenCV Tracker (CSRT)
- **Data Processing**: NumPy, Pandas

## Data Flow

### 1. Video Upload Process

```
User Upload → Frontend → Backend API → File Storage → Processing Queue
     ↓
ML Pipeline → Object Detection → Tracking → Event Analysis → Database
     ↓
Results → API → Frontend → User Interface
```

### 2. Authentication Flow

```
User Login → JWT Token → API Requests → Token Validation → Protected Routes
```

### 3. Analysis Pipeline

```
Video Frame → YOLOv8 Detection → Object Tracking → Zone Mapping → Event Detection
     ↓
Fast-Break Rules → Event Classification → Database Storage → API Response
```

## Database Schema

### Core Tables

#### Users
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password_hash`
- `display_name`
- `created_at`
- `updated_at`
- `is_active`

#### Matches
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `filename`
- `original_filename`
- `file_path`
- `file_size`
- `duration`
- `resolution`
- `fps`
- `status`
- `processing_progress`
- `created_at`
- `updated_at`

#### Events
- `id` (Primary Key)
- `match_id` (Foreign Key)
- `event_type`
- `start_time`
- `end_time`
- `duration`
- `confidence_score`
- `zone_sum`
- `pass_count`
- `event_data` (JSON)
- `created_at`

#### Zones
- `id` (Primary Key)
- `event_id` (Foreign Key)
- `zone_number` (1-18)
- `x_coord`
- `y_coord`
- `timestamp`
- `ball_position`
- `player_count`

## API Design

### RESTful Endpoints

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

#### Coach Analytics
- `POST /api/coach/upload` - Upload video
- `GET /api/coach/processing/{match_id}` - Processing status
- `GET /api/coach/analysis/{match_id}` - Analysis results
- `GET /api/coach/events/{match_id}` - Detected events
- `GET /api/coach/heatmap/{match_id}` - Zone heatmap
- `GET /api/coach/timeline/{match_id}` - Event timeline
- `GET /api/coach/export/{match_id}` - Export reports

### Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Machine Learning Pipeline

### YOLOv8 Object Detection

1. **Model**: YOLOv8n (nano) for speed, can be upgraded to larger models
2. **Classes**: Person (player), Sports Ball
3. **Confidence Threshold**: 0.5 (configurable)
4. **Input**: Video frames (1920x1080 or similar)
5. **Output**: Bounding boxes with class and confidence

### Object Tracking

1. **Algorithm**: CSRT (Discriminative Correlation Filter with Channel and Spatial Reliability)
2. **Features**: 
   - Object persistence across frames
   - Velocity calculation
   - Ball-player proximity detection
3. **Output**: Tracked object trajectories

### Zone Mapping

1. **Grid**: 3x6 = 18 zones
2. **Mapping**: Pixel coordinates → Zone numbers (1-18)
3. **Logic**: Forward pass detection based on zone progression

### Event Detection Rules

1. **Fast-Break Criteria**:
   - 3+ passes with zone_sum > 9
   - 4-5 passes with zone_sum > 12
2. **Zone Sum**: Sum of zone numbers in pass sequence
3. **Forward Pass**: Zone progression towards opponent's goal

## Security Considerations

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing (Werkzeug)
- Protected API endpoints
- CORS configuration

### File Upload Security
- File type validation
- File size limits
- Secure file storage
- Virus scanning (future)

### Data Protection
- User data isolation
- Secure database connections
- Input validation and sanitization
- Rate limiting (future)

## Performance Considerations

### Frontend
- React Query for caching
- Lazy loading of components
- Optimized bundle size
- Progressive loading

### Backend
- Database indexing
- Connection pooling
- Async processing for video analysis
- Caching strategies

### ML Pipeline
- GPU acceleration (optional)
- Batch processing
- Model optimization
- Memory management

## Scalability

### Horizontal Scaling
- Stateless API design
- Database connection pooling
- Load balancing ready
- Container deployment (Docker)

### Vertical Scaling
- GPU resources for ML
- Increased server resources
- Database optimization
- CDN for static assets

## Monitoring & Logging

### Application Logs
- Structured logging
- Error tracking
- Performance metrics
- User activity logs

### ML Pipeline Monitoring
- Detection accuracy metrics
- Processing time tracking
- Model performance
- Error rate monitoring

## Deployment Architecture

### Development
- Local development servers
- SQLite database
- Hot reloading
- Debug mode

### Production
- Gunicorn WSGI server
- PostgreSQL database
- Nginx reverse proxy
- SSL/TLS encryption
- Environment variables

## Future Enhancements

### Technical Improvements
- Real-time processing
- WebSocket integration
- Advanced ML models
- Mobile app development

### Feature Additions
- Team analysis
- Player tracking
- Advanced statistics
- Social features
- API for third-party integration 