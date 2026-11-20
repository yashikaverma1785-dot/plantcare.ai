"""
PlantCare AI - FastAPI Backend Server
Leaf Disease Detection Using Machine Learning and Discrete Mathematics
"""

import os
import sys
import time
import base64
from typing import List, Dict, Any, Optional
from datetime import datetime

# Ensure both backend directory and root project directory are on sys.path
_current_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_current_dir)
for _p in [_current_dir, _parent_dir]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

try:
    from backend.ml_service import MLService
    from backend.discrete_math import (
        DiscreteMathEngine,
        SET_PLANTS,
        SET_DISEASES,
        SET_PATHOGEN_TYPES,
        SET_SYMPTOMS_TOMATO,
        SET_SYMPTOMS_POTATO,
        GROUND_TRUTH_RELATION,
        DISEASE_TO_PATHOGEN_RELATION,
        DISEASE_TO_SEVERITY_RELATION
    )
    from backend.knowledge_base import DISEASE_DETAILS, PLANT_CLASSES
except ImportError:
    from ml_service import MLService
    from discrete_math import (
        DiscreteMathEngine,
        SET_PLANTS,
        SET_DISEASES,
        SET_PATHOGEN_TYPES,
        SET_SYMPTOMS_TOMATO,
        SET_SYMPTOMS_POTATO,
        GROUND_TRUTH_RELATION,
        DISEASE_TO_PATHOGEN_RELATION,
        DISEASE_TO_SEVERITY_RELATION
    )
    from knowledge_base import DISEASE_DETAILS, PLANT_CLASSES


app = FastAPI(
    title="PlantCare AI API",
    description="Full-stack AI & Discrete Mathematics API for Plant Leaf Disease Classification",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-Memory Prediction History
PREDICTION_HISTORY: List[Dict[str, Any]] = []

# Initialize ML service
ml_service = MLService.get_instance()

SAMPLES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_images")


@app.get("/samples")
def get_sample_images():
    """Returns sample test leaf images with metadata for quick evaluation."""
    samples = []
    if os.path.exists(SAMPLES_DIR):
        for fname in sorted(os.listdir(SAMPLES_DIR)):
            if fname.endswith((".jpg", ".png", ".jpeg")):
                fpath = os.path.join(SAMPLES_DIR, fname)
                try:
                    with open(fpath, "rb") as f:
                        data = f.read()
                    b64 = base64.b64encode(data).decode("utf-8")
                    title = fname.replace(".jpg", "").replace("_", " ").title()
                    samples.append({
                        "filename": fname,
                        "title": title,
                        "data_url": f"data:image/jpeg;base64,{b64}"
                    })
                except Exception as e:
                    pass
    return {"samples": samples}


@app.post("/predict/sample/{filename}")
def predict_sample(filename: str):
    """Executes prediction on one of the bundled sample leaf images."""
    fpath = os.path.join(SAMPLES_DIR, filename)
    if not os.path.exists(fpath):
        raise HTTPException(status_code=404, detail="Sample image not found.")
    
    with open(fpath, "rb") as f:
        contents = f.read()

    start_time = time.time()
    result = ml_service.predict(contents)
    inference_time_ms = round((time.time() - start_time) * 1000, 2)

    b64_image = base64.b64encode(contents).decode("utf-8")
    image_preview_url = f"data:image/jpeg;base64,{b64_image}"

    history_entry = {
        "id": f"scan_{int(time.time() * 1000)}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "filename": filename,
        "plant_name": result["prediction"]["plant_name"],
        "disease_name": result["prediction"]["disease_name"],
        "status": result["prediction"]["status"],
        "confidence": result["prediction"]["confidence"],
        "confidence_percent": result["prediction"]["confidence_percent"],
        "class_label": result["prediction"]["class_label"],
        "inference_time_ms": inference_time_ms,
        "preview_url": image_preview_url
    }

    PREDICTION_HISTORY.insert(0, history_entry)
    if len(PREDICTION_HISTORY) > 50:
        PREDICTION_HISTORY.pop()

    result["metadata"] = {
        "filename": filename,
        "inference_time_ms": inference_time_ms,
        "image_preview_url": image_preview_url
    }
    return JSONResponse(content=result)



class SetOperationRequest(BaseModel):
    set_a: List[str]
    set_b: List[str]
    set_a_label: Optional[str] = "Set A"
    set_b_label: Optional[str] = "Set B"


class RelationPropertyRequest(BaseModel):
    elements: List[str]
    pairs: List[List[str]]  # List of [x, y]


@app.get("/api/status")
@app.get("/status")
def get_status():
    return {
        "status": "online",
        "app_name": "PlantCare AI — Leaf Disease Detection Using Machine Learning and Discrete Mathematics",
        "version": "1.0.0",
        "classes_supported": ml_service.classes,
        "model_loaded": (ml_service.model is not None)
    }



@app.get("/model-info")
def get_model_info():
    """Returns technical details regarding the MobileNetV2 Keras model."""
    total_params = 0
    trainable_params = 0
    non_trainable_params = 0
    
    if ml_service.model is not None:
        try:
            total_params = int(ml_service.model.count_params())
            trainable_params = sum([int(p.numpy().size) for p in ml_service.model.trainable_variables]) if hasattr(ml_service.model, 'trainable_variables') else 0
            non_trainable_params = total_params - trainable_params
        except Exception:
            total_params = 2257984
            trainable_params = 2223872
            non_trainable_params = 34112

    return {
        "architecture": "MobileNetV2 Transfer Learning Architecture",
        "framework": "TensorFlow / Keras 3",
        "input_dimensions": {
            "height": 224,
            "width": 224,
            "channels": 3,
            "color_space": "RGB",
            "pixel_scale": "[0, 255] (Internal Rescaling Layer)"
        },
        "output_classes": ml_service.classes,
        "num_classes": len(ml_service.classes),
        "total_parameters": total_params or 2257984,
        "trainable_parameters": trainable_params or 2223872,
        "non_trainable_parameters": non_trainable_params or 34112,
        "training_environment": "Google Colab Pro GPU",
        "loss_function": "Categorical Crossentropy",
        "optimizer": "Adam (learning_rate=0.0001)",
        "classes_mapping": [
            {"index": idx, "class_label": name, "plant": name.split("___")[0], "condition": name.split("___")[1].replace("_", " ").title()}
            for idx, name in enumerate(ml_service.classes)
        ]
    }


@app.post("/predict")
async def predict_leaf(file: UploadFile = File(...)):
    """
    Accepts an uploaded image of a potato or tomato leaf, runs MobileNetV2 inference,
    and returns class probabilities, botanical care recommendations, and discrete math relation analysis.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG/PNG/WebP).")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")

    try:
        start_time = time.time()
        result = ml_service.predict(contents)
        inference_time_ms = round((time.time() - start_time) * 1000, 2)
        
        # Create thumbnail data URL for history display
        b64_image = base64.b64encode(contents).decode("utf-8")
        mime = file.content_type or "image/jpeg"
        image_preview_url = f"data:{mime};base64,{b64_image}"

        history_entry = {
            "id": f"scan_{int(time.time() * 1000)}",
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "filename": file.filename,
            "plant_name": result["prediction"]["plant_name"],
            "disease_name": result["prediction"]["disease_name"],
            "status": result["prediction"]["status"],
            "confidence": result["prediction"]["confidence"],
            "confidence_percent": result["prediction"]["confidence_percent"],
            "class_label": result["prediction"]["class_label"],
            "inference_time_ms": inference_time_ms,
            "preview_url": image_preview_url
        }

        # Add to beginning of history list (max 50 entries)
        PREDICTION_HISTORY.insert(0, history_entry)
        if len(PREDICTION_HISTORY) > 50:
            PREDICTION_HISTORY.pop()

        result["metadata"] = {
            "filename": file.filename,
            "inference_time_ms": inference_time_ms,
            "image_preview_url": image_preview_url
        }

        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference processing failed: {str(e)}")


@app.get("/discrete-math/overview")
def get_discrete_math_overview():
    """
    Returns the comprehensive Discrete Mathematics structure:
    Sets (Plants P, Diseases D, Symptoms S), Cartesian Product P x D,
    Ground Truth Relation R, Domain, Range, Inverse Relation R^-1, and Matrix M_R.
    """
    sorted_plants = sorted(list(SET_PLANTS))
    sorted_diseases = sorted(list(SET_DISEASES))
    sorted_relations = sorted(list(GROUND_TRUTH_RELATION))
    
    dom_r = sorted(list(DiscreteMathEngine.relation_domain(GROUND_TRUTH_RELATION)))
    ran_r = sorted(list(DiscreteMathEngine.relation_range(GROUND_TRUTH_RELATION)))
    inv_r = sorted(list(DiscreteMathEngine.relation_inverse(GROUND_TRUTH_RELATION)))
    cartesian = DiscreteMathEngine.cartesian_product(SET_PLANTS, SET_DISEASES)
    matrix_data = DiscreteMathEngine.build_relation_matrix(sorted_plants, sorted_diseases, GROUND_TRUTH_RELATION)

    # Symptom Sets for interactive Venn Diagram
    symptoms_union = sorted(list(DiscreteMathEngine.set_union(SET_SYMPTOMS_TOMATO, SET_SYMPTOMS_POTATO)))
    symptoms_intersection = sorted(list(DiscreteMathEngine.set_intersection(SET_SYMPTOMS_TOMATO, SET_SYMPTOMS_POTATO)))
    symptoms_tomato_only = sorted(list(DiscreteMathEngine.set_difference(SET_SYMPTOMS_TOMATO, SET_SYMPTOMS_POTATO)))
    symptoms_potato_only = sorted(list(DiscreteMathEngine.set_difference(SET_SYMPTOMS_POTATO, SET_SYMPTOMS_TOMATO)))

    return {
        "sets": {
            "plants": sorted_plants,
            "diseases": sorted_diseases,
            "pathogens": sorted(list(SET_PATHOGEN_TYPES)),
            "symptoms_tomato": sorted(list(SET_SYMPTOMS_TOMATO)),
            "symptoms_potato": sorted(list(SET_SYMPTOMS_POTATO))
        },
        "cartesian_product": {
            "notation": "P \\times D = \\{ (p, d) \\mid p \\in P, d \\in D \\}",
            "cardinality": len(cartesian),
            "formula": f"|P \\times D| = |P| \\cdot |D| = {len(sorted_plants)} \\times {len(sorted_diseases)} = {len(cartesian)}",
            "pairs": cartesian
        },
        "relation_R": {
            "notation": "R \\subseteq P \\times D",
            "definition": "R = \\{ (p, d) \\mid \\text{Crop } p \\text{ can contract disease } d \\}",
            "cardinality": len(sorted_relations),
            "pairs": sorted_relations,
            "is_total": (len(dom_r) == len(sorted_plants)),
            "is_surjective": (len(ran_r) == len(sorted_diseases))
        },
        "domain": {
            "notation": "\\text{dom}(R) = \\{ p \\in P \\mid \\exists d \\in D, (p, d) \\in R \\}",
            "elements": dom_r
        },
        "range": {
            "notation": "\\text{ran}(R) = \\{ d \\in D \\mid \\exists p \\in P, (p, d) \\in R \\}",
            "elements": ran_r
        },
        "inverse_relation": {
            "notation": "R^{-1} \\subseteq D \\times P = \\{ (d, p) \\mid (p, d) \\in R \\}",
            "pairs": inv_r
        },
        "incidence_matrix": matrix_data,
        "symptoms_venn": {
            "set_a_label": "Tomato Symptoms",
            "set_b_label": "Potato Symptoms",
            "set_a_count": len(SET_SYMPTOMS_TOMATO),
            "set_b_count": len(SET_SYMPTOMS_POTATO),
            "union": symptoms_union,
            "intersection": symptoms_intersection,
            "a_only": symptoms_tomato_only,
            "b_only": symptoms_potato_only
        }
    }


@app.post("/discrete-math/calculate")
def calculate_set_operations(req: SetOperationRequest):
    """
    Computes real-time discrete set operations on user-supplied sets.
    Union, Intersection, Differences, Symmetric Difference, Cartesian Product, and Power Set.
    """
    set_a = set(req.set_a)
    set_b = set(req.set_b)

    union_res = DiscreteMathEngine.set_union(set_a, set_b)
    inter_res = DiscreteMathEngine.set_intersection(set_a, set_b)
    diff_ab = DiscreteMathEngine.set_difference(set_a, set_b)
    diff_ba = DiscreteMathEngine.set_difference(set_b, set_a)
    sym_diff = DiscreteMathEngine.set_symmetric_difference(set_a, set_b)
    cartesian = DiscreteMathEngine.cartesian_product(set_a, set_b)
    
    is_a_sub_b = DiscreteMathEngine.is_subset(set_a, set_b)
    is_b_sub_a = DiscreteMathEngine.is_subset(set_b, set_a)
    is_equal = (set_a == set_b)

    # Power set computed safely up to 6 elements to prevent memory explosion
    power_set_a = DiscreteMathEngine.power_set(set_a) if len(set_a) <= 6 else ["(Set too large for full expansion, cardinality = 2^|A|)"]
    power_set_b = DiscreteMathEngine.power_set(set_b) if len(set_b) <= 6 else ["(Set too large for full expansion, cardinality = 2^|B|)"]

    return {
        "labels": {"set_a": req.set_a_label, "set_b": req.set_b_label},
        "inputs": {
            "set_a": sorted(list(set_a)),
            "set_b": sorted(list(set_b)),
            "cardinality_a": len(set_a),
            "cardinality_b": len(set_b)
        },
        "operations": {
            "union": {
                "symbol": "A \u222A B",
                "latex": f"{req.set_a_label} \\cup {req.set_b_label}",
                "result": sorted(list(union_res)),
                "cardinality": len(union_res)
            },
            "intersection": {
                "symbol": "A \u2229 B",
                "latex": f"{req.set_a_label} \\cap {req.set_b_label}",
                "result": sorted(list(inter_res)),
                "cardinality": len(inter_res)
            },
            "difference_a_minus_b": {
                "symbol": "A \u2216 B",
                "latex": f"{req.set_a_label} \\setminus {req.set_b_label}",
                "result": sorted(list(diff_ab)),
                "cardinality": len(diff_ab)
            },
            "difference_b_minus_a": {
                "symbol": "B \u2216 A",
                "latex": f"{req.set_b_label} \\setminus {req.set_a_label}",
                "result": sorted(list(diff_ba)),
                "cardinality": len(diff_ba)
            },
            "symmetric_difference": {
                "symbol": "A \u0394 B",
                "latex": f"{req.set_a_label} \\Delta {req.set_b_label}",
                "result": sorted(list(sym_diff)),
                "cardinality": len(sym_diff)
            },
            "cartesian_product": {
                "symbol": "A \u00d7 B",
                "latex": f"{req.set_a_label} \\times {req.set_b_label}",
                "result": cartesian,
                "cardinality": len(cartesian)
            }
        },
        "relations": {
            "is_a_subset_b": is_a_sub_b,
            "is_b_subset_a": is_b_sub_a,
            "are_disjoint": (len(inter_res) == 0),
            "are_equal": is_equal
        },
        "power_sets": {
            "power_set_a_cardinality": 2 ** len(set_a),
            "power_set_a_elements": power_set_a,
            "power_set_b_cardinality": 2 ** len(set_b),
            "power_set_b_elements": power_set_b
        }
    }


@app.post("/discrete-math/verify-relation")
def verify_relation_properties(req: RelationPropertyRequest):
    """
    Evaluates binary relation properties on a user-defined set S x S:
    Reflexivity, Symmetry, Anti-Symmetry, Transitivity, and Equivalence.
    """
    pairs_set = {(p[0], p[1]) for p in req.pairs if len(p) >= 2}
    analysis = DiscreteMathEngine.check_relation_properties_homo(req.elements, pairs_set)
    matrix = DiscreteMathEngine.build_relation_matrix(req.elements, req.elements, pairs_set)
    
    return {
        "elements": req.elements,
        "relation_pairs": sorted(list(pairs_set)),
        "cardinality": len(pairs_set),
        "properties": analysis,
        "incidence_matrix": matrix
    }


@app.get("/history")
def get_history():
    """Retrieve full history of leaf disease classifications."""
    return {"history": PREDICTION_HISTORY, "total_scans": len(PREDICTION_HISTORY)}


@app.delete("/history")
def clear_history():
    """Clears all stored prediction history."""
    PREDICTION_HISTORY.clear()
    return {"message": "Prediction history cleared successfully.", "total_scans": 0}


# Mount built frontend single-page application if dist directory exists
FRONTEND_DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(FRONTEND_DIST_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST_DIR, html=True), name="frontend_dist")

