from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your model (Make sure 'scikit-learn' is installed in your env)
model = joblib.load("crop_model.pkl")

# Standard Kaggle Crop Labels (Ensure this order matches your training)
CROP_LABELS = [
    'apple', 'banana', 'blackgram', 'chickpea', 'coconut', 'coffee', 'cotton',
    'grapes', 'jute', 'kidneybeans', 'lentil', 'maize', 'mango', 'mothbeans',
    'mungbean', 'muskmelon', 'orange', 'papaya', 'pigeonpeas', 'pomegranate',
    'rice', 'watermelon'
]

class PredictionRequest(BaseModel):
    N: float
    P: float
    K: float
    ph: float
    annual_temp: float
    annual_humidity: float
    annual_rainfall: float
    season: str # "Kharif", "Rabi", or "Summer"


@app.post("/predict")
def predict_crop(data: PredictionRequest):
    # --- 1. SEASONAL ADJUSTMENT (Keep your existing logic) ---
    temp, hum, rain = data.annual_temp, data.annual_humidity, data.annual_rainfall
    if data.season == "Kharif":
        temp += 2.0; hum += 20.0; rain *= 0.8
    elif data.season == "Rabi":
        temp -= 5.0; hum -= 10.0; rain *= 0.1
    elif data.season == "Summer":
        temp += 8.0; hum -= 20.0; rain *= 0.05

    # --- 2. PREPARE INPUT ---
    input_df = pd.DataFrame([[
        data.N, data.P, data.K, temp, hum, data.ph, rain
    ]], columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])

    # --- 3. GET PROBABILITIES (The Magic Part) ---
    # This gives an array of probabilities for all crops
    probs = model.predict_proba(input_df)[0]
    
    # Get indices of the top 3 highest probabilities
    top_3_indices = np.argsort(probs)[-3:][::-1]
    
    results = []
    for idx in top_3_indices:
        crop_name = CROP_LABELS[idx].capitalize()
        confidence = round(probs[idx] * 100, 1)
        results.append({"crop": crop_name, "confidence": confidence})

    return {
        "success": True,
        "recommendations": results, # Returning a list now
        "adjusted_climate": {"temp": round(temp, 1), "hum": round(hum, 1), "rain": round(rain, 1)}
    }


# uvicorn main:app --reload 

