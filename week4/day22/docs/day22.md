# Day 22: AI Service API

## Overview

This AI service implementation for a Flask-based machine learning API.
The service loads a serialized model and preprocessing pipeline with `joblib`, exposes inference endpoints and returns prediction confidence when available.

## Key Features

- `POST /predict` for single example prediction
- `POST /batch_predict` for batch prediction
- `GET /health` for service health checks
- Model and preprocessing pipeline loading from disk
- Data preprocessing using a saved scaler
- Confidence scoring for probabilistic models

# Technologies Used

- Python 
- Flask
- NumPy
- Pandas
- Joblib
- Scikit-learn
# Technologies Used

## Python
A powerful and easy-to-learn programming language widely used for:
- Machine Learning
- Data Science
- Backend Development
- Automation
- AI Applications

### Specialty
- Simple syntax
- Huge AI/ML ecosystem
- Fast development
- Large community support

---

## Flask
A lightweight Python web framework used to build REST APIs and backend services.

### Specialty
- Minimal and flexible
- Easy API development
- Lightweight architecture
- Perfect for microservices and ML model deployment

### Used In This Project
- Creating API endpoints
- Handling HTTP requests/responses
- Running the AI prediction server

---

## NumPy
A numerical computing library for Python.

### Specialty
- Fast mathematical operations
- Multi-dimensional array support
- Optimized performance for scientific computing

### Used In This Project
- Probability calculations
- Confidence score processing
- Numerical data handling

---

## Pandas
A powerful data analysis and manipulation library.

### Specialty
- DataFrame support
- Easy data cleaning and transformation
- CSV/Excel/JSON handling

### Used In This Project
- Converting JSON input into DataFrames
- Preparing structured data for ML models

---

## Joblib
A Python library used for saving and loading machine learning models efficiently.

### Specialty
- Fast serialization
- Efficient model persistence
- Optimized for NumPy arrays and ML objects

### Used In This Project
- Loading trained ML models
- Loading preprocessing pipelines

---

## Scikit-learn
A popular machine learning library for Python.

### Specialty
- Easy-to-use ML algorithms
- Built-in preprocessing tools
- Model training and prediction support

### Used In This Project
- Model prediction
- Feature scaling
- Probability/confidence generation
- Preprocessing pipeline management



## Implementation Summary
*
*
*
*

### `AIService`

The `AIService` class builds the Flask app and handles model inference.

- `__init__(self, model_path: str, pipeline_path: str)`
  - Initializes Flask
  - Loads the model from `model_path`
  - Loads the preprocessing pipeline from `pipeline_path`
  - Sets up routing and logging

- `setup_routes(self)`
  - Registers API endpoints for prediction and health
  - Handles errors and returns JSON responses

- `preprocess_input(self, data: Dict[str, Any]) -> np.ndarray`
  - Converts input JSON to a pandas DataFrame
  - Applies the pipeline scaler
  - Returns processed NumPy input ready for prediction

- `make_prediction(self, data: Dict[str, Any]) -> Any`
  - Runs a single inference request
  - Returns the first value from the prediction array

- `make_batch_predictions(self, data: List[Dict[str, Any]]) -> List[Any]`
  - Processes batch requests
  - Uses only the first batch item in the current implementation
  - Returns predictions as a list

- `get_confidence(self, data: Dict[str, Any]) -> float`
  - Computes confidence from `predict_proba` if supported
  - Returns `1.0` for models without probability output

- `run(self, host: str = '0.0.0.0', port: int = 5000)`
  - Starts the Flask development server

## API Endpoints

### `POST /predict`

Request body:

```json
{
  "feature_1": 1.0,
  "feature_2": 2.5,
  "feature_3": 0.0
}
```

Response:

```json
{
  "success": true,
  "prediction": "class_label",
  "confidence": 0.93
}
```

### `POST /batch_predict`

Request body:

```json
[
  {"feature_1": 1.0, "feature_2": 2.5, "feature_3": 0.0},
  {"feature_1": 0.4, "feature_2": 1.8, "feature_3": 1.2}
]
```

Response:

```json
{
  "success": true,
  "predictions": ["class_a", "class_b"]
}
```

### `GET /health`

Response:

```json
{
  "status": "healthy",
  "model_loaded": true,
  "pipeline_loaded": true
}
```

## Notes & Improvements

- The batch prediction implementation currently only preprocesses `data[0]`.
  - For real batch processing, update `preprocess_input` to accept a list and process all rows.
- The pipeline is assumed to include a scaler only.
  - A production-ready pipeline should support multiple preprocessing steps, feature encoding, and validation.
- Add request validation and schema checks to protect against invalid input.
- Enhance logging for request tracing, model errors, and prediction metrics.
- Consider adding API authentication for secure model access.

## Run Instructions

1. Ensure model and pipeline files exist and are compatible with `joblib.load`.
2. Instantiate and start the service:

```python
from ai_service import AIService

service = AIService('model.joblib', 'pipeline.joblib')
service.run(host='0.0.0.0', port=5000)
```

3. Call the endpoints with JSON payloads as shown above.


# platform 
Used to detect Android/iOS platform.

# AsyncStorage
Used for local storage in React Native. Like browser localStorage.

# variables
private apiBaseUrl: string;
private modelCache: Map<string, any> = new Map();
private isOnline: boolean = true;

# apiBaseUrl Backend url
https://api.myapp.com

# isOnline
Tracks internet connection status.
Default: true

# Constructer 
constructor(apiBaseUrl: string) {
  this.apiBaseUrl = apiBaseUrl;
  this.initializeNetworkListener();
}
Run when object is created
 
# cache key
Converts input into unique string.

# Offline Support
if (cachedResult && !this.isOnline) {
   return cachedResult;
}
If internet is OFF:
return old cached prediction.

Very useful for mobile apps.

