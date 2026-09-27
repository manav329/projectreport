import sys
import json
import torch
from torchvision import transforms
from PIL import Image

from src.model import load_model, CLASS_NAMES

IMAGE_TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_image(model: torch.nn.Module, image: Image.Image, device: torch.device) -> dict:
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    image_tensor = IMAGE_TRANSFORM(image).unsqueeze(0).to(device)
    
    with torch.no_grad():
        logits = model(image_tensor)
        probs = torch.softmax(logits, dim=1).squeeze(0)
        
    probs_list = probs.tolist()
    
    top_prob, top_idx = torch.max(probs, dim=0)
    top_class = CLASS_NAMES[top_idx.item()]
    
    probabilities = {
        class_name: round(prob, 4)
        for class_name, prob in zip(CLASS_NAMES, probs_list)
    }
    
    return {
        "prediction": top_class,
        "confidence": round(top_prob.item(), 4),
        "probabilities": probabilities
    }

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(f"Usage: python -m src.inference <checkpoint> <image_path>")
        sys.exit(1)
        
    checkpoint_path = sys.argv[1]
    image_path = sys.argv[2]
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    try:
        model = load_model(checkpoint_path, device)
    except Exception as e:
        print(f"Error loading model: {e}")
        sys.exit(1)
        
    try:
        image = Image.open(image_path)
    except Exception as e:
        print(f"Error loading image: {e}")
        sys.exit(1)
        
    result = predict_image(model, image, device)
    
    print(json.dumps(result, indent=4))
