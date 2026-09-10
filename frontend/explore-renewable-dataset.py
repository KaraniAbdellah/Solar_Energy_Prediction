# Generated from: explore-renewable-dataset.ipynb
# Converted at: 2026-09-10T20:07:18.943Z
# Next step (optional): refactor into modules & generate tests with RunCell
# Quick start: pip install runcell

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import kagglehub
from scipy import stats # for Box-Cox Tranformer
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import PowerTransformer

# ## Feature Engineering Steps


# - **Data Cleaning**:
#     - Handle missing values
#     - Remove duplicates
#     - Fix incorrect data
# - **EDA**:
#     - Check numerical features and categorical features
#     - Check outliers
#     - Check Distribution Fr Tranormation
#     - Correlation For Linear Model
#     - Feature selection
# - **Data Processing**
#     - Encode categorical variables
#     - Log transformations
#     - Scale/normalize features
#     - Create new features
# - **Feature Scaling**
#     - Min-Max scaling
#     - Standard scaling


# ### Load The Data


path = kagglehub.dataset_download("abdellahkarani/renewable")
print(path)

df = pd.read_csv("/kaggle/input/datasets/abdellahkarani/renewable/Renewable.csv")
df.head(3)

# ### Data Cleaning
# 


'''
    Columns Description:
        - Energy delta [WH]: Target Varaible
        - GHI (Irradiance): كمية الضو ديال الشمس لي كتوصل للأرض
            كلما طالع = طاقة أكثر
        - isSun: 0: night, 1: day
        - sunlightTime: time thst sun exit
        - dayLength:
        - SunlightTime/daylength: clean day or a little there is a little of cloud
            the values almost 1 --> clean day
        - clouds_all: percentage of clouds
            more clouds less energy
        - weather_type: type of weather
            0, 1, 2, 3, 4
        - humidity: ....
            low humidity = high energey
        - rain_1h: rain in last one hour
            affect energy
        - snow_1h: snow in last one hour
            affect a lot energy
        - temp
            hight temp = high energy
        - wind_speed
        - pressure
        - hour
        - month
'''

# df.describe()
df.info()

df.head(2)

# Check Data Types
'''
    - We need to Encode Time - https://www.youtube.com/results?search_query=Encoding+Time+Information+as+Features+for+ML+Models
    - No Categorical Varaibles, Nominal, Ordinal
    - One Hot Encoding - Label Coding
'''
df.info()

# Check missng values
'''
    No null value in data
'''
df.isnull().sum()

# Remove Duplicates - Duplicates Rows
'''
    - No Duplicates Rows
'''
df.duplicated().sum()

# ### Exploratory Data Analysis


# Check Outliers - Using Scatter Plot
# https://www.youtube.com/watch?v=2r5Uii9zB78
# https://www.youtube.com/watch?v=Ds7s7GhYIVA
'''
    [20, 22, 21, 23, 19, 120]
        --> most values arround 20-23
        --> but 120 is far --> this is an outlier

    Outliers: data point that is very different from other points

    - Why:
        - In Mean Calculation The Outlier Affect A lot
            that we use median as mesure of center

    - How to detect them:
        - IQR (Any X Not in [Q1 - 1.5 * IQR, Q3 + 1.5 * IQR] is an Outlier) methods
            --> we handle this by removing outliers Or replace by upper or lower
        - Z-score: calculte z-score for each sample
'''
df.head(3)

# Using IQR
c_df = df.drop(["Time"], axis=1)

for column in c_df.columns:
    q1 = c_df[column].quantile(0.25)
    q3 = c_df[column].quantile(0.75)
    iqr = q3 - q1
    lower_limit = q1 - (1.5 * iqr)
    upper_limit = q3 + (1.5 * iqr)
    # print(f"Columns = {column} And iqr = {iqr}")
    # print("Upper limit", upper_limit)
    # print("Lower limit", lower_limit)

    # Any Value Not in Range --> Remove it (Timming) or Replace it (Capping)
    # c_df[column] = np.clip(c_df[column], lower_limit, upper_limit)
    number_of_outliers = np.where(
        (c_df[column] > upper_limit) | (c_df[column] < lower_limit),
        1,
        0
    )
    print(f"Number of Outlier for {column} is {number_of_outliers.sum()}")


# Using Z-score
from scipy.stats import zscore
# df['Z-score'] = zscore(df['temp'])
df.head()

c_df.head(3)

c_df["dayLength"].unique()

# Visual the Correlation
'''
    - Correlation: Relation between two varaibles (X increase so Y increase or ....)
    - Covaraince: How two varaibles change together (direction [move together or opposite])

    - Why:
        - Detect multicollinearity: If feature high correlated [problem for RLM]
        - No Linear Model Does not Affect by Correlation

    - Description:
        - Big Correlation (|r| >= 0.7): (Energy, GHI) 
        - Meduim Correlation (0.3 <= |r| < 0.7): ...
        - Small Correlation (|r| < 0.3): ...

    - For Multiple Linear Regression:
        - We need to handle part of two varaibles high correlated ????
'''
plt.figure(figsize=(12, 8))
df_without_time = df.drop(["Time"], axis=1)
sns.heatmap(df_without_time.corr(), annot=True)
plt.show()

# Check Feature distributions - With Histogram - With Kernel Density Estimate (KDE)
'''
    After Correlation I found This Feature With hight Correaltion With Target:
        --> GHI, temp, humidity, isSun, sunlightLength, dayLenght and sunlightLength/dayLenght
    - Energy: Left Skewness - Square Transformation
    - GHI: Left Skewness - Square Transformation
    - temp: Normal Skweness
    - humidity: Right Skweness  - Root Square Transformation
    - isSun: [0, 1]
    - sunLighTime: Left Skweness - Square Transformation
    - dayLength: Normalization/Standardization
    - sunLighTimedayLenght: Left Skweness - Square Transformation
'''

cols = c_df.columns
fig, axes = plt.subplots(4, 4, figsize=(15, 12))
axes = axes.flatten()

for ax, col in zip(axes, cols):
    sns.histplot(c_df[col], kde=True, bins=20, ax=ax)
    ax.set_title(col)

plt.tight_layout()
plt.show()

c_df["clouds_all"].unique().sum()

# ### Data Processing


# Columns you want to keep
cols = [
    "Energy delta[Wh]",
    "GHI",
    "temp",
    "humidity",
    "isSun",
    "sunlightTime",
    "dayLength",
    "SunlightTime/daylength"
]

# Create a new DataFrame with only these columns
w_df = c_df[cols].copy()
w_df.head(3)

# Handling Unblanced Dataset - We are in Regression Problem (Aime to predict the Energy)
'''
  - in Classification problem:
    means one class dominate to all samples
      --> 95% “No Fraud” && 5% “Fraud”
  - in Regression problem:
    - We can see a skewed target distribution. where most values are concentrated in one region.
    - problme happend with target varaible
'''

# Handle The Outliers
for column in w_df.columns:
    q1 = w_df[column].quantile(0.25)
    q3 = w_df[column].quantile(0.75)
    iqr = q3 - q1
    lower_limit = q1 - (1.5 * iqr)
    upper_limit = q3 + (1.5 * iqr)
    w_df[column] = np.clip(w_df[column], lower_limit, upper_limit)
    number_of_outliers = np.where(
        (w_df[column] > upper_limit) | (w_df[column] < lower_limit),
        1,
        0
    )
    print(f"Number of Outlier for {column} is {number_of_outliers.sum()}")


w_df.head(3)

# Check Feature distributions - With Histogram - With Kernel Density Estimate (KDE)
'''
    - We use neural network (no linear model) we do not need to force normal distribution
    After Correlation I found This Feature With hight Correaltion With Target:
        --> GHI, temp, humidity, isSun, sunlightLength, dayLenght and sunlightLength/dayLenght
    - Energy: Left Skewness - Square root transformation
    - GHI: Left Skewness - Square Transformation
    - temp: Normal(Gaussian) distribution. Skweness - Min-Max Normalisation
    - humidity: Right Skweness  - Root Square Transformation
    - isSun: [0, 1]
    - sunLighTime: Left Skweness - Square Transformation
    - dayLength: Normalization/Standardization
    - SunlightTime/daylength: Left Skweness - Square Transformation
'''

# Problem in + 1 in SQRT
w_df["Energy delta[Wh]"] = np.log1p(w_df["Energy delta[Wh]"])
w_df["GHI"] = np.log1p(w_df["GHI"])
w_df["humidity"] = np.sqrt(w_df["humidity"])
w_df["temp"] = w_df["temp"]
w_df["sunlightTime"] = np.log1p(w_df["sunlightTime"])
w_df["dayLength"] = np.sqrt(w_df["dayLength"])
w_df["SunlightTime/daylength"] = np.sqrt(w_df["SunlightTime/daylength"])


# Display Features Distribution
fig, axes = plt.subplots(3, 3, figsize=(15, 12))
axes = axes.flatten()

for ax, col in zip(axes, w_df.columns):
    sns.histplot(c_df[col], kde=True, bins=20, ax=ax)
    ax.set_title(col)

plt.tight_layout()
plt.show()

# ### Split The Data


from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler

# Data Spliting
X = w_df.drop(["Energy delta[Wh]"], axis=1)
y = w_df["Energy delta[Wh]"]

# Split The Data
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, test_size=.3, shuffle=True)

# If we scale before split the data - Data Leaking

scaler_x = MinMaxScaler()
scaler_y = MinMaxScaler()

# Feature Scaling - Ensure all feature contribute Equal to model
'''
    - Min-Max scaling: Rescales values to a fixed range like 0 to 1.
    - Standard scaling: Standardizes features to have mean 0 and variance 1

    NOTE 1: We should scaler X and scaler Y. each part has own scaler
'''

X_train_scalled = scaler_x.fit_transform(X_train)
X_test_scalled = scaler_x.transform(X_test)
y_train_scalled = scaler_y.fit_transform(y_train.values.reshape(-1, 1))
y_test_scalled = scaler_y.transform(y_test.values.reshape(-1, 1))

# ### Model Traning With Sckit Learn - Cause Of Production Problem With PyTorch


# Implement Light Weight Version 
from sklearn.neural_network import MLPRegressor
import joblib

X_train
regr = MLPRegressor(random_state=1, max_iter=2000, tol=0.1)
regr.fit(X_train, y_train)

regr.predict(X_test[:2])
regr.score(X_test, y_test)

# Save Model
joblib.dump(regr, "model.pkl")
joblib.dump(scaler_x, "scaler_x.pkl")
joblib.dump(scaler_y, "scaler_y.pkl")

#Download The Model
from IPython.display import FileLink

FileLink("./model.pkl")


# Load Model

# ### Model Traning With PyTorch


import torch
# For Neural Network Model
import torch.nn as nn
# For Optimizer
import torch.optim as optim

y_train = np.array(y_train)
X_train = np.array(X_train)
X_test = np.array(X_test)
y_test = np.array(y_test)
X_train

# Convert to PyTorch tensors
X_train_tensor = torch.tensor(X_train_scalled, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train_scalled, dtype=torch.float32).reshape(-1, 1)
X_test_tensor = torch.tensor(X_test_scalled, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test_scalled, dtype=torch.float32).reshape(-1, 1)

# Define The Model
'''
    - is to define function that take input and return output
    - model can be defined with squence of layers
    - define number of inputs (7 inputs and one output)

    The model expects rows of data with 7 variables (the first argument at the first layer set to 7)
    The first hidden layer has 12 neurons, followed by a ReLU activation function
    The second hidden layer has 7 neurons, followed by another ReLU activation function
    The output layer has one neuron, followed by a sigmoid activation function

    - NOTES: if data scalled with minMax or ... --> no sigMoid Function
'''

# - Linear: for layer definition
# - Sequential: for model arch - best arch get it by experimentation
model = nn.Sequential(
    nn.Linear(7, 12), # input layer with 7 neuron + hidden layer with 12 layer
    nn.ReLU(),
    nn.Linear(12, 7), # second hidden layer with 7 neuron
    nn.ReLU(),
    nn.Linear(7, 1), # last layer with 1 neuron - Ouput layer
    # nn.Sigmoid() # We already scale the data
)
print(model)

# Preparing for Training
'''
    We need two things:
        - Optimizer for finding the minuma of our function
        - We need Loss function [Classification {binary cross entropy}, Regression {MSE}]
'''
loss_fn = nn.MSELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Traning The Model
'''
    Traning Model takes in epoch and batches
    - Epoch: each sample we calculte DSG
    - Batch: each group of sample (one epoch = one batch)
    --> size of batch limited to system memory
    --> we use batch for avoid traning take a long time - But Not Good Sometimes
'''


n_epochs = 200
batch_size = 10
# Convert to PyTorch tensors
for epoch in range(n_epochs):
    total_loss = 0
    for i in range(0, len(X_train_tensor), batch_size):
        Xbatch = X_train_tensor[i:i+batch_size]
        ybatch = y_train_tensor[i:i+batch_size]

        y_pred = model(Xbatch)

        loss = loss_fn(y_pred, ybatch)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    avg_loss = total_loss / (len(X_train) / batch_size)

    print(f"Epoch {epoch+1}/{n_epochs}, Loss: {avg_loss:.4f}")

# 


# ### Model Prediction


print(type(X_test))

# Prediction + Inverse Transformation
'''
    - We want to predict the energy 
    - We Apply Transformation to Energy Followed by MinMax Scaler

    --> Reverse the MinMaxScaler:
        y_pred_log = scaler_y.inverse_transform(y_pred_scaled)
        
    --> Reverse the Log transformation:
        y_pred_real = np.expm1(y_pred_log)
'''

# Get Prediction
y_pred_scaled = model(X_test_tensor).detach().numpy()

# Reverse Scaling
y_pred = scaler_y.inverse_transform(y_pred_scaled)

# Get Real Value by removing log1 transformation
y_pred_real = np.expm1(y_pred)
y_pred_real = np.array(y_pred_real).reshape(-1)
y_pred_real

# ### Model Evolution


from sklearn.metrics import mean_absolute_error, r2_score

# Reverse The Y Test
y_test_real = np.expm1(y_test)
y_test_real

mea = mean_absolute_error(y_test_real, y_pred_real)
r2 = r2_score(y_test_real, y_pred_real)
print("MEA:", mea)
print("R² Score:", r2)

# #### Save and Load The Model


import joblib
# Save the model - Only The Weights Without Architecture, Optimizer state, ...
'''
    - We must save also the scalers to use it in backend.
'''

torch.save(model.state_dict(), 'model_weights.pth')
joblib.dump(scaler_x, 'scaler_x.pkl')
joblib.dump(scaler_y, 'scaler_y.pkl')


# Load the model and scalers
model.load_state_dict(torch.load('model_weights.pth'))
scaler_x = joblib.load("./scaler_x.pkl")
scaler_y = joblib.load("./scaler_y.pkl")
print(model)
print(scaler_x)

print(scaler_y)

X_test_tensor[0]

df["Energy delta[Wh]"].describe()
df.head(2)

w_df.head(1001)


rows = pd.DataFrame(
    [[0.9162, 0.7903, 0.7869, 1.0000, 0.9221, 0.7723, 0.8124]],
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
rows_tensor

# Prediction
pred = model(rows_tensor)
pred


#Download The Model
from IPython.display import FileLink

FileLink("./scaler_x.pkl")