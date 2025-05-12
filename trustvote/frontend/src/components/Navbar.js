import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';

function Navbar() {
  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar>
          <HowToVoteIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            TrustVote
          </Typography>
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/register"
              sx={{ mx: 1 }}
            >
              Register
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/vote"
              sx={{ mx: 1 }}
            >
              Vote
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/results"
              sx={{ mx: 1 }}
            >
              Results
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 