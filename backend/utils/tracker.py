import cv2
import numpy as np
from typing import List, Dict, Tuple, Optional
from dataclasses import dataclass
import logging

logger = logging.getLogger(__name__)

@dataclass
class TrackedObject:
    """Data class for tracked objects"""
    id: int
    bbox: Tuple[int, int, int, int]  # x, y, w, h
    class_id: int  # 0 for player, 1 for ball
    confidence: float
    frame_id: int
    center: Tuple[float, float]
    velocity: Optional[Tuple[float, float]] = None

class ObjectTracker:
    """OpenCV-based object tracker for football video analysis"""
    
    def __init__(self, tracker_type: str = "CSRT"):
        """
        Initialize object tracker
        
        Args:
            tracker_type: Type of OpenCV tracker ("CSRT", "KCF", "MOSSE", etc.)
        """
        self.tracker_type = tracker_type
        self.trackers = {}
        self.next_id = 0
        self.max_disappeared = 30  # Frames before considering object lost
        self.disappeared = {}
        
        # Tracker factory
        self.tracker_factory = {
            "CSRT": cv2.TrackerCSRT_create,
            "KCF": cv2.TrackerKCF_create,
            "MOSSE": cv2.TrackerMOSSE_create,
            "MIL": cv2.TrackerMIL_create,
            "TLD": cv2.TrackerTLD_create,
            "MEDIANFLOW": cv2.TrackerMedianFlow_create,
            "BOOSTING": cv2.TrackerBoosting_create
        }
    
    def create_tracker(self):
        """Create a new tracker instance"""
        if self.tracker_type in self.tracker_factory:
            return self.tracker_factory[self.tracker_type]()
        else:
            logger.warning(f"Unknown tracker type: {self.tracker_type}. Using CSRT.")
            return cv2.TrackerCSRT_create()
    
    def update(self, frame: np.ndarray, detections: List[Dict]) -> List[TrackedObject]:
        """
        Update tracking with new detections
        
        Args:
            frame: Current video frame
            detections: List of detection dictionaries with bbox, class_id, confidence
            
        Returns:
            List of tracked objects
        """
        tracked_objects = []
        
        # If no existing trackers, initialize new ones
        if not self.trackers:
            for detection in detections:
                bbox = detection['bbox']
                tracker = self.create_tracker()
                success = tracker.init(frame, bbox)
                
                if success:
                    self.trackers[self.next_id] = {
                        'tracker': tracker,
                        'class_id': detection['class_id'],
                        'confidence': detection['confidence']
                    }
                    self.disappeared[self.next_id] = 0
                    self.next_id += 1
        
        # Update existing trackers
        for object_id, tracker_info in list(self.trackers.items()):
            tracker = tracker_info['tracker']
            success, bbox = tracker.update(frame)
            
            if success:
                # Update disappeared counter
                self.disappeared[object_id] = 0
                
                # Create tracked object
                x, y, w, h = bbox
                center = (x + w/2, y + h/2)
                
                tracked_obj = TrackedObject(
                    id=object_id,
                    bbox=bbox,
                    class_id=tracker_info['class_id'],
                    confidence=tracker_info['confidence'],
                    frame_id=0,  # Will be set by caller
                    center=center
                )
                tracked_objects.append(tracked_obj)
            else:
                # Increment disappeared counter
                self.disappeared[object_id] += 1
                
                # Remove tracker if object disappeared for too long
                if self.disappeared[object_id] > self.max_disappeared:
                    del self.trackers[object_id]
                    del self.disappeared[object_id]
        
        return tracked_objects
    
    def detect_ball_transfer(self, tracked_objects: List[TrackedObject], 
                           transfer_threshold: float = 50.0) -> List[Dict]:
        """
        Detect ball transfers between players
        
        Args:
            tracked_objects: List of tracked objects
            transfer_threshold: Distance threshold for ball transfer detection
            
        Returns:
            List of transfer events
        """
        transfers = []
        
        # Separate players and ball
        players = [obj for obj in tracked_objects if obj.class_id == 0]
        balls = [obj for obj in tracked_objects if obj.class_id == 1]
        
        if not balls or len(players) < 2:
            return transfers
        
        ball = balls[0]  # Assume single ball
        
        # Find closest player to ball
        closest_player = None
        min_distance = float('inf')
        
        for player in players:
            distance = self._calculate_distance(ball.center, player.center)
            if distance < min_distance:
                min_distance = distance
                closest_player = player
        
        # Check if ball is close enough to player for transfer
        if closest_player and min_distance <= transfer_threshold:
            # Store transfer event
            transfer = {
                'frame_id': ball.frame_id,
                'ball_id': ball.id,
                'player_id': closest_player.id,
                'distance': min_distance,
                'ball_position': ball.center,
                'player_position': closest_player.center
            }
            transfers.append(transfer)
        
        return transfers
    
    def _calculate_distance(self, point1: Tuple[float, float], 
                           point2: Tuple[float, float]) -> float:
        """Calculate Euclidean distance between two points"""
        return np.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)
    
    def calculate_velocity(self, tracked_objects: List[TrackedObject], 
                          previous_objects: List[TrackedObject]) -> List[TrackedObject]:
        """
        Calculate velocity for tracked objects
        
        Args:
            tracked_objects: Current frame tracked objects
            previous_objects: Previous frame tracked objects
            
        Returns:
            Updated tracked objects with velocity
        """
        # Create mapping of previous objects by ID
        prev_objects_map = {obj.id: obj for obj in previous_objects}
        
        for obj in tracked_objects:
            if obj.id in prev_objects_map:
                prev_obj = prev_objects_map[obj.id]
                
                # Calculate velocity (pixels per frame)
                vx = obj.center[0] - prev_obj.center[0]
                vy = obj.center[1] - prev_obj.center[1]
                
                obj.velocity = (vx, vy)
        
        return tracked_objects
    
    def filter_detections(self, detections: List[Dict], 
                         confidence_threshold: float = 0.5) -> List[Dict]:
        """
        Filter detections based on confidence threshold
        
        Args:
            detections: List of detection dictionaries
            confidence_threshold: Minimum confidence score
            
        Returns:
            Filtered detections
        """
        return [det for det in detections if det['confidence'] >= confidence_threshold]
    
    def reset(self):
        """Reset all trackers"""
        self.trackers.clear()
        self.disappeared.clear()
        self.next_id = 0

class BallTracker(ObjectTracker):
    """Specialized tracker for ball tracking with enhanced ball detection"""
    
    def __init__(self, tracker_type: str = "CSRT"):
        super().__init__(tracker_type)
        self.ball_history = []  # Store ball positions over time
        self.max_history = 30  # Maximum frames to keep in history
    
    def update_ball_history(self, ball_objects: List[TrackedObject]):
        """Update ball position history"""
        if ball_objects:
            ball = ball_objects[0]  # Assume single ball
            self.ball_history.append({
                'frame_id': ball.frame_id,
                'position': ball.center,
                'bbox': ball.bbox
            })
            
            # Keep only recent history
            if len(self.ball_history) > self.max_history:
                self.ball_history.pop(0)
    
    def predict_ball_position(self, frames_ahead: int = 5) -> Optional[Tuple[float, float]]:
        """
        Predict ball position based on recent history
        
        Args:
            frames_ahead: Number of frames to predict ahead
            
        Returns:
            Predicted position or None if insufficient history
        """
        if len(self.ball_history) < 3:
            return None
        
        # Simple linear prediction based on recent velocity
        recent_positions = self.ball_history[-3:]
        
        # Calculate average velocity
        velocities = []
        for i in range(1, len(recent_positions)):
            prev_pos = recent_positions[i-1]['position']
            curr_pos = recent_positions[i]['position']
            vx = curr_pos[0] - prev_pos[0]
            vy = curr_pos[1] - prev_pos[1]
            velocities.append((vx, vy))
        
        if not velocities:
            return None
        
        # Average velocity
        avg_vx = sum(v[0] for v in velocities) / len(velocities)
        avg_vy = sum(v[1] for v in velocities) / len(velocities)
        
        # Predict position
        last_pos = self.ball_history[-1]['position']
        predicted_x = last_pos[0] + avg_vx * frames_ahead
        predicted_y = last_pos[1] + avg_vy * frames_ahead
        
        return (predicted_x, predicted_y)
    
    def detect_ball_kick(self, tracked_objects: List[TrackedObject], 
                        velocity_threshold: float = 10.0) -> List[Dict]:
        """
        Detect ball kicks based on sudden velocity changes
        
        Args:
            tracked_objects: List of tracked objects
            velocity_threshold: Minimum velocity change for kick detection
            
        Returns:
            List of kick events
        """
        kicks = []
        balls = [obj for obj in tracked_objects if obj.class_id == 1]
        
        for ball in balls:
            if ball.velocity:
                velocity_magnitude = np.sqrt(ball.velocity[0]**2 + ball.velocity[1]**2)
                
                if velocity_magnitude > velocity_threshold:
                    kick = {
                        'frame_id': ball.frame_id,
                        'ball_id': ball.id,
                        'velocity': ball.velocity,
                        'velocity_magnitude': velocity_magnitude,
                        'position': ball.center
                    }
                    kicks.append(kick)
        
        return kicks 