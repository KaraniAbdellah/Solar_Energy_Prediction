# Run backend with this: uv run fastapi dev
from fastapi import FastAPI 
from pydantic import BaseModel
import torch.nn as nn
import torch
import numpy as np
import joblib
import pandas as pd



# create app
app = FastAPI()


# create baseModel
class Item(BaseModel):
    ghi: float
    is_sun: int
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


# Load The Scaler_x and Scaler_y
scaler_x = joblib.load("./model/scaler_x.pkl")
scaler_y = joblib.load("./model/scaler_y.pkl")



@app.get("/hello-world")
async def helloWorld():
    return {"greeting": "hello world"}


@app.post("/get-prediction")
async def getPrediction(item: Item):
    rows = pd.DataFrame(
        [[item.ghi, item.temp, item.humidity, item.is_sun, item.sunlightTime, item.dayLength, item.SunlightTime_daylength]],
        columns=[
            "GHI",
            "temp",
            "humidity",
            "isSun",
            "sunlightTime",
            "dayLength",
            "SunlightTime/daylength",
        ],
    )

    # Transformation
    rows["GHI"] = np.log1p(rows["GHI"])
    rows["temp"] = rows["temp"]
    rows["humidity"] = np.sqrt(rows["humidity"])
    rows["isSun"] = rows["isSun"]
    rows["sunlightTime"] = np.log1p(rows["sunlightTime"])
    rows["dayLength"] = np.sqrt(rows["dayLength"])
    rows["SunlightTime/daylength"] = np.sqrt(rows["SunlightTime/daylength"])

    # Scale the Values
    rows_scalled = scaler_x.transform(rows)

    # Convert Rows Into Tensor
    rows_tensor = torch.tensor(rows_scalled, dtype=torch.float32)
    print(rows_tensor)

    # Prediction
    pred = model(rows_tensor)
    print(pred)

    return {"Energy": pred.item()}



