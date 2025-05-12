import os
import face_recognition
import numpy as np
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from PIL import Image
import hashlib
import json
from datetime import datetime

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def hash_face_encoding(encoding):
    # Convert numpy array to bytes
    encoding_bytes = encoding.tobytes()
    # Create hash
    return hashlib.sha256(encoding_bytes).hexdigest()

@app.route('/process-face', methods=['POST'])
def process_face():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Load image and find face
            image = face_recognition.load_image_file(filepath)
            face_locations = face_recognition.face_locations(image)
            
            if not face_locations:
                return jsonify({'error': 'No face detected in image'}), 400
            
            # Get face encoding
            face_encoding = face_recognition.face_encodings(image, face_locations)[0]
            
            # Hash the face encoding
            hashed_encoding = hash_face_encoding(face_encoding)
            
            # Clean up
            os.remove(filepath)
            
            return jsonify({
                'success': True,
                'hashed_encoding': hashed_encoding
            })
            
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/verify-face', methods=['POST'])
def verify_face():
    if 'image' not in request.files or 'stored_hash' not in request.form:
        return jsonify({'error': 'Missing required data'}), 400
    
    file = request.files['image']
    stored_hash = request.form['stored_hash']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Load image and find face
            image = face_recognition.load_image_file(filepath)
            face_locations = face_recognition.face_locations(image)
            
            if not face_locations:
                return jsonify({'error': 'No face detected in image'}), 400
            
            # Get face encoding
            face_encoding = face_recognition.face_encodings(image, face_locations)[0]
            
            # Hash the face encoding
            current_hash = hash_face_encoding(face_encoding)
            
            # Clean up
            os.remove(filepath)
            
            # Compare hashes
            match = current_hash == stored_hash
            
            return jsonify({
                'success': True,
                'match': match,
                'current_hash': current_hash
            })
            
        except Exception as e:
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'Invalid file type'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000) 