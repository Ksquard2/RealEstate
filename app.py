import streamlit as st
import cv2
import numpy as np
from PIL import Image

import ai_backend  # import the entire backend module

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

        # ---------------------------------
        # Results Layout
        # ---------------------------------
        col1, col2 = st.columns(2)

        # Detected Objects
        with col1:
            st.subheader("Detected Objects")

            if "detected_objects" in results:
                for obj in results["detected_objects"]:
                    st.write(
                        f"• **{obj['label']}** — {obj['confidence'] * 100:.1f}%"
                    )
            else:
                st.info("No objects detected.")

        # Measurements
        with col2:
            st.subheader("Measurements")

            if "measurements" in results:
                for key, value in results["measurements"].items():
                    st.write(f"• **{key}**: {value}")
            else:
                st.info("No measurements available.")

else:
    st.info("Please upload an image to begin.")
