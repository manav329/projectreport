import os
import torch
import torchvision.models as models

# The class names order matches the alphabetical sorting used by torchvision.datasets.ImageFolder
# during the training process in the notebook.
CLASS_NAMES = [
    "bacterial_leaf_blight",
    "brown_spot",
    "healthy",
    "leaf_blast",
    "leaf_scald",
    "narrow_brown_spot"
]

def build_model(num_classes: int = 6) -> torch.nn.Module:
    """
    Instantiates a ResNet18 model without pretrained weights,
    replaces the final fully connected layer to output `num_classes`,
    and returns the model.
    """
    model = models.resnet18(weights=None)
    model.fc = torch.nn.Linear(model.fc.in_features, num_classes)
    return model

def load_model(checkpoint_path: str, device: torch.device) -> torch.nn.Module:
    """
    Builds the model, loads the state dict from the checkpoint,
    sets the model to eval mode, moves it to the device, and returns it.
    """
    if not os.path.exists(checkpoint_path):
        raise RuntimeError(f"Checkpoint file not found: {checkpoint_path}")

    model = build_model(num_classes=len(CLASS_NAMES))
    
    checkpoint = torch.load(checkpoint_path, map_location=device)
    
    # Handle raw state_dict vs dict with "state_dict" or "model_state_dict" key
    if isinstance(checkpoint, dict):
        if "state_dict" in checkpoint:
            state_dict = checkpoint["state_dict"]
        elif "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]
        else:
            state_dict = checkpoint
    else:
        state_dict = checkpoint
        
    model.load_state_dict(state_dict)
    model.eval()
    model.to(device)
    
    return model
