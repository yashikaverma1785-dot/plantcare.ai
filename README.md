# PlantCare AI — Leaf Disease Detection Using Machine Learning and Discrete Mathematics

A modern full-stack web application combining deep convolutional neural networks (MobileNetV2) with classical **Discrete Mathematics (Set Theory & Binary Relations)** to diagnose foliar diseases in Solanaceae crops (*Tomato* & *Potato*).

---

## 🌿 Project Highlights

1. **Pre-Trained Machine Learning Model (Google Colab)**:
   - Architecture: **MobileNetV2** transfer learning.
   - Weights: `backend/models/plant_model.keras`
   - Exact Classes: `backend/models/classes.json`
     1. `Potato___Early_blight`
     2. `Potato___Late_blight`
     3. `Potato___healthy`
     4. `Tomato___Early_blight`
     5. `Tomato___Late_blight`
     6. `Tomato___healthy`
   - Input format: $224 \times 224 \times 3$ RGB with internal normalization (zero double-normalization).

2. **Discrete Mathematics — Sets and Relations Engine**:
   - Genuine Python dynamic set operations (**Union**, **Intersection**, **Difference**, **Symmetric Difference**, **Cartesian Product**, **Power Set**).
   - Ground truth binary relation: $R \subseteq P \times D$ where $P = \{\text{Potato}, \text{Tomato}\}$ and $D = \{\text{Early Blight}, \text{Late Blight}, \text{Healthy}\}$.
   - Formal calculations of **Domain** $\text{dom}(R)$, **Range** $\text{ran}(R)$, **Inverse Relation** $R^{-1} \subseteq D \times P$, and **Binary Incidence Matrix** $M_R$.
   - **Direct ML-to-Relation Integration**: When a leaf disease is predicted, its exact pair $(p, d) \in R$ is highlighted in real-time across the bipartite mapping graph and incidence matrix.
   - Interactive Venn Diagram comparing Solanaceae foliar symptom profiles.

3. **Botanical Care & Treatment Recommendations**:
   - Comprehensive symptoms, environmental triggers, bio-fungicides, and cultural prevention guidelines for every condition.

4. **Prediction History & Model Architecture Explorer**:
   - Audit trail of scans with confidence percentages, latency benchmarks, and thumbnail logs.

---

## 🚀 Quick Launch Instructions

### Option 1: 1-Click Launch (Recommended)
Double-click `start.bat` or run in your terminal:
```bash
py run.py
```
This launches the integrated FastAPI server at **http://127.0.0.1:8000** and automatically opens your web browser. The backend serves both the API endpoints and the full React single-page dashboard.

### Option 2: Full Development Mode (Hot-Reloading)
Double-click `start_dev.bat` or run both processes in separate terminals:

**Terminal 1 (Backend):**
```bash
py -m uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm.cmd run dev
```
Open **http://localhost:5173** in your browser.

---

## 📁 Repository Structure

```
plantdetector.ai/
├── backend/
│   ├── models/
│   │   ├── plant_model.keras       # Trained MobileNetV2 model
│   │   └── classes.json            # Exact 6 class names
│   ├── sample_images/              # 6 realistic test leaf images
│   ├── discrete_math.py            # Real Python Set Theory & Relation Engine
│   ├── knowledge_base.py           # Agronomic & botanical care knowledge base
│   ├── ml_service.py               # 224x224 RGB image preprocessing & inference
│   ├── main.py                     # FastAPI server with all endpoints
│   ├── generate_samples.py         # Sample leaf image generator
│   └── test_api.py                 # Automated test suite (all 7 tests pass)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Botanical header with live API status
│   │   │   ├── DetectionView.jsx   # Upload, instant samples & prediction card
│   │   │   ├── DiscreteMathView.jsx# Sets & Relations explorer & Venn diagrams
│   │   │   ├── ModelInfoView.jsx   # MobileNetV2 architecture & class mapping
│   │   │   └── HistoryView.jsx     # Scans timeline and filters
│   │   ├── App.jsx                 # Root layout & tab manager
│   │   ├── main.jsx                # React DOM entry
│   │   └── index.css               # Tailwind botanical themes
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── run.py                          # 1-Click Python production runner
├── start.bat                       # Windows launcher batch script
├── start_dev.bat                   # Development launcher batch script
└── README.md
```

---

## 🧪 Testing the Application

To run the automated test suite verifying model inference and discrete math operations:
```bash
py backend/test_api.py
```
Expected output:
```
[PASS] /api/status - API is online, model_loaded: True
[PASS] /model-info - Architecture: MobileNetV2 Transfer Learning Architecture, Classes: 6
[PASS] /samples - Retrieved 6 sample images
[PASS] /predict/sample/potato_early_blight.jpg -> Prediction Complete
[PASS] Discrete Math Link: (Tomato, Healthy) in R
[PASS] /discrete-math/overview - |P x D| = 6, |R| = 6
[PASS] /discrete-math/calculate - Union, Intersection, Difference verified
[PASS] /history - Total scans recorded: 1
ALL 7 SYSTEM TEST SUITES PASSED FLAWLESSLY!
```
