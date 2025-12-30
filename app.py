import streamlit as st
import cv2
import numpy as np
from PIL import Image

import ai_backend  # backend module

# ---------------------------------
# Page Config
# ---------------------------------
st.set_page_config(
    page_title="House AI Analyzer",
    layout="wide"
)

st.title("🏠 House AI Image Analyzer")
st.write("Upload a house image to classify objects and estimate measurements.")

# ---------------------------------
# Sidebar
# ---------------------------------
st.sidebar.header("Controls")
run_analysis = st.sidebar.button("Run AI Analysis")

# ---------------------------------
# Image Upload
# ---------------------------------
uploaded_file = st.file_uploader(
    "Upload an image",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file:
    # Convert uploaded image to OpenCV format
    image_pil = Image.open(uploaded_file).convert("RGB")
    image_np = np.array(image_pil)
    image_cv = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    # Display uploaded image
    st.subheader("Uploaded Image")
    st.image(image_pil, use_container_width=True)

    # ---------------------------------
    # Run AI Backend
    # ---------------------------------
    if run_analysis:
        with st.spinner("Analyzing image..."):
            results = ai_backend.analyze_image(image_cv)

        st.success("Analysis complete!")
    
        # =============================
        # DRAW BOUNDING BOXES
        # =============================
        scale = results["scale"]
        image_with_boxes = image_cv.copy()

        for det in results["detections"]:
            x = int(det["x"] / scale)
            y = int(det["y"] / scale)
            w = int(det["width"] / scale)
            h = int(det["height"] / scale)

            # Convert center → corners
            x1 = int(x - w / 2)
            y1 = int(y - h / 2)
            x2 = int(x + w / 2)
            y2 = int(y + h / 2)

            # Draw rectangle
            cv2.rectangle(
                image_with_boxes,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            # Draw label
            label = f"{det['label']} {det['confidence']:.2f}"
            cv2.putText(
                image_with_boxes,
                label,
                (x1, max(y1 - 10, 10)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

        # Convert BGR → RGB for Streamlit
        image_rgb = cv2.cvtColor(image_with_boxes, cv2.COLOR_BGR2RGB)

        st.subheader("YOLOv8 Detections")
        st.image(image_rgb, use_container_width=True)

        # ---------------------------------
        # Results Layout
        # ---------------------------------
        col1, col2 = st.columns(2)

        # Detected Objects
        with col1:
            st.subheader("Detected Objects")

            if results["detections"]:
                for det in results["detections"]:
                    st.write(
                        f"• **{det['label']}** — {det['confidence'] * 100:.1f}%"
                    )
            else:
                st.info("No objects detected.")

        # Measurements (placeholder for next step)
        with col2:
            st.subheader("Measurements")
            st.info("Measurement logic coming next.")

else:
    st.info("Please upload an image to begin.")