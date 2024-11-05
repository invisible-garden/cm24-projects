import ezkl
import json
import os
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

from model import FraudDetectionModel

csv_file_path = "transaction_data.csv"
df = pd.read_csv(csv_file_path)

le_category = LabelEncoder()
le_location = LabelEncoder()

df['Merchant_Category'] = le_category.fit_transform(df['Merchant_Category'])
df['Location'] = le_location.fit_transform(df['Location'])

X = df[['User_ID', 'Transaction_Amount', 'Merchant_Category', 'Location']].values
y = df['Is_Fraud'].values

scaler = StandardScaler()
X[:, 1] = scaler.fit_transform(X[:, 1].reshape(-1, 1)).flatten()

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

input_size = X_train.shape[1]
model = FraudDetectionModel(input_size)

criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

X_train_tensor = torch.tensor(X_train, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train, dtype=torch.float32).view(-1, 1)

X_test_tensor = torch.tensor(X_test, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test, dtype=torch.float32).view(-1, 1)

num_epochs = 10000
for epoch in range(num_epochs):
    outputs = model(X_train_tensor)
    loss = criterion(outputs, y_train_tensor)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (epoch+1) % 10 == 0:
        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')

best_accuracy = 0.0  # Initialize the best accuracy to 0
best_model_path = 'best_model.pth'  # Path to save the best model
with torch.no_grad():
    model.eval()
    predictions = model(X_test_tensor)
    predictions = predictions.round()  # Round to 0 or 1
    accuracy = (predictions.eq(y_test_tensor).sum().item() / len(y_test_tensor)) * 100
    print(f'Accuracy: {accuracy:.2f}%')

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        torch.save(model.state_dict(), best_model_path)
        print(f'Best model saved with accuracy: {best_accuracy:.2f}%')