import cv2
import numpy as np

def analyze_image(image):
    height, width, _ = image.shape

    return {
        "detected_objects": [
            {"label": "door", "confidence": 0.91},
            {"label": "window", "confidence": 0.87}
        ],
        "measurements": {
            "image_width_px": width,
            "image_height_px": height,
            "estimated_wall_width_ft": round(width / 50, 2)
        }
    }
