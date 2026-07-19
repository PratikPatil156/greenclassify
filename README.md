# GreenClassify

GreenClassify is a web-based image classification tool that identifies vegetables using deep learning. The project consists of a Python Flask backend serving a trained Convolutional Neural Network (CNN) model and a responsive React frontend styled with a modern dark interface.

## Features
- **Instant Classification:** Detects vegetables from uploaded images with confidence scores.
- **Modern UI:** Dark mode dashboard built with React, featuring drag-and-drop uploads and scanning animations.
- **Lightweight Backend:** Flask REST API handles image processing and TensorFlow model inference.

## Supported Vegetables
Currently, the model is trained to classify:
- Potatoes 🥔
- Tomatoes 🍅

## Project Structure
```
greenclassify/
├── frontend/             # React application (Vite)
│   ├── src/              # UI components and styles
│   └── index.html
├── app.py                # Flask API server
├── train.py              # Model training script
├── models/               # Saved TensorFlow model (.h5)
└── requirements.txt      # Python dependencies
```

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js (v18 or higher)
- npm

### Installation & Setup

#### 1. Backend Setup
Run the backend server from the project root directory:
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Flask API
python app.py
```
*The Flask server runs on `http://localhost:5000`.*

#### 2. Frontend Setup
Run the frontend development server from the `frontend` directory:
```bash
# Go to the frontend folder
cd frontend

# Install Node packages
npm install

# Start the Vite development server
npm run dev
```
*The React application will open on `http://localhost:5173`.*

## Model Training
If you want to retrain the classifier or expand the dataset, place your training images in `code/Vegetable_Images/` and run:
```bash
python train.py
```