"""
PlantCare AI - Discrete Mathematics Engine
Author: PlantCare AI Academic Team
Project: Leaf Disease Detection Using Machine Learning and Discrete Mathematics

This module executes real mathematical operations using Python set semantics,
relation calculus, and binary matrices for university Discrete Mathematics demonstrations.
"""

from typing import Set, Tuple, List, Dict, Any, Optional
import itertools

# Core Botanical Sets Defined Rigorously
SET_PLANTS: Set[str] = {"Tomato", "Potato"}
SET_DISEASES: Set[str] = {"Early Blight", "Late Blight", "Healthy"}
SET_PATHOGEN_TYPES: Set[str] = {"Fungus (Alternaria)", "Oomycete (Phytophthora)", "None (Benign)"}
SET_SEVERITY_LEVELS: Set[str] = {"None", "Moderate", "Critical"}

# Full botanical symptom vocabulary
SET_SYMPTOMS_TOMATO: Set[str] = {
    "Concentric bullseye rings",
    "Yellow halo margins",
    "Water-soaked oily lesions",
    "Stem purplish rot",
    "Vibrant dark foliage"
}

SET_SYMPTOMS_POTATO: Set[str] = {
    "Concentric bullseye rings",
    "Yellow halo margins",
    "Tuber dry coppery rot",
    "White undersurface sporulation",
    "Crisp uniform leaves"
}

# The Ground Truth Binary Plant-Disease Relation:
# R \subseteq SET_PLANTS \times SET_DISEASES
GROUND_TRUTH_RELATION: Set[Tuple[str, str]] = {
    ("Potato", "Early Blight"),
    ("Potato", "Late Blight"),
    ("Potato", "Healthy"),
    ("Tomato", "Early Blight"),
    ("Tomato", "Late Blight"),
    ("Tomato", "Healthy"),
}

# Pathogen Mapping Relation:
# R_pathogen \subseteq SET_DISEASES \times SET_PATHOGEN_TYPES
DISEASE_TO_PATHOGEN_RELATION: Set[Tuple[str, str]] = {
    ("Early Blight", "Fungus (Alternaria)"),
    ("Late Blight", "Oomycete (Phytophthora)"),
    ("Healthy", "None (Benign)")
}

# Severity Mapping Relation:
DISEASE_TO_SEVERITY_RELATION: Set[Tuple[str, str]] = {
    ("Early Blight", "Moderate"),
    ("Late Blight", "Critical"),
    ("Healthy", "None")
}


class DiscreteMathEngine:
    """
    Computes genuine Discrete Mathematics operations on sets and binary relations.
    All results are calculated dynamically using Python set and relation theory.
    """

    @staticmethod
    def set_union(set_a: Set[str], set_b: Set[str]) -> Set[str]:
        r"""A \cup B = { x | x \in A \lor x \in B }"""
        return set(set_a) | set(set_b)

    @staticmethod
    def set_intersection(set_a: Set[str], set_b: Set[str]) -> Set[str]:
        r"""A \cap B = { x | x \in A \land x \in B }"""
        return set(set_a) & set(set_b)

    @staticmethod
    def set_difference(set_a: Set[str], set_b: Set[str]) -> Set[str]:
        r"""A \setminus B = { x | x \in A \land x \notin B }"""
        return set(set_a) - set(set_b)

    @staticmethod
    def set_symmetric_difference(set_a: Set[str], set_b: Set[str]) -> Set[str]:
        r"""A \Delta B = (A \setminus B) \cup (B \setminus A)"""
        return set(set_a) ^ set(set_b)

    @staticmethod
    def cartesian_product(set_a: Set[str], set_b: Set[str]) -> List[Tuple[str, str]]:
        r"""A \times B = { (a, b) | a \in A \land b \in B }"""
        a_sorted = sorted(list(set_a))
        b_sorted = sorted(list(set_b))
        return [(a, b) for a in a_sorted for b in b_sorted]

    @staticmethod
    def is_subset(set_a: Set[str], set_b: Set[str]) -> bool:
        r"""A \subseteq B \iff \forall x (x \in A \implies x \in B)"""
        return set(set_a).issubset(set(set_b))

    @staticmethod
    def is_proper_subset(set_a: Set[str], set_b: Set[str]) -> bool:
        r"""A \subset B \iff A \subseteq B \land A \neq B"""
        return set(set_a) < set(set_b)

    @staticmethod
    def power_set(set_a: Set[str]) -> List[List[str]]:
        r"""\mathcal{P}(A) = { S | S \subseteq A } with |\mathcal{P}(A)| = 2^{|A|}"""
        s_list = sorted(list(set_a))
        result = []
        for r in range(len(s_list) + 1):
            for combo in itertools.combinations(s_list, r):
                result.append(list(combo))
        return result

    @staticmethod
    def relation_domain(relation: Set[Tuple[str, str]]) -> Set[str]:
        r"""dom(R) = { a \in A | \exists b \in B, (a, b) \in R }"""
        return {a for (a, _) in relation}

    @staticmethod
    def relation_range(relation: Set[Tuple[str, str]]) -> Set[str]:
        r"""ran(R) = { b \in B | \exists a \in A, (a, b) \in R }"""
        return {b for (_, b) in relation}

    @staticmethod
    def relation_inverse(relation: Set[Tuple[str, str]]) -> Set[Tuple[str, str]]:
        r"""R^{-1} = { (b, a) \in B \times A | (a, b) \in R }"""
        return {(b, a) for (a, b) in relation}

    @staticmethod
    def relation_composition(r1: Set[Tuple[str, str]], r2: Set[Tuple[str, str]]) -> Set[Tuple[str, str]]:
        r"""
        R2 \circ R1 = { (a, c) | \exists b ((a, b) \in R1 \land (b, c) \in R2) }
        """
        result = set()
        for (a, b1) in r1:
            for (b2, c) in r2:
                if b1 == b2:
                    result.add((a, c))
        return result

    @staticmethod
    def is_member_of_relation(pair: Tuple[str, str], relation: Set[Tuple[str, str]]) -> bool:
        r"""(a, b) \in R"""
        return pair in relation

    @staticmethod
    def build_relation_matrix(
        set_a: List[str],
        set_b: List[str],
        relation: Set[Tuple[str, str]]
    ) -> Dict[str, Any]:
        r"""
        Construct the Binary Incidence Matrix M_R where M_R[i][j] = 1 if (a_i, b_j) \in R else 0.
        """
        matrix: List[List[int]] = []
        for a in set_a:
            row = []
            for b in set_b:
                row.append(1 if (a, b) in relation else 0)
            matrix.append(row)
        return {
            "row_headers": set_a,
            "col_headers": set_b,
            "matrix": matrix
        }

    @staticmethod
    def check_relation_properties_homo(
        elements: List[str],
        relation: Set[Tuple[str, str]]
    ) -> Dict[str, Any]:
        r"""
        Evaluate binary relation properties for a relation on a single set S \times S:
        - Reflexive: \forall x \in S, (x, x) \in R
        - Symmetric: \forall x, y \in S, (x, y) \in R \implies (y, x) \in R
        - Anti-Symmetric: \forall x, y \in S, ((x, y) \in R \land (y, x) \in R) \implies x = y
        - Transitive: \forall x, y, z \in S, ((x, y) \in R \land (y, z) \in R) \implies (x, z) \in R
        - Equivalence: Reflexive \land Symmetric \land Transitive
        """
        # Reflexivity
        reflexive = True
        reflexive_counterexamples = []
        for x in elements:
            if (x, x) not in relation:
                reflexive = False
                reflexive_counterexamples.append(f"({x}, {x}) \u2209 R")

        # Symmetry
        symmetric = True
        symmetric_counterexamples = []
        for (x, y) in relation:
            if (y, x) not in relation:
                symmetric = False
                symmetric_counterexamples.append(f"({x}, {y}) \u2208 R but ({y}, {x}) \u2209 R")

        # Anti-symmetry
        antisymmetric = True
        antisymmetric_counterexamples = []
        for (x, y) in relation:
            if x != y and (y, x) in relation:
                antisymmetric = False
                antisymmetric_counterexamples.append(f"({x}, {y}) and ({y}, {x}) \u2208 R with {x} \u2260 {y}")

        # Transitivity
        transitive = True
        transitive_counterexamples = []
        for (x, y) in relation:
            for (y2, z) in relation:
                if y == y2 and (x, z) not in relation:
                    transitive = False
                    transitive_counterexamples.append(f"({x}, {y}) & ({y}, {z}) \u2208 R but ({x}, {z}) \u2209 R")

        is_equivalence = reflexive and symmetric and transitive

        return {
            "reflexive": reflexive,
            "reflexive_counterexamples": reflexive_counterexamples[:3],
            "symmetric": symmetric,
            "symmetric_counterexamples": symmetric_counterexamples[:3],
            "antisymmetric": antisymmetric,
            "antisymmetric_counterexamples": antisymmetric_counterexamples[:3],
            "transitive": transitive,
            "transitive_counterexamples": transitive_counterexamples[:3],
            "is_equivalence": is_equivalence
        }

    @staticmethod
    def analyze_prediction_relation(
        plant: str,
        disease: str,
        confidence: float
    ) -> Dict[str, Any]:
        """
        Rigorous mathematical analysis connecting the ML model prediction to the Discrete Math relation.
        Calculates domain, range, membership, inverse mapping, fibers, and composition.
        """
        pair = (plant, disease)
        is_member = pair in GROUND_TRUTH_RELATION

        # Domain and Range of Ground Truth Relation
        dom_r = sorted(list(DiscreteMathEngine.relation_domain(GROUND_TRUTH_RELATION)))
        ran_r = sorted(list(DiscreteMathEngine.relation_range(GROUND_TRUTH_RELATION)))

        # Inverse Relation
        inv_relation = DiscreteMathEngine.relation_inverse(GROUND_TRUTH_RELATION)
        inv_pair = (disease, plant)
        inv_member = inv_pair in inv_relation

        # Fiber / Pre-image of the disease: f^{-1}(disease) = { p \in P | (p, disease) \in R }
        fiber_plants = sorted([p for (p, d) in GROUND_TRUTH_RELATION if d == disease])

        # Image of the plant: R(plant) = { d \in D | (plant, d) \in R }
        image_diseases = sorted([d for (p, d) in GROUND_TRUTH_RELATION if p == plant])

        # Matrix Representation
        sorted_plants = sorted(list(SET_PLANTS))
        sorted_diseases = sorted(list(SET_DISEASES))
        matrix_data = DiscreteMathEngine.build_relation_matrix(
            sorted_plants,
            sorted_diseases,
            GROUND_TRUTH_RELATION
        )

        # Highlight coordinates in matrix
        row_idx = sorted_plants.index(plant) if plant in sorted_plants else -1
        col_idx = sorted_diseases.index(disease) if disease in sorted_diseases else -1

        # Relational composition: R_composite = R_pathogen \circ R_plant_disease
        # Gives (Plant, Pathogen)
        composite_relation = DiscreteMathEngine.relation_composition(
            GROUND_TRUTH_RELATION,
            DISEASE_TO_PATHOGEN_RELATION
        )
        pathogen_for_prediction = [path for (d, path) in DISEASE_TO_PATHOGEN_RELATION if d == disease]
        pathogen = pathogen_for_prediction[0] if pathogen_for_prediction else "Unknown"

        return {
            "prediction_pair": {"plant": plant, "disease": disease},
            "latex_pair": f"({plant}, \\text{{{disease}}})",
            "is_member_of_relation": is_member,
            "membership_statement": f"({plant}, \\text{{{disease}}}) \\in R" if is_member else f"({plant}, \\text{{{disease}}}) \\notin R",
            "domain": dom_r,
            "range": ran_r,
            "inverse_pair": {"disease": disease, "plant": plant},
            "inverse_latex": f"(\\text{{{disease}}}, {plant}) \\in R^{{-1}}",
            "inverse_member": inv_member,
            "plant_image": image_diseases,
            "disease_preimage_fiber": fiber_plants,
            "matrix_data": matrix_data,
            "active_cell": {"row": row_idx, "col": col_idx},
            "pathogen": pathogen,
            "composite_pair": (plant, pathogen),
            "composite_membership": (plant, pathogen) in composite_relation,
            "discrete_proof": {
                "step1": f"Let Set of Plants P = \\{{{', '.join(sorted_plants)}\\}} and Diseases D = \\{{{', '.join(sorted_diseases)}\\}}.",
                "step2": f"Cartesian Product |P \\times D| = |P| \\times |D| = {len(sorted_plants)} \\times {len(sorted_diseases)} = {len(sorted_plants) * len(sorted_diseases)} pairs.",
                "step3": f"Binary Relation R \\subseteq P \\times D contains {len(GROUND_TRUTH_RELATION)} valid pairs.",
                "step4": f"The model classifies input as {plant} with condition '{disease}' (confidence: {confidence * 100:.2f}%).",
                "step5": f"Evaluation: ({plant}, '{disease}') \\in R yields Truth Value: {str(is_member).upper()}."
            }
        }
