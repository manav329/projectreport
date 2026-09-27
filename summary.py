import sys
import os

print(f"Python version: {sys.version.split(' ')[0]}")
try:
    import torch
    print(f"CUDA available: {torch.cuda.is_available()}")
except ImportError:
    print("CUDA available: Unknown (torch not installed)")

checkpoint_status = "UNKNOWN"
if os.path.exists("docs/CHECKPOINT_PATH.txt"):
    with open("docs/CHECKPOINT_PATH.txt") as f:
        checkpoint_status = f.read().strip()
print(f"Checkpoint status: {checkpoint_status}")
