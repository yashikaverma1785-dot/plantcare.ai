"""
PlantCare AI - Main Application Runner
Starts the FastAPI production server (which also serves the React frontend UI).
"""

import sys
import os
import webbrowser
import uvicorn

# Ensure repository root is in python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

if __name__ == "__main__":
    host = "127.0.0.1"
    port = 8000
    url = f"http://{host}:{port}"

    print("=" * 65)
    print("  PLANTCARE AI - LEAF DISEASE DETECTION")
    print("  Machine Learning & Discrete Mathematics Integration")
    print("=" * 65)
    print(f"[*] Starting local server at: {url}")
    print(f"[*] MobileNetV2 Model: backend/models/plant_model.keras")
    print(f"[*] Discrete Mathematics Engine: Active")
    print(f"[*] Opening browser automatically...")
    print("=" * 65)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    uvicorn.run("backend.main:app", host=host, port=port, reload=False)
