#!/usr/bin/env python3
"""
YOLOv8 Inference Demo Script
Tests object detection on video files or webcam
"""

import cv2
import numpy as np
import argparse
import os
import sys
from pathlib import Path
from ultralytics import YOLO
import time

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from utils.zones import PitchZoneMapper
from utils.tracker import ObjectTracker, BallTracker

class YOLODetector:
    """YOLOv8-based object detector for football analysis"""
    
    def __init__(self, model_path: str = "yolov8n.pt", confidence: float = 0.5):
        """
        Initialize YOLO detector
        
        Args:
            model_path: Path to YOLO model file
            confidence: Confidence threshold for detections
        """
        self.model = YOLO(model_path)
        self.confidence = confidence
        self.zone_mapper = PitchZoneMapper()
        self.tracker = BallTracker()
        
        # Class names (COCO dataset)
        self.class_names = {
            0: 'person',  # Player
            32: 'sports ball'  # Ball
        }
        
        # Filter for football-relevant classes
        self.target_classes = [0, 32]  # person, sports ball
    
    def detect_frame(self, frame: np.ndarray) -> list:
        """
        Detect objects in a single frame
        
        Args:
            frame: Input frame as numpy array
            
        Returns:
            List of detection dictionaries
        """
        results = self.model(frame, conf=self.confidence, verbose=False)
        
        detections = []
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                    
                    # Get class and confidence
                    class_id = int(box.cls[0].cpu().numpy())
                    conf = float(box.conf[0].cpu().numpy())
                    
                    # Only process target classes
                    if class_id in self.target_classes:
                        # Convert to bbox format (x, y, w, h)
                        bbox = (x1, y1, x2 - x1, y2 - y1)
                        
                        detection = {
                            'bbox': bbox,
                            'class_id': class_id,
                            'confidence': conf,
                            'class_name': self.class_names.get(class_id, f'class_{class_id}')
                        }
                        detections.append(detection)
        
        return detections
    
    def process_video(self, video_path: str, output_path: str = None, 
                     show_preview: bool = True) -> dict:
        """
        Process video file and detect objects
        
        Args:
            video_path: Path to input video
            output_path: Path for output video (optional)
            show_preview: Whether to show real-time preview
            
        Returns:
            Dictionary with processing statistics
        """
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            raise ValueError(f"Could not open video: {video_path}")
        
        # Get video properties
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # Initialize video writer if output path provided
        writer = None
        if output_path:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            writer = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
        
        # Processing statistics
        stats = {
            'total_frames': total_frames,
            'processed_frames': 0,
            'total_detections': 0,
            'player_detections': 0,
            'ball_detections': 0,
            'processing_time': 0,
            'fps_avg': 0
        }
        
        frame_count = 0
        start_time = time.time()
        
        print(f"Processing video: {video_path}")
        print(f"Resolution: {width}x{height}, FPS: {fps}, Total frames: {total_frames}")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            
            # Detect objects
            detections = self.detect_frame(frame)
            
            # Update statistics
            stats['processed_frames'] += 1
            stats['total_detections'] += len(detections)
            
            for det in detections:
                if det['class_id'] == 0:  # Player
                    stats['player_detections'] += 1
                elif det['class_id'] == 32:  # Ball
                    stats['ball_detections'] += 1
            
            # Draw detections on frame
            annotated_frame = self.draw_detections(frame, detections)
            
            # Add processing info
            self.draw_info(annotated_frame, frame_count, total_frames, detections)
            
            # Show preview
            if show_preview:
                cv2.imshow('YOLOv8 Detection', annotated_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            
            # Write to output video
            if writer:
                writer.write(annotated_frame)
            
            # Progress update
            if frame_count % 30 == 0:  # Update every 30 frames
                progress = (frame_count / total_frames) * 100
                print(f"Progress: {progress:.1f}% ({frame_count}/{total_frames})")
        
        # Calculate final statistics
        processing_time = time.time() - start_time
        stats['processing_time'] = processing_time
        stats['fps_avg'] = frame_count / processing_time
        
        # Cleanup
        cap.release()
        if writer:
            writer.release()
        cv2.destroyAllWindows()
        
        return stats
    
    def draw_detections(self, frame: np.ndarray, detections: list) -> np.ndarray:
        """Draw detection bounding boxes on frame"""
        annotated_frame = frame.copy()
        
        for det in detections:
            x, y, w, h = det['bbox']
            class_name = det['class_name']
            confidence = det['confidence']
            
            # Color coding
            if det['class_id'] == 0:  # Player
                color = (0, 255, 0)  # Green
            elif det['class_id'] == 32:  # Ball
                color = (0, 0, 255)  # Red
            else:
                color = (255, 255, 0)  # Yellow
            
            # Draw bounding box
            cv2.rectangle(annotated_frame, (x, y), (x + w, y + h), color, 2)
            
            # Draw label
            label = f"{class_name}: {confidence:.2f}"
            label_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
            cv2.rectangle(annotated_frame, (x, y - label_size[1] - 10), 
                         (x + label_size[0], y), color, -1)
            cv2.putText(annotated_frame, label, (x, y - 5), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
        
        return annotated_frame
    
    def draw_info(self, frame: np.ndarray, frame_count: int, 
                  total_frames: int, detections: list):
        """Draw processing information on frame"""
        # Progress bar
        progress = frame_count / total_frames
        bar_width = 200
        bar_height = 20
        bar_x = 10
        bar_y = frame.shape[0] - 40
        
        # Background
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + bar_width, bar_y + bar_height), 
                     (0, 0, 0), -1)
        
        # Progress
        progress_width = int(bar_width * progress)
        cv2.rectangle(frame, (bar_x, bar_y), (bar_x + progress_width, bar_y + bar_height), 
                     (0, 255, 0), -1)
        
        # Text
        progress_text = f"Frame: {frame_count}/{total_frames} ({progress*100:.1f}%)"
        cv2.putText(frame, progress_text, (bar_x, bar_y - 10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        # Detection count
        det_text = f"Detections: {len(detections)}"
        cv2.putText(frame, det_text, (bar_x, bar_y - 35), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)

def main():
    """Main function for command-line usage"""
    parser = argparse.ArgumentParser(description='YOLOv8 Football Detection Demo')
    parser.add_argument('input', help='Input video file or "webcam" for live detection')
    parser.add_argument('--model', default='yolov8n.pt', help='YOLO model path')
    parser.add_argument('--confidence', type=float, default=0.5, help='Confidence threshold')
    parser.add_argument('--output', help='Output video path')
    parser.add_argument('--no-preview', action='store_true', help='Disable preview window')
    
    args = parser.parse_args()
    
    # Initialize detector
    detector = YOLODetector(args.model, args.confidence)
    
    try:
        if args.input.lower() == 'webcam':
            # Webcam detection
            print("Starting webcam detection...")
            cap = cv2.VideoCapture(0)
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                detections = detector.detect_frame(frame)
                annotated_frame = detector.draw_detections(frame, detections)
                
                cv2.imshow('YOLOv8 Webcam Detection', annotated_frame)
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            
            cap.release()
            cv2.destroyAllWindows()
            
        else:
            # Video file processing
            if not os.path.exists(args.input):
                print(f"Error: Video file not found: {args.input}")
                return
            
            stats = detector.process_video(
                args.input, 
                args.output, 
                show_preview=not args.no_preview
            )
            
            # Print statistics
            print("\n" + "="*50)
            print("PROCESSING STATISTICS")
            print("="*50)
            print(f"Total frames processed: {stats['processed_frames']}")
            print(f"Total detections: {stats['total_detections']}")
            print(f"Player detections: {stats['player_detections']}")
            print(f"Ball detections: {stats['ball_detections']}")
            print(f"Processing time: {stats['processing_time']:.2f} seconds")
            print(f"Average FPS: {stats['fps_avg']:.2f}")
            print(f"Detection rate: {stats['total_detections']/stats['processed_frames']:.2f} per frame")
            
    except KeyboardInterrupt:
        print("\nProcessing interrupted by user")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main() 