import React, { useState, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import Webcam from 'react-webcam';
import axios from 'axios';

function Register() {
  const [voterId, setVoterId] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const webcamRef = useRef(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!image || !voterId) {
      setError('Please provide both voter ID and face image');
      return;
    }

    try {
      // Convert base64 image to blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('voterId', voterId);
      formData.append('faceImage', blob, 'face.jpg');

      // Send to backend
      const result = await axios.post('http://localhost:3000/api/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (result.data.success) {
        setSuccess('Registration successful!');
        setVoterId('');
        setImage(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Voter Registration
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Voter ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            margin="normal"
            required
          />

          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Face Capture
            </Typography>
            {!image ? (
              <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Button
                  variant="contained"
                  onClick={captureImage}
                  sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}
                >
                  Capture
                </Button>
              </Box>
            ) : (
              <Box sx={{ position: 'relative' }}>
                <img
                  src={image}
                  alt="Captured face"
                  style={{ width: '100%', height: 300, objectFit: 'cover' }}
                />
                <Button
                  variant="outlined"
                  onClick={() => setImage(null)}
                  sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}
                >
                  Retake
                </Button>
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Register; 