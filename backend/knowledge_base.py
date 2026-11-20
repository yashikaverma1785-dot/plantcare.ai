"""
PlantCare AI - Disease & Botanical Knowledge Base
Author: PlantCare AI Team
Project: Leaf Disease Detection Using Machine Learning and Discrete Mathematics
"""

from typing import Dict, Any, List

PLANT_CLASSES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___healthy"
]

DISEASE_DETAILS: Dict[str, Dict[str, Any]] = {
    "Potato___Early_blight": {
        "plant_name": "Potato",
        "scientific_plant": "Solanum tuberosum",
        "disease_name": "Early Blight",
        "pathogen": "Alternaria solani (Fungus)",
        "status": "Unhealthy",
        "is_healthy": False,
        "severity": "Moderate to High",
        "risk_color": "amber",
        "summary": "Early blight is a prevalent fungal disease causing target-board lesions, primarily on older potato foliage.",
        "symptoms": [
            "Concentric ringed brown/black lesions ('target board' pattern) on mature leaves",
            "Chlorotic yellow halo surrounding the dark leaf spots",
            "Premature leaf senescence and defoliation progressing upward",
            "Sunken, dark circular lesions on potato tubers with raised borders"
        ],
        "causes": [
            "Warm temperatures (24°C - 29°C / 75°F - 85°F)",
            "Frequent alternating wet and dry foliage cycles",
            "Plant stress caused by heavy fruit/tuber load or nitrogen deficiency",
            "Inoculum overwintering in solanaceous crop residue"
        ],
        "biological_treatments": [
            "Apply copper-based fungicides (copper sulfate / copper hydroxide) at early notice",
            "Foliar bio-control sprays containing Bacillus subtilis or Trichoderma harzianum",
            "Spray cold-pressed neem oil (0.5% concentration) as an organic antifungal preventive"
        ],
        "chemical_treatments": [
            "Chlorothalonil (Bravo) or Mancozeb protective sprays on a 7-10 day schedule",
            "Systemic fungicides such as Azoxystrobin, Difenoconazole, or Boscalid",
            "Alternate fungicide modes of action (FRAC groups) to avoid pathogen resistance"
        ],
        "prevention": [
            "3 to 4 year crop rotation away from Solanaceae (tomatoes, potatoes, eggplants, peppers)",
            "Utilize drip or furrow irrigation to keep foliar canopy completely dry",
            "Maintain balanced nitrogen fertilization throughout tuber bulking",
            "Plant certified disease-free certified seed tubers"
        ]
    },
    "Potato___Late_blight": {
        "plant_name": "Potato",
        "scientific_plant": "Solanum tuberosum",
        "disease_name": "Late Blight",
        "pathogen": "Phytophthora infestans (Oomycete)",
        "status": "Unhealthy",
        "is_healthy": False,
        "severity": "Critical / Severe",
        "risk_color": "rose",
        "summary": "Late blight is the devastating pathogen responsible for the Irish Great Famine. It can destroy entire fields within days under cool, humid conditions.",
        "symptoms": [
            "Pale to water-soaked circular lesions that rapidly enlarge into dark brown/purplish necrotic blotches",
            "Delicate white fuzzy fungal sporulation on leaf undersides in humid mornings",
            "Stems develop dark, brittle brown lesions that cause upper plant collapse",
            "Tubers develop coppery brown granular dry rot penetrating deep into the flesh"
        ],
        "causes": [
            "Cool, wet weather with temperatures between 10°C and 20°C (50°F - 68°F)",
            "Relative humidity consistently exceeding 90%",
            "Prolonged leaf wetness (> 8-10 consecutive hours)",
            "Airborne sporangia dispersed over miles by wind and rain splash"
        ],
        "biological_treatments": [
            "Strict immediate destruction of heavily infected plants; incinerate or deep bury (do NOT compost)",
            "Preventative copper soap or fixed copper hydroxide application before rain events",
            "Bio-protective Bacillus amyloliquefaciens soil and canopy drench"
        ],
        "chemical_treatments": [
            "Mandipropamid (Revus) or Fluopicolide (Presidio) systemic applications",
            "Cymoxanil (Curzate) for kick-back eradicant activity within 24-48 hours of infection",
            "Mancozeb or Chlorothalonil contact barrier sprays"
        ],
        "prevention": [
            "Eliminate all cull piles, volunteer potato plants, and infected tubers prior to planting season",
            "Choose resistant cultivars (e.g., Sarpo Mira, Defender, Elba)",
            "Avoid excessive canopy density; ensure wide row spacing for continuous airflow",
            "Monitor regional late blight forecasting networks"
        ]
    },
    "Potato___healthy": {
        "plant_name": "Potato",
        "scientific_plant": "Solanum tuberosum",
        "disease_name": "Healthy",
        "pathogen": "None (Plant is in optimal vigor)",
        "status": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "risk_color": "emerald",
        "summary": "The potato foliage exhibits excellent vigor with crisp, uniform color and no signs of bacterial, fungal, or oomycete pathogens.",
        "symptoms": [
            "Rich deep green coloration with intact cuticular wax layer",
            "Turgid, symmetrical leaflets free of necrosis, chlorosis, or curling",
            "Healthy apical meristem and sturdy stem structures",
            "No signs of spore masses, target lesions, or insect vectors"
        ],
        "causes": [
            "Optimal agronomic care, clean soil, and balanced nutrition"
        ],
        "biological_treatments": [
            "Maintain compost tea or seaweed extract foliar feeding monthly",
            "Introduce mycorrhizal fungi in root zones for enhanced nutrient uptake"
        ],
        "chemical_treatments": [
            "No chemical intervention required; preserve beneficial soil microbes"
        ],
        "prevention": [
            "Hill soil around plant stems 2-3 times during the vegetative cycle to shield tubers from sunlight",
            "Maintain 1 to 2 inches of moisture per week through sub-canopy drip lines",
            "Scout weekly for Colorado potato beetles and aphids",
            "Apply potassium-rich organic fertilizers during tuber swelling phase"
        ]
    },
    "Tomato___Early_blight": {
        "plant_name": "Tomato",
        "scientific_plant": "Solanum lycopersicum",
        "disease_name": "Early Blight",
        "pathogen": "Alternaria solani (Fungus)",
        "status": "Unhealthy",
        "is_healthy": False,
        "severity": "Moderate",
        "risk_color": "amber",
        "summary": "Early blight is a recurring fungal affliction affecting tomato foliage, stems, and fruits, marked by distinctive concentric bullseye rings.",
        "symptoms": [
            "Circular brown spots with characteristic concentric rings on lower, mature foliage",
            "Yellow chlorotic halos surrounding lesions leading to progressive lower leaf drop",
            "Sunken, dark, leathery lesions located at the stem-end calyx of tomatoes",
            "Dark brown stem cankers near the soil line (collar rot in seedlings)"
        ],
        "causes": [
            "Warm temperatures (24°C - 30°C / 75°F - 86°F)",
            "High relative humidity and splashing rainfall",
            "Fungal spores surviving on Solanaceous garden debris and nightshade weeds",
            "Foliage touching wet ground directly"
        ],
        "biological_treatments": [
            "Prune infected bottom leaves immediately with alcohol-sanitized shears",
            "Spray potassium bicarbonate or copper octanoate (soap) every 7 days",
            "Apply Bio-fungicides containing Streptomyces lydicus"
        ],
        "chemical_treatments": [
            "Chlorothalonil protective spray applied at the base and leaves",
            "Mancozeb or Azoxystrobin applications rotated sequentially",
            "Difenoconazole systemic treatment for active leaf infections"
        ],
        "prevention": [
            "Prune bottom 12-18 inches of leaves once plants reach 3 feet tall",
            "Stake or trellis tomato vines to elevate foliage far above damp soil",
            "Apply 2-3 inches of organic straw or plastic mulch around plant bases",
            "Rotate crops on a 3-year cycle without planting peppers, potatoes, or eggplants"
        ]
    },
    "Tomato___Late_blight": {
        "plant_name": "Tomato",
        "scientific_plant": "Solanum lycopersicum",
        "disease_name": "Late Blight",
        "pathogen": "Phytophthora infestans (Oomycete)",
        "status": "Unhealthy",
        "is_healthy": False,
        "severity": "Critical / Severe",
        "risk_color": "rose",
        "summary": "A destructive water-mold pathogen that causes rapid collapse of tomato foliage and hard, rotting brown patches on green and ripe fruit.",
        "symptoms": [
            "Water-soaked, greasy-looking grayish-green spots turning dark brown to black",
            "White velvety sporulation visible underneath leaf blades in cool, humid mornings",
            "Large, firm, sunken olive-brown greasy blotches on fruit shoulders",
            "Rapid stem browning leading to complete collapse of the vine canopy"
        ],
        "causes": [
            "Cool, persistently damp weather (15°C - 22°C / 60°F - 72°F)",
            "High humidity (>90%) with prolonged leaf dampness (>10 hours)",
            "Proximity to infected potato fields or volunteer plants"
        ],
        "biological_treatments": [
            "Immediately bag and remove heavily infested plants in sealed trash bags",
            "Preventative liquid copper sulfate spray before anticipated rain periods",
            "Foliar drench of Bacillus subtilis strain QST 713"
        ],
        "chemical_treatments": [
            "Fluopicolide (Presidio) or Cyazofamid (Ranman)",
            "Mandipropamid (Revus) combined with a contact protectant like Mancozeb",
            "Cymoxanil systemic eradicant within 24 hours of suspected spore release"
        ],
        "prevention": [
            "Plant resistant tomato varieties (e.g., 'Mountain Magic', 'Defiant PhR', 'Plum Regal')",
            "Space plants at least 24-36 inches apart for rapid sun drying",
            "Always use soaker hoses or drip irrigation; never overhead sprinklers",
            "Eliminate nightshade weeds (Solanum nigrum) from nearby borders"
        ]
    },
    "Tomato___healthy": {
        "plant_name": "Tomato",
        "scientific_plant": "Solanum lycopersicum",
        "disease_name": "Healthy",
        "pathogen": "None (Plant is in optimal vigor)",
        "status": "Healthy",
        "is_healthy": True,
        "severity": "None",
        "risk_color": "emerald",
        "summary": "The tomato foliage demonstrates peak vegetative vitality, intact cellular walls, and high photosynthetic capacity.",
        "symptoms": [
            "Vibrant, dark green compound leaflets with crisp serrated edges",
            "Sturdy, erect trichome-covered stems with flexible branches",
            "Uniform blossom sets and healthy green/ripening fruit clusters",
            "No chlorosis, leaf curl, necrotic flecking, or stunting"
        ],
        "causes": [
            "Proper soil pH (6.2 - 6.8), adequate calcium, consistent watering, and full sunlight"
        ],
        "biological_treatments": [
            "Regular compost top-dressing and aerated worm tea root drench",
            "Foliar seaweed extract every 14 days to boost cellular resistance"
        ],
        "chemical_treatments": [
            "No chemical intervention needed"
        ],
        "prevention": [
            "Maintain deep, consistent moisture (1-2 inches/week) to avoid calcium deficiency blossom-end rot",
            "Prune non-fruiting suckers for maximum solar illumination",
            "Ensure sturdy staking or Florida weave support systems",
            "Feed with balanced organic tomato fertilizer (e.g., 4-6-6 with micronutrients)"
        ]
    }
}

def get_disease_info(class_label: str) -> Dict[str, Any]:
    """Retrieve structured metadata and agronomic care for a given class label."""
    if class_label in DISEASE_DETAILS:
        info = dict(DISEASE_DETAILS[class_label])
        info["raw_class"] = class_label
        return info
    return {
        "plant_name": "Unknown",
        "scientific_plant": "Unknown",
        "disease_name": class_label,
        "pathogen": "Unspecified",
        "status": "Unknown",
        "is_healthy": False,
        "severity": "Unknown",
        "risk_color": "slate",
        "summary": "No specific botanical record found for this class.",
        "symptoms": [],
        "causes": [],
        "biological_treatments": [],
        "chemical_treatments": [],
        "prevention": [],
        "raw_class": class_label
    }
