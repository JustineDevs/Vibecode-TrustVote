import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function Results() {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [votingStatus, setVotingStatus] = useState(null);

  useEffect(() => {
    fetchResults();
    const interval = setInterval(fetchResults, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchResults = async () => {
    try {
      const [candidatesResponse, statusResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/candidates'),
        axios.get('http://localhost:3000/api/voting-status'),
      ]);

      if (candidatesResponse.data.success) {
        setCandidates(candidatesResponse.data.candidates);
      }

      if (statusResponse.data.success) {
        setVotingStatus(statusResponse.data);
      }
    } catch (err) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = candidates.reduce((sum, candidate) => sum + parseInt(candidate.voteCount), 0);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Voting Results
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {votingStatus?.active && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Voting is still in progress. Results will update automatically.
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Total Votes Cast: {totalVotes}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {candidates.map((candidate) => {
            const percentage = totalVotes > 0
              ? ((parseInt(candidate.voteCount) / totalVotes) * 100).toFixed(1)
              : 0;

            return (
              <Grid item xs={12} md={6} key={candidate.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {candidate.name}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        Votes: {candidate.voteCount}
                      </Typography>
                      <Typography variant="body1">
                        Percentage: {percentage}%
                      </Typography>
                      <Box
                        sx={{
                          mt: 1,
                          height: 20,
                          bgcolor: 'grey.200',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${percentage}%`,
                            bgcolor: 'primary.main',
                            transition: 'width 0.5s ease-in-out',
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Container>
  );
}

export default Results; 