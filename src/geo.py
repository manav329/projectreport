import math
import random
import hashlib
from fastapi import APIRouter, Query

router = APIRouter(prefix="/api/map")

@router.get("/disease-heatmap")
def disease_heatmap(
    center_lat: float,
    center_lng: float,
    grid_size: int = Query(10, ge=1, le=50),
    spacing_m: float = 50.0,
    week: int = Query(1, ge=1, le=4)
):
    """
    MOCK DATA: simulates hyperspectral field risk for dashboard development.
    Replace with a real ingestion pipeline (Rasterio/GDAL) before any
    production use.
    """
    features = []
    
    lat_delta = spacing_m / 111320.0
    
    # Avoid division by zero at the poles
    cos_lat = math.cos(math.radians(center_lat))
    if abs(cos_lat) < 1e-6:
        cos_lat = 1e-6
    lng_delta = spacing_m / (111320.0 * cos_lat)
    
    for y in range(grid_size):
        for x in range(grid_size):
            offset_y = y - (grid_size - 1) / 2.0
            offset_x = x - (grid_size - 1) / 2.0
            
            point_lat = center_lat + offset_y * lat_delta
            point_lng = center_lng + offset_x * lng_delta
            
            seed_str = f"{x}-{y}-{week}"
            seed_val = int(hashlib.md5(seed_str.encode()).hexdigest()[:8], 16)
            random.seed(seed_val)
            
            # Make risk generally increase with week on average
            risk_score = min(1.0, max(0.0, random.random() * (week / 4.0)))

            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [point_lng, point_lat]},
                "properties": {
                    "risk_score": round(risk_score, 4),
                    "week": week,
                    "grid_x": x,
                    "grid_y": y
                }
            })
            
    return {
        "type": "FeatureCollection",
        "features": features
    }
