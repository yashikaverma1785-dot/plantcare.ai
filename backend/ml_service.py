"""
PlantCare AI - Machine Learning Inference Service
Author: PlantCare AI Team
Project: Leaf Disease Detection Using Machine Learning and Discrete Mathematics

Loads the trained MobileNetV2 Keras model, processes raw 224x224 RGB leaf images (0-255 range),
and executes deterministic predictions with class ranking.
"""

import os
import sys
import json
import logging
from typing import Dict, Any, List, Optional
import numpy as np
from PIL import Image
import io

# Ensure both backend directory and root project directory are on sys.path
_current_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_current_dir)
for _p in [_current_dir, _parent_dir]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from backend.knowledge_base import get_disease_info
    from backend.discrete_math import DiscreteMathEngine
except ImportError:
    from knowledge_base import get_disease_info
    from discrete_math import DiscreteMathEngine

logger = logging.getLogger("plantcare.ml_service")
logging.basicConfig(level=logging.INFO)

BASE_DIR = _current_dir

def _find_file(filename: str) -> str:
    candidates = [
        os.path.join(BASE_DIR, "models", filename),
        os.path.join(BASE_DIR, filename),
        os.path.join(_parent_dir, "models", filename),
        os.path.join(_parent_dir, filename),
        os.path.join(os.getcwd(), "backend", "models", filename),
        os.path.join(os.getcwd(), "models", filename),
        os.path.join(os.getcwd(), filename),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return os.path.join(BASE_DIR, "models", filename)

MODEL_PATH = _find_file("plant_model.keras")
CLASSES_PATH = _find_file("classes.json")


class MLService:
    _instance: Optional["MLService"] = None

    def __init__(self):
        self.model = None
        self.classes: List[str] = []
        self.load_classes()
        self.load_model()

    @classmethod
    def get_instance(cls) -> "MLService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_classes(self):
        """Loads and preserves exact class order from classes.json."""
        try:
            if os.path.exists(CLASSES_PATH):
                with open(CLASSES_PATH, "r", encoding="utf-8") as f:
                    self.classes = json.load(f)
                logger.info(f"Loaded {len(self.classes)} classes from {CLASSES_PATH}: {self.classes}")
            else:
                # Default canonical classes as specified by the user
                self.classes = [
                    "Potato___Early_blight",
                    "Potato___Late_blight",
                    "Potato___healthy",
                    "Tomato___Early_blight",
                    "Tomato___Late_blight",
                    "Tomato___healthy"
                ]
                logger.warning(f"classes.json not found at {CLASSES_PATH}, loaded fallback classes.")
        except Exception as e:
            logger.error(f"Error loading classes: {e}")
            self.classes = [
                "Potato___Early_blight",
                "Potato___Late_blight",
                "Potato___healthy",
                "Tomato___Early_blight",
                "Tomato___Late_blight",
                "Tomato___healthy"
            ]

    def load_model(self):
        """Loads the pre-trained MobileNetV2 Keras model."""
        try:
            import keras
            logger.info(f"Attempting to load model from: {MODEL_PATH}")
            if os.path.exists(MODEL_PATH):
                self.model = keras.models.load_model(MODEL_PATH)
                logger.info("Successfully loaded Keras model into memory!")
            else:
                logger.error(f"Model file does not exist at {MODEL_PATH}")
        except Exception as e:
            logger.error(f"Failed to load Keras model: {e}")
            # Try tensorflow.keras as fallback
            try:
                import tensorflow as tf
                if os.path.exists(MODEL_PATH):
                    self.model = tf.keras.models.load_model(MODEL_PATH)
                    logger.info("Successfully loaded model using tf.keras!")
            except Exception as e2:
                logger.error(f"Failed to load with tf.keras: {e2}")

    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Preprocesses uploaded leaf image:
        - Decodes bytes to PIL Image
        - Ensures RGB 3-channel mode
        - Resizes to exact 224x224 required by MobileNetV2
        - Retains raw pixel values [0, 255] (preprocessing layer inside model handles scaling)
        - Expands batch dimension to (1, 224, 224, 3)
        """
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # High quality resizing to 224x224
        image_resized = image.resize((224, 224), Image.Resampling.BILINEAR)
        
        # Convert to numpy float32 array in [0, 255] WITHOUT secondary normalization
        img_array = np.array(image_resized, dtype=np.float32)
        
        # Add batch dimension: shape (1, 224, 224, 3)
        img_tensor = np.expand_dims(img_array, axis=0)
        return img_tensor

    def parse_class_label(self, class_label: str) -> Dict[str, str]:
        """
        Parses class label into Plant, Disease, and Status.
        Example: 'Tomato___Early_blight' -> Plant: 'Tomato', Disease: 'Early Blight'
        """
        parts = class_label.split("___")
        plant = parts[0]
        disease_part = parts[1] if len(parts) > 1 else "Unknown"

        if disease_part.lower() == "healthy":
            disease_name = "Healthy"
            status = "Healthy"
        elif disease_part.lower() == "early_blight":
            disease_name = "Early Blight"
            status = "Unhealthy"
        elif disease_part.lower() == "late_blight":
            disease_name = "Late Blight"
            status = "Unhealthy"
        else:
            disease_name = disease_part.replace("_", " ").title()
            status = "Unhealthy"

        return {
            "plant": plant,
            "disease": disease_name,
            "status": status
        }

    def predict(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Executes inference on image bytes using the loaded model.
        Returns full predictions, discrete math relation mapping, and agronomic advice.
        """
        if self.model is None:
            # Re-attempt loading model
            self.load_model()
            if self.model is None:
                raise RuntimeError("ML Model could not be initialized. Please check model file.")

        img_tensor = self.preprocess_image(image_bytes)
        
        # Inference
        raw_preds = self.model(img_tensor, training=False)
        if hasattr(raw_preds, "numpy"):
            preds = raw_preds.numpy()[0]
        else:
            preds = np.array(raw_preds)[0]

        # Apply softmax if values do not sum to 1
        if not np.allclose(np.sum(preds), 1.0, atol=1e-2):
            exp_preds = np.exp(preds - np.max(preds))
            probabilities = exp_preds / np.sum(exp_preds)
        else:
            probabilities = preds

        # Preserve class order & extract top prediction
        top_idx = int(np.argmax(probabilities))
        top_class = self.classes[top_idx]
        top_confidence = float(probabilities[top_idx])

        # All class breakdown
        all_predictions = []
        for idx, cls_name in enumerate(self.classes):
            prob = float(probabilities[idx])
            parsed = self.parse_class_label(cls_name)
            all_predictions.append({
                "class_name": cls_name,
                "plant": parsed["plant"],
                "disease": parsed["disease"],
                "status": parsed["status"],
                "confidence": round(prob, 4),
                "confidence_percent": round(prob * 100, 2)
            })

        # Sort all predictions by descending confidence
        all_predictions_sorted = sorted(all_predictions, key=lambda x: x["confidence"], reverse=True)

        parsed_top = self.parse_class_label(top_class)
        plant_name = parsed_top["plant"]
        disease_name = parsed_top["disease"]
        status = parsed_top["status"]

        # Retrieve botanical metadata and agronomic care recommendations
        botanical_info = get_disease_info(top_class)

        # Compute Discrete Mathematics Relation Integration
        math_analysis = DiscreteMathEngine.analyze_prediction_relation(
            plant=plant_name,
            disease=disease_name,
            confidence=top_confidence
        )

        return {
            "prediction": {
                "class_label": top_class,
                "plant_name": plant_name,
                "disease_name": disease_name,
                "status": status,
                "is_healthy": (status == "Healthy"),
                "confidence": round(top_confidence, 4),
                "confidence_percent": round(top_confidence * 100, 2),
                "ranking": all_predictions_sorted
            },
            "botanical_care": botanical_info,
            "discrete_mathematics": math_analysis
        }
