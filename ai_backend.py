from dotenv import load_dotenv
import os
from roboflow import Roboflow
import cv2

load_dotenv()

# -----------------------------
# Roboflow Setup
# -----------------------------
api_key = os.getenv("ROBOFLOW_API_KEY")

if not api_key:
    raise RuntimeError("ROBOFLOW_API_KEY not found")

rf = Roboflow(api_key=api_key)

workspace = rf.workspace()                     # ✅ FIX
project = workspace.project("real-structure-v2")
model = project.version(2).model

print("ROBOFLOW_API_KEY loaded:", api_key[:6], "...")

def resize_image(image, max_dim=1024):
    h, w = image.shape[:2]

    if max(h, w) <= max_dim:
        return image, 1.0

    scale = max_dim / max(h, w)
    new_w = int(w * scale)
    new_h = int(h * scale)

    resized = cv2.resize(image, (new_w, new_h), interpolation=cv2.INTER_AREA)
    return resized, scale



def analyze_image(image):
    """
    image: OpenCV BGR image
    returns: detections + measurements
    """

    temp_path = "temp.jpg"
    resized_image, scale = resize_image(image, max_dim=1024)
    cv2.imwrite(temp_path, resized_image)
    prediction = model.predict(
        temp_path,
        confidence=40,
        overlap=30
    ).json()

    detections = []
    for pred in prediction.get("predictions", []):
        detections.append({
            "label": pred["class"],
            "confidence": round(pred["confidence"], 3),
            "x": pred["x"],
            "y": pred["y"],
            "width": pred["width"],
            "height": pred["height"]
        })

    return {
        "detections": detections,
	"scale": scale        
    }
