# NeuraX
# Team_id:NH09 Team_Name:AdaptEd
# Renalytics - Kidney Stone Prediction App

## Project Overview

Renalytics is a web-based application designed to predict the risk of kidney stone formation based on a patient's lab values. This project was developed as a hackathon submission, showcasing a complete end-to-end machine learning pipeline from data collection to a deployed, interactive web service.

The application leverages a machine learning model to analyze key physiological parameters and provide an instant risk assessment. The goal is to create an accessible tool that can assist in preliminary health screenings.

## Features

- **Intuitive User Interface**: A simple HTML form for entering patient lab data.
- **Machine Learning Backend**: A Python backend powered by Flask that handles data processing and prediction.
- **Pre-trained Model**: Uses a pre-trained scikit-learn model to accurately predict the risk of kidney stones.
- **Seamless Deployment**: Designed for easy deployment on platforms like Render, connected directly to this GitHub repository.

## Technical Stack

- **Frontend**: HTML, CSS
- **Backend**: Python, Flask
- **Machine Learning**: scikit-learn, NumPy
- **Deployment**: Render (or similar platforms like Heroku)

## Project Architecture & Data Flow

The application follows a standard client-server architecture. Here is a step-by-step breakdown of how data flows through the system:

1.  **Frontend (User Interface)**
    - The user accesses the web application's main page, which is rendered from `templates/index.html`.
    - They interact with an HTML form, entering six key lab values (Gravity, pH, Osmolarity, Conductivity, Urea, and Calcium).

2.  **Data Submission (Client-to-Server)**
    - Upon clicking the "Predict" button, the browser sends the form data to the backend server via an **HTTP POST request**.
    - The data is securely transmitted from the user's browser to the Flask application.

3.  **Backend Processing (Server-side)**
    - The `app.py` script, which serves as the Flask application, receives the POST request.
    - It extracts the six numerical values from the request payload.
    - This data is then converted into a NumPy array, which is the required input format for our machine learning model.

4.  **Machine Learning Model Prediction**
    - The backend loads the pre-trained model from the `kidney_stone_model.pkl` file.
    - The NumPy array containing the patient's data is fed into this model.
    - The model processes the data and generates a prediction: `1` (indicating a risk of stone) or `0` (indicating no risk).

5.  **Response Generation & Display**
    - The backend interprets the model's numerical prediction (`1` or `0`) and translates it into a clear, human-readable message (e.g., "The patient has a risk of developing a kidney stone.").
    - This message is then passed back to the `index.html` template.
    - The final rendered HTML page is sent back to the user's browser as the server's response.
    - The user's browser updates the page to display the prediction result, completing the full cycle.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/srujan109/renalytics-hackathon.git](https://github.com/srujan109/renalytics-hackathon.git)
    cd renalytics-hackathon
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    # For Windows
    python -m venv venv
    venv\Scripts\activate

    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask application:**
    ```bash
    python app.py
    ```

5.  **Access the app:** Open your web browser and go to `http://127.0.0.1:5000` to use the application.

## Deployment

This project is configured for easy deployment on a cloud platform like Render. Simply connect your Render account to this GitHub repository, and Render will automatically detect the `app.py` file and `requirements.txt` to build and deploy the application.

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn --bind 0.0.0.0:$PORT app:app`

## Credits

- **Developer**: Srujan
- **Dataset Source**: [If you used a public dataset, link to it here]
- **Special Thanks**: [Any other credits, e.g., to the hackathon organizers]

--- 
