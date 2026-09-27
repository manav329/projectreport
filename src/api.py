import io
import logging
import sys
import traceback
import torch
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image

from src.model import load_model
from src.inference import predict_image
from src import geo

# Basic request logging setup
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout,
)
logger = logging.getLogger(__name__)

# Read checkpoint path at import time
CHECKPOINT_PATH = ""
try:
    with open("docs/CHECKPOINT_PATH.txt", "r", encoding="utf-8") as f:
        CHECKPOINT_PATH = f.read().strip()
except Exception as e:
    logger.error(f"Could not read docs/CHECKPOINT_PATH.txt: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Determine the device
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    app.state.device = device.type
    app.state.model = None
    app.state.model_error = None
    
    # Attempt to load the model
    try:
        app.state.model = load_model(CHECKPOINT_PATH, device)
        logger.info(f"Model loaded successfully on {device} from {CHECKPOINT_PATH}")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        app.state.model_error = str(e)
        
    yield

# Instantiate FastAPI application
app = FastAPI(title="TerraSpectra API", version="0.1.0", lifespan=lifespan)
app.include_router(geo.router)

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    response = await call_next(request)
    logger.info(f"{request.method} {request.url.path} - {response.status_code}")
    return response

# Health endpoint
@app.get("/health")
async def health():
    model_loaded = app.state.model is not None
    status = "ok" if model_loaded else "degraded"
    
    return {
        "status": status,
        "model_loaded": model_loaded,
        "device": app.state.device,
        "model_error": app.state.model_error,
    }

ADVISORIES = {
    "bacterial_leaf_blight": "Bacterial leaf blight detected. Consider applying copper-based bactericides and ensure proper field drainage.",
    "brown_spot": "Brown spot detected. Improve soil fertility and consider applying suitable fungicides if severe.",
    "healthy": "No action needed. Continue routine monitoring and proper agronomic practices.",
    "leaf_blast": "Leaf blast detected. Apply recommended systemic fungicides immediately and manage nitrogen fertilization.",
    "leaf_scald": "Leaf scald detected. Remove infected leaves and apply appropriate fungicides if the disease progresses.",
    "narrow_brown_spot": "Narrow brown spot detected. Ensure proper crop nutrition and apply fungicides at heading stage if required."
}

@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    try:
        if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
            return JSONResponse(
                status_code=415,
                content={
                    "status": "error",
                    "detail": f"Unsupported file type: {file.content_type}. Use JPEG, PNG, or WEBP."
                }
            )
            
        if app.state.model is None:
            return JSONResponse(
                status_code=503,
                content={
                    "status": "error",
                    "detail": f"Model is not loaded: {app.state.model_error}"
                }
            )
            
        contents = await file.read()
        try:
            image = Image.open(io.BytesIO(contents))
            image.verify()
            image = Image.open(io.BytesIO(contents))
        except Exception:
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "detail": "Could not decode image file."
                }
            )
            
        result = predict_image(app.state.model, image, app.state.device)
        
        # Merge status and advisory into the result
        response = {
            "status": "success",
            "prediction": result["prediction"],
            "confidence": result["confidence"],
            "probabilities": result["probabilities"],
            "advisory": ADVISORIES.get(result["prediction"], "")
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Internal error during inference: {e}")
        logger.error(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "detail": "Internal error during inference."
            }
        )
