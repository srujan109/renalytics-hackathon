#!/usr/bin/env python3
"""
AI-Powered Kidney Stone Detection System
A single-file full-stack web application using Flask backend with embedded HTML/CSS/JS frontend.

Setup Instructions:
1. Install required dependencies:
   pip install flask numpy opencv-python pillow scikit-image

2. Run the application:
   python app.py

3. Open your browser and navigate to:
   http://localhost:5000

Note: This demo uses simulated kidney stone detection. In production, 
you would replace the mock detection with a real U-Net model.
"""

import os
import base64
import io
import json
import random
import numpy as np
import cv2
from PIL import Image, ImageDraw
from flask import Flask, render_template_string, request, jsonify
from skimage import measure, morphology
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

class KidneyStoneDetector:
    """
    Mock kidney stone detection system that simulates U-Net model behavior.
    In production, replace this with actual TensorFlow/PyTorch model loading and inference.
    """
    
    def __init__(self):
        self.model_loaded = True
        logger.info("Mock kidney stone detection model initialized")
    
    def preprocess_image(self, image):
        """
        Preprocess image for model input.
        Typically involves resizing, normalization, and format conversion.
        """
        # Convert PIL to numpy array
        img_array = np.array(image)
        
        # Convert to grayscale if needed
        if len(img_array.shape) == 3:
            img_gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        else:
            img_gray = img_array
        
        # Resize to model input size (typically 256x256 for U-Net)
        img_resized = cv2.resize(img_gray, (256, 256))
        
        # Normalize to [0, 1]
        img_normalized = img_resized.astype(np.float32) / 255.0
        
        return img_normalized, img_array
    
    def generate_mock_segmentation(self, image_shape):
        """
        Generate a realistic mock segmentation mask.
        In production, this would be: prediction = model.predict(preprocessed_image)
        """
        mask = np.zeros(image_shape[:2], dtype=np.uint8)
        
        # Simulate kidney stone detection with 70% probability
        if random.random() < 0.7:
            # Generate random stone-like shapes
            num_stones = random.randint(1, 3)
            for _ in range(num_stones):
                center_x = random.randint(50, image_shape[1] - 50)
                center_y = random.randint(50, image_shape[0] - 50)
                radius = random.randint(8, 25)
                
                # Create elliptical stone shape
                cv2.ellipse(mask, (center_x, center_y), (radius, int(radius * 0.8)), 
                           random.randint(0, 180), 0, 360, 255, -1)
        
        return mask
    
    def analyze_segmentation(self, mask):
        """
        Analyze the segmentation mask to extract stone properties.
        """
        # Find contours
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if not contours:
            return {
                'stone_detected': False,
                'size_pixels': 0,
                'location': 'None',
                'confidence': 0.0
            }
        
        # Analyze largest contour (primary stone)
        largest_contour = max(contours, key=cv2.contourArea)
        area = cv2.contourArea(largest_contour)
        
        # Get stone location
        M = cv2.moments(largest_contour)
        if M["m00"] != 0:
            cx = int(M["m10"] / M["m00"])
            cy = int(M["m01"] / M["m00"])
        else:
            cx, cy = 0, 0
        
        # Determine anatomical location based on position
        height = mask.shape[0]
        if cy < height / 3:
            location = "Upper Pole"
        elif cy < 2 * height / 3:
            location = "Mid-Kidney"
        else:
            location = "Lower Pole"
        
        return {
            'stone_detected': True,
            'size_pixels': int(area),
            'location': location,
            'confidence': random.uniform(0.85, 0.98),
            'center': (cx, cy)
        }
    
    def create_highlighted_image(self, original_image, mask, analysis_result):
        """
        Create an image with detected kidney stones highlighted.
        """
        # Convert original to RGB if needed
        if len(original_image.shape) == 3 and original_image.shape[2] == 3:
            highlighted = original_image.copy()
        else:
            highlighted = cv2.cvtColor(original_image, cv2.COLOR_GRAY2RGB)
        
        if analysis_result['stone_detected']:
            # Find contours
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Draw contours and highlights
            for contour in contours:
                # Draw filled contour with transparency
                overlay = highlighted.copy()
                cv2.fillPoly(overlay, [contour], (255, 100, 100))  # Red highlight
                highlighted = cv2.addWeighted(highlighted, 0.7, overlay, 0.3, 0)
                
                # Draw contour outline
                cv2.drawContours(highlighted, [contour], -1, (255, 0, 0), 2)
                
                # Add arrow and label
                if 'center' in analysis_result:
                    cx, cy = analysis_result['center']
                    cv2.arrowedLine(highlighted, (cx + 30, cy - 30), (cx, cy), (0, 255, 0), 2)
                    cv2.putText(highlighted, "STONE", (cx + 35, cy - 35), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        return highlighted
    
    def predict(self, image):
        """
        Main prediction method that processes an image and returns detection results.
        """
        try:
            # Preprocess image
            preprocessed, original_array = self.preprocess_image(image)
            
            # Generate mock segmentation (replace with actual model inference)
            mask = self.generate_mock_segmentation(original_array.shape)
            
            # Analyze segmentation results
            analysis = self.analyze_segmentation(mask)
            
            # Create highlighted image
            highlighted_image = self.create_highlighted_image(original_array, mask, analysis)
            
            return analysis, highlighted_image
            
        except Exception as e:
            logger.error(f"Error during prediction: {str(e)}")
            raise

# Initialize detector
detector = KidneyStoneDetector()

# HTML template with embedded CSS and JavaScript
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Kidney Stone Detection System</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .upload-area {
            border: 2px dashed #cbd5e0;
            transition: all 0.3s ease;
        }
        .upload-area:hover {
            border-color: #4299e1;
            background-color: #ebf8ff;
        }
        .upload-area.dragover {
            border-color: #3182ce;
            background-color: #bee3f8;
        }
        .spinner {
            border: 4px solid #f3f4f6;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">AI Kidney Stone Detection</h1>
            <p class="text-gray-600">Advanced medical imaging analysis powered by deep learning</p>
        </div>

        <!-- Main Content -->
        <div class="max-w-6xl mx-auto">
            <!-- Upload Section -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 class="text-2xl font-semibold text-gray-800 mb-4">Upload Medical Image</h2>
                
                <div id="uploadArea" class="upload-area rounded-lg p-8 text-center cursor-pointer">
                    <div id="uploadContent">
                        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <p class="text-lg text-gray-600 mb-2">Drop your kidney image here</p>
                        <p class="text-sm text-gray-500 mb-4">or click to browse (JPG, JPEG, PNG)</p>
                        <button type="button" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                            Select Image
                        </button>
                    </div>
                </div>
                
                <input type="file" id="fileInput" accept=".jpg,.jpeg,.png" class="hidden">
            </div>

            <!-- Processing State -->
            <div id="processingState" class="bg-white rounded-lg shadow-md p-6 mb-8 hidden">
                <div class="flex items-center justify-center">
                    <div class="spinner mr-4"></div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-800">Processing Image...</h3>
                        <p class="text-gray-600">Analyzing kidney image for stone detection</p>
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div id="resultsSection" class="hidden fade-in">
                <!-- Image Display -->
                <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Image Analysis</h2>
                    
                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- Original Image -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-700 mb-3">Original Image</h3>
                            <div class="border rounded-lg overflow-hidden">
                                <img id="originalImage" class="w-full h-auto" alt="Original kidney image">
                            </div>
                        </div>
                        
                        <!-- Processed Image -->
                        <div>
                            <h3 class="text-lg font-medium text-gray-700 mb-3">Detection Results</h3>
                            <div class="border rounded-lg overflow-hidden">
                                <img id="processedImage" class="w-full h-auto" alt="Processed kidney image with detection">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Report Section -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Medical Report</h2>
                    
                    <div class="grid md:grid-cols-3 gap-6 mb-6">
                        <!-- Detection Status -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Detection Status</h4>
                            <div id="detectionStatus" class="text-2xl font-bold"></div>
                        </div>
                        
                        <!-- Size Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Estimated Size</h4>
                            <div id="stoneSize" class="text-2xl font-bold text-gray-800"></div>
                        </div>
                        
                        <!-- Location Information -->
                        <div class="bg-gray-50 rounded-lg p-4">
                            <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Location</h4>
                            <div id="stoneLocation" class="text-2xl font-bold text-gray-800"></div>
                        </div>
                    </div>
                    
                    <!-- Detailed Report -->
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <h4 class="text-lg font-medium text-blue-800 mb-2">Clinical Summary</h4>
                        <div id="detailedReport" class="text-blue-700"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const processingState = document.getElementById('processingState');
        const resultsSection = document.getElementById('resultsSection');

        // File upload handling
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFile(files[0]);
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFile(e.target.files[0]);
            }
        });

        async function handleFile(file) {
            // Validate file type
            if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
                alert('Please select a valid image file (JPG, JPEG, or PNG).');
                return;
            }
            
            // Show processing state
            resultsSection.classList.add('hidden');
            processingState.classList.remove('hidden');
            
            // Create FormData for upload
            const formData = new FormData();
            formData.append('image', file);
            
            try {
                // Send to backend
                const response = await fetch('/predict', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result = await response.json();
                
                // Display results
                displayResults(file, result);
                
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred during image analysis. Please try again.');
            } finally {
                // Hide processing state
                processingState.classList.add('hidden');
            }
        }
        
        function displayResults(originalFile, result) {
            // Display original image
            const originalImage = document.getElementById('originalImage');
            originalImage.src = URL.createObjectURL(originalFile);
            
            // Display processed image
            const processedImage = document.getElementById('processedImage');
            processedImage.src = `data:image/png;base64,${result.processed_image}`;
            
            // Update detection status
            const detectionStatus = document.getElementById('detectionStatus');
            if (result.stone_detected) {
                detectionStatus.textContent = 'DETECTED';
                detectionStatus.className = 'text-2xl font-bold text-red-600';
            } else {
                detectionStatus.textContent = 'NOT DETECTED';
                detectionStatus.className = 'text-2xl font-bold text-green-600';
            }
            
            // Update size and location
            document.getElementById('stoneSize').textContent = 
                result.stone_detected ? `${result.size_pixels} pixels` : 'N/A';
            document.getElementById('stoneLocation').textContent = result.location;
            
            // Update detailed report
            document.getElementById('detailedReport').textContent = result.report;
            
            // Show results section
            resultsSection.classList.remove('hidden');
        }
    </script>
</body>
</html>
'''

@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template_string(HTML_TEMPLATE)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Handle image upload and return kidney stone detection results.
    """
    try:
        # Check if image file is present
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        # Validate file type
        allowed_extensions = {'.jpg', '.jpeg', '.png'}
        file_ext = os.path.splitext(file.filename.lower())[1]
        if file_ext not in allowed_extensions:
            return jsonify({'error': 'Invalid file type. Please upload JPG, JPEG, or PNG images.'}), 400
        
        # Open and process image
        image = Image.open(file.stream)
        
        # Ensure image is in RGB mode
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Run detection
        analysis_result, highlighted_image = detector.predict(image)
        
        # Convert highlighted image to base64
        pil_image = Image.fromarray(highlighted_image)
        buffer = io.BytesIO()
        pil_image.save(buffer, format='PNG')
        processed_image_b64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        # Generate detailed report
        if analysis_result['stone_detected']:
            confidence_pct = analysis_result.get('confidence', 0) * 100
            report = f"""
            Analysis completed successfully. A kidney stone has been detected in the submitted image.
            
            Key Findings:
            • Stone presence: Confirmed with {confidence_pct:.1f}% confidence
            • Estimated size: {analysis_result['size_pixels']} pixels in area
            • Anatomical location: {analysis_result['location']}
            
            Recommendation: Please consult with a qualified urologist or radiologist for professional medical interpretation and treatment planning.
            
            Note: This AI analysis is for educational purposes and should not replace professional medical diagnosis.
            """.strip()
        else:
            report = """
            Analysis completed successfully. No kidney stones were detected in the submitted image.
            
            The AI system did not identify any significant abnormalities consistent with kidney stone presence in this image.
            
            Note: This AI analysis is for educational purposes and should not replace professional medical diagnosis. 
            If you have symptoms or concerns, please consult with a healthcare professional.
            """.strip()
        
        # Return JSON response
        return jsonify({
            'stone_detected': analysis_result['stone_detected'],
            'size_pixels': analysis_result['size_pixels'],
            'location': analysis_result['location'],
            'confidence': analysis_result.get('confidence', 0),
            'processed_image': processed_image_b64,
            'report': report
        })
        
    except Exception as e:
        logger.error(f"Error in /predict endpoint: {str(e)}")
        return jsonify({'error': f'An error occurred during image processing: {str(e)}'}), 500

@app.errorhandler(413)
def too_large(e):
    return jsonify({'error': 'File too large. Please upload an image smaller than 16MB.'}), 413

if __name__ == '__main__':
    print("=" * 60)
    print("AI-Powered Kidney Stone Detection System")
    print("=" * 60)
    print("Starting Flask server...")
    print("Open your browser and navigate to: http://localhost:5000")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)