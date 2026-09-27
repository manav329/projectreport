# TerraSpectra

AI-based crop disease detection and forecasting.

## What this is

Right now this is a rice leaf disease classifier. Traditional crop
monitoring waits for symptoms to show up on the leaves (yellowing,
lesions, spots) before anything gets flagged. The goal here is to catch
disease patterns with a CNN instead of relying on someone walking the
field and eyeballing it.

The longer-term plan is to move past plain image classification into
something closer to a real monitoring platform - a hybrid CNN/ViT model,
an API to serve predictions, and a dashboard that shows disease risk over
a map instead of just a label on a single photo. That part isn't built
yet.

## Current prototype

Trained on a rice leaf dataset with six classes:

- Bacterial Leaf Blight
- Brown Spot
- Healthy
- Leaf Blast
- Leaf Scald
- Narrow Brown Spot

A CNN (transfer learning off a pretrained ResNet18, replacing the final
layer) does the classification. Nothing fancy yet - the goal for this
stage was getting a solid, honestly-evaluated baseline before touching
anything more complicated.

## Stack

Python, PyTorch, torchvision, NumPy, pandas, scikit-learn, matplotlib,
seaborn, OpenCV. Developed against Colab so GPU training is cheap.

Planned for later stages: Vision Transformer, FastAPI, React, Deck.gl,
Rasterio/GDAL for anything geospatial.

## Repo layout

TerraSpectra/
├── data/ dataset goes here (not checked in, see data/README.md)
├── notebooks/ exploratory notebooks
├── src/ training/eval code
├── models/ saved checkpoints
├── results/ metrics, plots, confusion matrices
├── docs/ roadmap / notes
├── requirements.txt
└── README.md


## Status

Baseline CNN training/eval pipeline is written and working. Nothing
past that is built yet - no ViT, no API, no dashboard. Those are next,
not "coming soon" filler.
