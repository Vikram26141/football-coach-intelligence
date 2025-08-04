# Football Coach Intelligence

An AI-powered football analytics platform that automatically detects, tracks, and reports on key attacking events (fast breaks/counter-attacks) during football matches using computer vision and machine learning.

## 🎯 Project Overview

This system uses YOLOv8 object detection to identify players and ball positions in football match videos, then applies custom algorithms to detect fast-break situations and map them to an 18-zone pitch grid for tactical analysis.

## ✨ Current Features

- **Intentionally Simplified UI**: Degraded authentication interface focusing on core functionality
- **User Authentication**: Complete registration and login system with JWT tokens
- **Big Logo Branding**: Prominent football logo (⚽) with gradient styling
- **Responsive Design**: Works on desktop and mobile devices
- **Dashboard**: Basic analytics overview for coaches
- **Profile Management**: User profile and settings pages

## 🏗️ Architecture

### Frontend (React)
- **Framework**: React 18.2.0 with modern hooks
- **Routing**: React Router v6 for navigation
- **Styling**: Styled Components for component-based styling
- **State Management**: React Query for server state, Context API for auth
- **Charts**: Chart.js for data visualization
- **Video**: React Player for video playback
- **UI**: Custom component library with intentionally basic design

### Backend (Flask)
- **Framework**: Flask 2.3.3 with Blueprint architecture
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT tokens with Flask-JWT-Extended
- **ORM**: SQLAlchemy with Flask-Migrate
- **API**: RESTful API with CORS support
- **File Upload**: Secure video file handling

### ML Pipeline (YOLOv8 + OpenCV)
- **Object Detection**: YOLOv8 for player and ball detection
- **Computer Vision**: OpenCV for video processing
- **Deep Learning**: PyTorch backend
- **Custom Algorithms**: Fast-break detection logic
- **Zone Mapping**: 18-zone pitch grid system

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - UI framework
- **React Router DOM 6.8.1** - Client-side routing
- **React Query 3.39.3** - State management
- **Styled Components 5.3.9** - CSS-in-JS styling
- **Axios 1.3.4** - HTTP client
- **Chart.js 4.2.1** - Data visualization
- **React Player 2.12.0** - Video playback

### Backend
- **Flask 2.3.3** - Web framework
- **PostgreSQL** - Database (SQLite for development)
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **Flask-CORS** - Cross-origin resource sharing

### Machine Learning
- **YOLOv8** - Object detection
- **OpenCV 4.8.1** - Computer vision
- **PyTorch 2.0.1** - Deep learning
- **NumPy** - Numerical computing
- **Pandas** - Data manipulation

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite for development)
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd football-coach-intelligence
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your configuration

# Initialize database
flask db init
flask db migrate
flask db upgrade

# Run the development server
python api/app.py
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/football_coach_db
# Or for SQLite: DATABASE_URL=sqlite:///./football_coach.db

# Flask Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
FLASK_ENV=development
FLASK_DEBUG=True

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRES=3600

# File Upload Configuration
MAX_CONTENT_LENGTH=100000000
UPLOAD_FOLDER=backend/data/raw
ALLOWED_EXTENSIONS=mp4,avi,mov

# YOLOv8 Configuration
YOLO_MODEL_PATH=backend/models/yolov8/yolov8n.pt
CONFIDENCE_THRESHOLD=0.5
IOU_THRESHOLD=0.45
```

### Frontend Environment

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
football-coach-intelligence/
├── backend/
│   ├── config/
│   │   └── settings.py            # Configuration management
│   ├── data/
│   │   ├── raw/                   # Raw video clips
│   │   └── labels/                # YOLO annotations
│   ├── models/
│   │   └── yolov8/                # ML model files
│   ├── scripts/
│   │   ├── test_detection.py      # YOLOv8 inference demo
│   │   └── extract_events.py      # Event extraction logic
│   ├── services/
│   │   ├── db.py                  # Database models
│   │   └── soccernet_api.py       # External API integration
│   ├── utils/
│   │   ├── zones.py               # Zone mapping utilities
│   │   └── tracker.py             # Object tracking
│   ├── api/
│   │   ├── routes/
│   │   │   ├── auth.py            # Authentication endpoints
│   │   │   ├── user.py            # User management
│   │   │   └── coach.py           # Analysis endpoints
│   │   └── app.py                 # Flask application
│   └── requirements.txt           # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/              # Authentication components
│   │   │   ├── Layout/            # Layout components
│   │   │   └── Dashboard/         # Analysis components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API services
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # App entry point
│   ├── package.json               # Node.js dependencies
│   └── .env                       # Frontend environment
├── docs/
│   ├── architecture.md            # System architecture
│   └── methodology.md             # ML methodology
├── .gitignore
├── README.md
└── env.example                    # Environment template
```

## 🎯 Usage

### 1. User Registration/Login

1. Navigate to http://localhost:3000
2. Click "Sign Up" to create an account
3. Or "Sign In" if you already have an account

### 2. Upload Video

1. Go to the Coach Dashboard
2. Click "Upload Video" or drag-and-drop a video file
3. Supported formats: MP4, AVI, MOV
4. Maximum file size: 100MB

### 3. Analysis Process

1. Video uploads to the server
2. YOLOv8 processes frames for object detection
3. Object tracking maintains player/ball identities
4. Zone mapping converts coordinates to 18-zone grid
5. Event detection applies fast-break rules
6. Results stored in database

### 4. View Results

- **Heatmap**: Visual representation of ball movement
- **Timeline**: Chronological list of detected events
- **Statistics**: Summary metrics and analytics
- **Export**: Download results in various formats

## 🔬 Machine Learning Pipeline

### Object Detection
- **Model**: YOLOv8n (nano) for speed
- **Classes**: Person (player), Sports Ball
- **Input**: Video frames (1920x1080)
- **Output**: Bounding boxes with confidence scores

### Object Tracking
- **Algorithm**: CSRT (Discriminative Correlation Filter)
- **Features**: Object persistence, velocity calculation
- **Output**: Tracked object trajectories

### Event Detection
- **Rules**: 
  - 3+ passes with zone_sum > 9
  - 4-5 passes with zone_sum > 12
- **Zone Mapping**: 3x6 grid (18 zones)
- **Forward Pass**: Zone progression towards opponent's goal

## 🧪 Testing

### Backend Tests

```bash
cd backend
python -m pytest tests/
```

### Frontend Tests

```bash
cd frontend
npm test
```

### ML Pipeline Testing

```bash
cd backend
python scripts/test_detection.py path/to/video.mp4
```

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Analysis Endpoints

- `POST /api/coach/upload` - Upload video
- `GET /api/coach/processing/{match_id}` - Processing status
- `GET /api/coach/analysis/{match_id}` - Analysis results
- `GET /api/coach/events/{match_id}` - Detected events
- `GET /api/coach/heatmap/{match_id}` - Zone heatmap
- `GET /api/coach/export/{match_id}` - Export reports

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**
   ```bash
   # Install production dependencies
   pip install gunicorn
   
   # Set production environment
   export FLASK_ENV=production
   
   # Run with Gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 api.app:app
   ```

2. **Frontend Deployment**
   ```bash
   # Build production version
   npm run build
   
   # Serve with nginx or similar
   ```

3. **Database Setup**
   - Use PostgreSQL for production
   - Set up proper database credentials
   - Configure connection pooling

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Ultralytics](https://github.com/ultralytics/ultralytics) for YOLOv8
- [OpenCV](https://opencv.org/) for computer vision
- [React](https://reactjs.org/) for frontend framework
- [Flask](https://flask.palletsprojects.com/) for backend framework

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Email: support@footballcoach.ai
- Documentation: [docs/](docs/)

## 🔮 Roadmap

- [ ] Real-time processing
- [ ] Advanced ML models
- [ ] Mobile app
- [ ] Team analytics
- [ ] Player tracking
- [ ] Social features
- [ ] API for third-party integration

---

**Football Coach Intelligence** - Empowering coaches with AI-driven insights ⚽🤖
