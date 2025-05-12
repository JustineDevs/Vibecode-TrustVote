import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  CircularProgress
} from '@mui/material';
import { HowToVote, Security, Timeline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [votingStatus, setVotingStatus] = useState(false);

  useEffect(() => {
    const checkVotingStatus = async () => {
      try {
        const response = await fetch('/api/voting-status');
        const data = await response.json();
        setVotingStatus(data.active);
      } catch (error) {
        console.error('Error checking voting status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkVotingStatus();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>TrustVote - Decentralized Voting Platform</title>
        <meta name="description" content="Secure and transparent blockchain-based voting system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to TrustVote
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            A secure and transparent blockchain-based voting system for the Philippines
          </Typography>
          
          {votingStatus && (
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => router.push('/vote')}
              sx={{ mt: 2 }}
            >
              Cast Your Vote Now
            </Button>
          )}
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <HowToVote sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Secure Voting
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Cast your vote securely using blockchain technology
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => router.push('/register')}>
                  Register to Vote
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Identity Verification
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Biometric verification ensures one person, one vote
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => router.push('/verify')}>
                  Verify Identity
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Timeline sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Transparent Results
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Real-time results with blockchain verification
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => router.push('/results')}>
                  View Results
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => router.push('/register')}
              sx={{ mr: 2 }}
            >
              Register to Vote
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => router.push('/results')}
            >
              View Results
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
} 