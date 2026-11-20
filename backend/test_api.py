"""
PlantCare AI - Automated Test Suite
Validates ML inference, Discrete Math set engine, and all API endpoints.
"""

import os
import sys

# Ensure repository root is in python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi.testclient import TestClient
from backend.main import app

def run_tests():
    print("=" * 60)
    print("PlantCare AI - Executing Automated Test Suite")
    print("=" * 60)

    client = TestClient(app)

    # 1. Test Status
    res = client.get("/api/status")
    assert res.status_code == 200, f"Status failed: {res.status_code}"
    status_data = res.json()
    print("[PASS] /api/status - API is online, model_loaded:", status_data["model_loaded"])

    # 2. Test Model Info
    res = client.get("/model-info")
    assert res.status_code == 200, f"Model info failed: {res.status_code}"
    model_data = res.json()
    print(f"[PASS] /model-info - Architecture: {model_data['architecture']}, Classes: {model_data['num_classes']}")
    assert model_data["num_classes"] == 6, "Expected 6 classes"

    # 3. Test Samples
    res = client.get("/samples")
    assert res.status_code == 200, f"Samples failed: {res.status_code}"
    samples = res.json().get("samples", [])
    print(f"[PASS] /samples - Retrieved {len(samples)} sample images")
    assert len(samples) >= 6, "Expected at least 6 sample images"

    # 4. Test Sample Prediction
    sample_to_test = samples[0]["filename"]
    res = client.post(f"/predict/sample/{sample_to_test}")
    assert res.status_code == 200, f"Prediction failed: {res.text}"
    pred_data = res.json()
    plant = pred_data["prediction"]["plant_name"]
    disease = pred_data["prediction"]["disease_name"]
    conf = pred_data["prediction"]["confidence_percent"]
    print(f"[PASS] /predict/sample/{sample_to_test} -> {plant} | {disease} ({conf}%)")

    # Verify Discrete Math Relation Connection
    dm = pred_data["discrete_mathematics"]
    print(f"[PASS] Discrete Math Link: {dm['membership_statement']}")
    assert dm["is_member_of_relation"] is True, "Prediction must be in Ground Truth Relation R"

    # 5. Test Discrete Math Overview
    res = client.get("/discrete-math/overview")
    assert res.status_code == 200, f"DM overview failed: {res.status_code}"
    dm_overview = res.json()
    print(f"[PASS] /discrete-math/overview - |P x D| = {dm_overview['cartesian_product']['cardinality']}, |R| = {dm_overview['relation_R']['cardinality']}")
    assert dm_overview["cartesian_product"]["cardinality"] == 6
    assert dm_overview["relation_R"]["cardinality"] == 6

    # 6. Test Real Python Set Calculator
    payload = {
        "set_a": ["Potato", "Tomato", "Eggplant"],
        "set_b": ["Tomato", "Pepper"],
        "set_a_label": "Solanaceae A",
        "set_b_label": "Solanaceae B"
    }
    res = client.post("/discrete-math/calculate", json=payload)
    assert res.status_code == 200, f"DM calculate failed: {res.status_code}"
    calc = res.json()
    union_res = calc["operations"]["union"]["result"]
    inter_res = calc["operations"]["intersection"]["result"]
    diff_res = calc["operations"]["difference_a_minus_b"]["result"]
    print(f"[PASS] /discrete-math/calculate - Union: {union_res}, Intersection: {inter_res}, Difference A-B: {diff_res}")
    assert inter_res == ["Tomato"], f"Intersection mismatch: {inter_res}"
    assert "Eggplant" in diff_res and "Potato" in diff_res, f"Difference mismatch: {diff_res}"

    # 7. Test History
    res = client.get("/history")
    assert res.status_code == 200, f"History failed: {res.status_code}"
    history_data = res.json()
    print(f"[PASS] /history - Total scans recorded: {history_data['total_scans']}")
    assert history_data["total_scans"] >= 1

    print("=" * 60)
    print("ALL 7 SYSTEM TEST SUITES PASSED FLAWLESSLY!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
