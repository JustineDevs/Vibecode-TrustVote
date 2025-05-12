import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
  CircularProgress,
} from '@mui/material';
import Webcam from 'react-webcam';
import axios from 'axios';

function Vote() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [votingStatus, setVotingStatus] = useState(null);
  const webcamRef = useRef(null);

  useEffect(() => {
    fetchCandidates();
    fetchVotingStatus();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/candidates');
      if (response.data.success) {
        setCandidates(response.data.candidates);
      }
    } catch (err) {
      setError('Failed to fetch candidates');
    }
  };

  const fetchVotingStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/voting-status');
      if (response.data.success) {
        setVotingStatus(response.data);
      }
    } catch (err) {
      setError('Failed to fetch voting status');
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  };

  const handleVote = async () => {
    if (!selectedCandidate || !image) {
      setError('Please select a candidate and verify your face');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Convert base64 image to blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('candidateId', selectedCandidate);
      formData.append('faceImage', blob, 'face.jpg');

      // Send to backend
      const result = await axios.post('http://localhost:3000/api/vote', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (result.data.success) {
        setSuccess('Vote cast successfully!');
        setSelectedCandidate(null);
        setImage(null);
        fetchCandidates(); // Refresh candidate list
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  if (!votingStatus?.active) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Voting is not active
          </Typography>
          <Typography variant="body1" align="center">
            Please check back later when voting is open.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Cast Your Vote
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

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Select Candidate
            </Typography>
            <Grid container spacing={2}>
              {candidates.map((candidate) => (
                <Grid item xs={12} sm={6} key={candidate.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      bgcolor: selectedCandidate === candidate.id ? 'primary.light' : 'background.paper',
                    }}
                    onClick={() => setSelectedCandidate(candidate.id)}
                  >
                    <CardContent>
                      <Typography variant="h6">{candidate.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Votes: {candidate.voteCount}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Face Verification
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
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleVote}
            disabled={loading || !selectedCandidate || !image}
            sx={{ minWidth: 200 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Cast Vote'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Vote; 