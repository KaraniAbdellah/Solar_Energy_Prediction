# Run backend with this: uv run fastapi dev
from fastapi import FastAPI 
from pydantic import BaseModel
import torch.nn as nn
import torch


# create app
app = FastAPI()


# create baseModel
class Item(BaseModel):
    ghi: float
    humidity: float
    temp: float
    sunlightTime: float
    dayLength: float
    SunlightTime_daylength: float


# Load The Model
model = nn.Sequential(
    nn.Linear(7, 12), # input layer with 7 neuron + hidden layer with 12 layer
    nn.ReLU(),
    nn.Linear(12, 7), # second hidden layer with 7 neuron
    nn.ReLU(),
    nn.Linear(7, 1), # last layer with 1 neuron - Ouput layer
    # nn.Sigmoid() # We already scale the data
)
model.load_state_dict(torch.load('./model/model_weights.pth'))



@app.get("/hello-world")
async def helloWorld():
    return {"greeting": "hello world"}


@app.post("/get-prediction")
async def getPrediction(item: Item):
    # Get Rows as Float
    ghi = item.ghi
    humidity = item.humidity
    temp = item.temp
    sunlightTime = item.sunlightTime
    dayLength = item.dayLength
    SunlightTime_daylength = item.SunlightTime_daylength

    # Apply Transformation
    
    
    # Use Model to Predict
    
    # Send Prediction
    
    return {"item": item}



