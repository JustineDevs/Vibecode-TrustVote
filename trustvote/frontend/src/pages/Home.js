import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import axios from 'axios';

function Home() {
  const [votingStatus, setVotingStatus] = useState(null);

  useEffect(() => {
    fetchVotingStatus();
  }, []);

  const fetchVotingStatus = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/voting-status');
      if (response.data.success) {
        setVotingStatus(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch voting status:', err);
    }
  };

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Voting',
      description: 'Your vote is secured using blockchain technology and biometric verification.',
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 40 }} />,
      title: 'Identity Verification',
      description: 'Advanced face recognition ensures only eligible voters can participate.',
    },
    {
      icon: <HowToVoteIcon sx={{ fontSize: 40 }} />,
      title: 'Transparent Results',
      description: 'Real-time results with complete transparency and auditability.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to TrustVote
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Decentralized Voting Platform with Biometric Verification
        </Typography>

        {votingStatus?.active && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Voting is currently active!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/vote"
              sx={{ mt: 2 }}
            >
              Cast Your Vote Now
            </Button>
          </Box>
        )}
      </Paper>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" gutterBottom align="center">
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Get Started
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/register"
            >
              Register to Vote
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={RouterLink}
              to="/results"
            >
              View Results
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Home; 