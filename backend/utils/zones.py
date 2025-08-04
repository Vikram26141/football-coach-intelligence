import numpy as np
from typing import Tuple, List, Dict

class PitchZoneMapper:
    """18-zone pitch mapping utility for football field analysis"""
    
    def __init__(self, pitch_width: int = 1920, pitch_height: int = 1080):
        """
        Initialize zone mapper with pitch dimensions
        
        Args:
            pitch_width: Width of pitch in pixels
            pitch_height: Height of pitch in pixels
        """
        self.pitch_width = pitch_width
        self.pitch_height = pitch_height
        
        # 18 zones: 3 rows x 6 columns
        self.zones_per_row = 6
        self.zones_per_col = 3
        
        # Zone dimensions
        self.zone_width = pitch_width / self.zones_per_row
        self.zone_height = pitch_height / self.zones_per_col
        
        # Zone numbering (1-18, left to right, top to bottom)
        self.zone_map = self._create_zone_map()
    
    def _create_zone_map(self) -> Dict[int, Tuple[float, float, float, float]]:
        """Create mapping of zone numbers to (x1, y1, x2, y2) coordinates"""
        zone_map = {}
        zone_number = 1
        
        for row in range(self.zones_per_col):
            for col in range(self.zones_per_row):
                x1 = col * self.zone_width
                y1 = row * self.zone_height
                x2 = (col + 1) * self.zone_width
                y2 = (row + 1) * self.zone_height
                
                zone_map[zone_number] = (x1, y1, x2, y2)
                zone_number += 1
        
        return zone_map
    
    def pixel_to_zone(self, x: float, y: float) -> int:
        """
        Convert pixel coordinates to zone number (1-18)
        
        Args:
            x: X coordinate in pixels
            y: Y coordinate in pixels
            
        Returns:
            Zone number (1-18) or 0 if outside pitch
        """
        if not (0 <= x <= self.pitch_width and 0 <= y <= self.pitch_height):
            return 0
        
        col = int(x // self.zone_width)
        row = int(y // self.zone_height)
        
        # Ensure we don't exceed bounds
        col = min(col, self.zones_per_row - 1)
        row = min(row, self.zones_per_col - 1)
        
        zone_number = row * self.zones_per_row + col + 1
        return zone_number
    
    def zone_to_pixel_center(self, zone_number: int) -> Tuple[float, float]:
        """
        Convert zone number to center pixel coordinates
        
        Args:
            zone_number: Zone number (1-18)
            
        Returns:
            (x, y) center coordinates of the zone
        """
        if zone_number not in self.zone_map:
            raise ValueError(f"Invalid zone number: {zone_number}")
        
        x1, y1, x2, y2 = self.zone_map[zone_number]
        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2
        
        return center_x, center_y
    
    def get_zone_boundaries(self, zone_number: int) -> Tuple[float, float, float, float]:
        """
        Get zone boundaries (x1, y1, x2, y2)
        
        Args:
            zone_number: Zone number (1-18)
            
        Returns:
            (x1, y1, x2, y2) coordinates
        """
        if zone_number not in self.zone_map:
            raise ValueError(f"Invalid zone number: {zone_number}")
        
        return self.zone_map[zone_number]
    
    def is_forward_pass(self, zone1: int, zone2: int) -> bool:
        """
        Determine if a pass from zone1 to zone2 is forward
        
        Args:
            zone1: Starting zone number
            zone2: Ending zone number
            
        Returns:
            True if pass is forward (towards opponent's goal)
        """
        if not (1 <= zone1 <= 18 and 1 <= zone2 <= 18):
            return False
        
        # Get row positions (0-2, where 0 is closest to own goal)
        row1 = (zone1 - 1) // self.zones_per_row
        row2 = (zone2 - 1) // self.zones_per_row
        
        # Forward pass: row2 < row1 (moving towards opponent's goal)
        return row2 < row1
    
    def calculate_zone_sum(self, zones: List[int]) -> int:
        """
        Calculate sum of zone numbers for a sequence
        
        Args:
            zones: List of zone numbers
            
        Returns:
            Sum of zone numbers
        """
        return sum(zones)
    
    def detect_fast_break(self, zone_sequence: List[int], 
                         min_passes: int = 3, 
                         min_zone_sum: int = 9,
                         max_passes: int = 5,
                         max_zone_sum: int = 12) -> bool:
        """
        Detect fast-break event based on zone sequence
        
        Args:
            zone_sequence: List of zone numbers representing pass sequence
            min_passes: Minimum number of passes required
            min_zone_sum: Minimum zone sum for 3+ passes
            max_passes: Maximum passes for higher zone sum requirement
            max_zone_sum: Minimum zone sum for 4-5 passes
            
        Returns:
            True if sequence qualifies as fast-break
        """
        if len(zone_sequence) < min_passes:
            return False
        
        zone_sum = self.calculate_zone_sum(zone_sequence)
        
        # Rule 1: 3+ passes with zone_sum > 9
        if len(zone_sequence) >= min_passes and zone_sum > min_zone_sum:
            return True
        
        # Rule 2: 4-5 passes with zone_sum > 12
        if (min_passes < len(zone_sequence) <= max_passes and 
            zone_sum > max_zone_sum):
            return True
        
        return False
    
    def get_zone_heatmap_data(self, zone_positions: List[Tuple[int, float]]) -> Dict[int, float]:
        """
        Generate heatmap data for zones
        
        Args:
            zone_positions: List of (zone_number, timestamp) tuples
            
        Returns:
            Dictionary mapping zone numbers to frequency/density
        """
        zone_counts = {}
        
        for zone_num, _ in zone_positions:
            if 1 <= zone_num <= 18:
                zone_counts[zone_num] = zone_counts.get(zone_num, 0) + 1
        
        return zone_counts
    
    def visualize_zones(self) -> Dict[str, List]:
        """
        Get zone visualization data for frontend
        
        Returns:
            Dictionary with zone coordinates for rendering
        """
        zones_data = []
        
        for zone_num in range(1, 19):
            x1, y1, x2, y2 = self.get_zone_boundaries(zone_num)
            zones_data.append({
                'zone_number': zone_num,
                'x1': x1,
                'y1': y1,
                'x2': x2,
                'y2': y2,
                'center_x': (x1 + x2) / 2,
                'center_y': (y1 + y2) / 2
            })
        
        return {
            'zones': zones_data,
            'pitch_width': self.pitch_width,
            'pitch_height': self.pitch_height
        } 