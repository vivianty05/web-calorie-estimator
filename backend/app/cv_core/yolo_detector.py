from ultralytics import YOLO
import os
from collections import defaultdict  

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), "model", "best.pt")        # Safely build the path to the model file in a cross-platform way
model = YOLO(model_path)

def detect_ingredients(imagepath: str, save_result=False):
    results = model(imagepath)
    
    if save_result:
        save_dir = "images/debug"
        os.makedirs(save_dir, exist_ok=True)
        results[0].save(filename=os.path.join(save_dir, os.path.basename(imagepath)))
        print(f"[DEBUG] Saved YOLO image result to {save_dir}/{os.path.basename(imagepath)}")

    label_counts = defaultdict(int)         # keeps track of counts per label
    for result in results:
        names = result.names
        for cls in result.boxes.cls:
            label = names[int(cls)]
            label_counts[label] += 1

    output = [{"name": label.replace("_", " ").lower(), "quantity": count} for label, count in label_counts.items()]
    return output