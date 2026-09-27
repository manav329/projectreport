"""
Run this locally to inspect a downloaded .pth checkpoint before wiring it
into TerraSpectra's backend. It tells you what's actually inside the file
so you can decide whether it's compatible with src/model.py's
TerraSpectraCNN, or whether it needs a different model class instead.

Usage:
    python inspect_checkpoint.py path/to/downloaded_model.pth
"""

import sys
import torch


def main():
    if len(sys.argv) != 2:
        print("Usage: python inspect_checkpoint.py <path_to_pth_file>")
        sys.exit(1)

    path = sys.argv[1]
    print(f"Loading: {path}\n")

    obj = torch.load(path, map_location="cpu")

    # Figure out what kind of object this actually is.
    if isinstance(obj, dict):
        # Could be a raw state_dict, or a wrapper dict containing one.
        if all(isinstance(v, torch.Tensor) for v in obj.values()):
            state_dict = obj
            print("This is a raw state_dict (dict of tensors).")
        else:
            print("This is a wrapper dict. Top-level keys:")
            for k in obj.keys():
                print(f"  - {k}")
            # Common wrapper key names.
            for candidate in ("state_dict", "model_state_dict", "model"):
                if candidate in obj and isinstance(obj[candidate], dict):
                    state_dict = obj[candidate]
                    print(f"\nUsing nested key '{candidate}' as the state_dict.")
                    break
            else:
                print(
                    "\nCouldn't find a nested state_dict automatically — "
                    "inspect the keys above manually."
                )
                return
    else:
        print(f"This is a saved object of type {type(obj)}, not a state_dict.")
        print(
            "If this is a full pickled model (torch.save(model), not "
            "torch.save(model.state_dict())), it may carry its own "
            "architecture and not need src/model.py's class definition at "
            "all — but it also may not unpickle safely outside the exact "
            "environment it was saved in. Treat with caution."
        )
        return

    print(f"\nTotal parameter tensors: {len(state_dict)}")
    print("\nLayer names and shapes (first 20):")
    for i, (k, v) in enumerate(state_dict.items()):
        if i >= 20:
            print(f"  ... and {len(state_dict) - 20} more")
            break
        print(f"  {k:50s} {tuple(v.shape)}")

    # Heuristic architecture guess based on key naming patterns.
    keys_str = " ".join(state_dict.keys())
    print("\nArchitecture guess based on key names:")
    if "layer1" in keys_str and "layer4" in keys_str:
        print("  Looks like a torchvision ResNet (has layer1..layer4).")
    elif "features.0" in keys_str and "classifier" in keys_str and "0" in keys_str:
        print("  Looks like a plain features/classifier CNN (VGG-style or similar).")
    elif "blocks" in keys_str or "conv_stem" in keys_str:
        print("  Looks like an EfficientNet/MobileNet-style model (timm-style naming).")
    else:
        print("  Doesn't match a common recognizable naming pattern — inspect manually.")

    # Try to find the final classification layer's output size (num_classes).
    print("\nLooking for the final layer's output size (num_classes)...")
    last_weight_key = None
    for k, v in state_dict.items():
        if k.endswith(".weight") and v.dim() == 2:
            last_weight_key = k
    if last_weight_key:
        out_features = state_dict[last_weight_key].shape[0]
        print(f"  Final linear layer '{last_weight_key}' has {out_features} outputs.")
        print(f"  TerraSpectra needs exactly 6 outputs (one per disease class).")
        if out_features != 6:
            print(
                "  MISMATCH: this checkpoint was not trained for 6 classes — "
                "it is not a drop-in replacement for this project."
            )
        else:
            print(
                "  Output count matches 6 — but this does NOT guarantee the "
                "6 classes are the same diseases in the same order as "
                "TerraSpectra's. Check the source page for its class list."
            )
    else:
        print("  Couldn't automatically identify the final linear layer.")


if __name__ == "__main__":
    main()
