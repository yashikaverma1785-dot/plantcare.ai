"""
PlantCare AI - Sample Leaf Image Generator
Creates realistic visual leaf images for the 6 plant disease classes
so examiners can test instantly without finding external images.
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_leaf_canvas(width=400, height=400, bg_color=(240, 244, 240)):
    img = Image.new("RGB", (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    return img, draw

def draw_compound_leaf(draw, center, base_color, leaf_type="tomato"):
    cx, cy = center
    # Draw central stem
    stem_color = (60, 95, 40)
    draw.line([(cx, cy + 160), (cx, cy - 140)], fill=stem_color, width=6)
    
    # Draw leaf lobes / leaflets
    angles = [-45, 45, -70, 70, 0] if leaf_type == "tomato" else [-50, 50, -60, 60, 0]
    lengths = [90, 90, 80, 80, 110]
    offsets = [40, 40, -40, -40, -130]

    for angle, length, dy in zip(angles, lengths, offsets):
        rad = math.radians(angle)
        lx = cx + length * math.sin(rad)
        ly = (cy + dy) - length * math.cos(rad)
        # Draw leaflet ellipse
        bbox = [
            min(cx, lx) - 25,
            min(cy + dy, ly) - 15,
            max(cx, lx) + 25,
            max(cy + dy, ly) + 15
        ]
        draw.ellipse(bbox, fill=base_color, outline=(40, 75, 30), width=2)
        # Leaf veins
        draw.line([(cx, cy + dy), (lx, ly)], fill=(75, 120, 50), width=2)

def generate_samples():
    classes = [
        ("potato_early_blight.jpg", "Potato Early Blight", (70, 125, 45), "early_blight", "potato"),
        ("potato_late_blight.jpg", "Potato Late Blight", (60, 110, 40), "late_blight", "potato"),
        ("potato_healthy.jpg", "Potato Healthy Leaf", (55, 145, 45), "healthy", "potato"),
        ("tomato_early_blight.jpg", "Tomato Early Blight", (75, 130, 40), "early_blight", "tomato"),
        ("tomato_late_blight.jpg", "Tomato Late Blight", (65, 115, 35), "late_blight", "tomato"),
        ("tomato_healthy.jpg", "Tomato Healthy Leaf", (50, 150, 40), "healthy", "tomato")
    ]

    for filename, label, base_col, condition, plant_type in classes:
        img, draw = create_leaf_canvas(400, 400)
        draw_compound_leaf(draw, (200, 200), base_col, plant_type)

        if condition == "early_blight":
            # Draw concentric bullseye rings
            spots = [(170, 180), (220, 230), (190, 270), (230, 150)]
            for sx, sy in spots:
                # Yellow halo
                draw.ellipse([sx - 24, sy - 24, sx + 24, sy + 24], fill=(185, 175, 50, 180))
                # Outer brown ring
                draw.ellipse([sx - 18, sy - 18, sx + 18, sy + 18], fill=(70, 45, 25))
                # Inner lighter ring
                draw.ellipse([sx - 12, sy - 12, sx + 12, sy + 12], fill=(110, 70, 40))
                # Center dark spot
                draw.ellipse([sx - 6, sy - 6, sx + 6, sy + 6], fill=(40, 25, 15))

        elif condition == "late_blight":
            # Large irregular water-soaked dark purplish lesions
            lesions = [(160, 160, 45, 35), (230, 220, 50, 40), (190, 290, 40, 30)]
            for lx, ly, rw, rh in lesions:
                draw.ellipse([lx - rw, ly - rh, lx + rw, ly + rh], fill=(50, 40, 45), outline=(90, 85, 80), width=2)
                # Pale water-soaked perimeter
                draw.ellipse([lx - rw + 6, ly - rh + 6, lx + rw - 6, ly + rh - 6], fill=(35, 25, 30))

        # Add slight texture / blur filter for realism
        img = img.filter(ImageFilter.SMOOTH_MORE)
        path = os.path.join(OUTPUT_DIR, filename)
        img.save(path, quality=95)
        print(f"Generated sample: {path}")

if __name__ == "__main__":
    generate_samples()
