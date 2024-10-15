import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Avatar,
  ListItemAvatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  styled,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
    },
    background: {
      default: '#000000',
      paper: '#1c1c1c',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: '#333',
  },
  typography: {
    fontFamily: 'Montserrat, Roboto, sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: '0.05em',
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
    },
  },
});

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profilePictures, setProfilePictures] = useState({});
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);

  useEffect(() => {
    if (results) {
      const usernames = [
        ...results.notFollowingBack.map(user => user.username),
        ...results.notFollowedByYou.map(user => user.username),
      ];

      const fetchProfilePictures = async () => {
        const newProfilePictures = {};

        await Promise.all(
          usernames.map(async (username) => {
            if (!profilePictures[username]) {
              try {
                const response = await fetch(`/api/profile-pic/${username}`);
                const data = await response.json();
                newProfilePictures[username] = data.profilePicUrl;
              } catch (error) {
                console.error(`Error fetching profile picture for ${username}:`, error);
              }
            }
          })
        );

        setProfilePictures((prev) => ({ ...prev, ...newProfilePictures }));
      };

      fetchProfilePictures();
    }
  }, [results]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('followers', followersFile);
    formData.append('following', followingFile);

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred.');
      }

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <InstagramIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Instagram Follower Checker
          </Typography>
          {/* Social links in AppBar */}
          <IconButton
            color="inherit"
            href="https://github.com/Ammaar-Alam"
            target="_blank"
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.linkedin.com/in/Ammaar-Alam"
            target="_blank"
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://ammaar.xyz"
            target="_blank"
          >
            <LanguageIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, textAlign: 'center' }}>
          <Box mb={2}>
            <Typography variant="subtitle1">Following JSON:</Typography>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFollowingFile(e.target.files[0])}
              required
              style={{ color: '#f8f7f9' }}
            />
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1">Followers JSON:</Typography>
            <input
              type="file"
              accept=".json"
              onChange={(e) => setFollowersFile(e.target.files[0])}
              required
              style={{ color: '#f8f7f9' }}
            />
          </Box>
          <StyledButton type="submit" variant="contained" color="primary">
            Check Followers
          </StyledButton>
        </Box>
        {error && (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        )}
        {loading && <CircularProgress />}
        {results && (
          <Box mt={4}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Not Following You Back</Typography>
                <StyledPaper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {results.notFollowingBack.map((user, index) => (
                      <ListItem
                        button
                        key={index}
                        onClick={() => window.open(`https://www.instagram.com/${user.username}/`, '_blank')}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={`https://unavatar.io/instagram/${user.username}`}
                            alt={user.username}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={`Followed on: ${new Date(user.timestamp * 1000).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </StyledPaper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">You're Not Following Back</Typography>
                <StyledPaper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {results.notFollowedByYou.map((user, index) => (
                      <ListItem
                        button
                        key={index}
                        onClick={() => window.open(`https://www.instagram.com/${user.username}/`, '_blank')}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={`https://unavatar.io/instagram/${user.username}`}
                            alt={user.username}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={`Followed you on: ${new Date(user.timestamp * 1000).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </StyledPaper>
              </Grid>
            </Grid>
          </Box>
        )}
        <Box mt={4} textAlign="center">
          <Typography variant="body2">© {new Date().getFullYear()} Ammaar Alam. All rights reserved.</Typography>
          <Box mt={2}>
            <IconButton
              color="inherit"
              href="https://github.com/Ammaar-Alam"
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://www.linkedin.com/in/Ammaar-Alam"
              target="_blank"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://ammaar.xyz"
              target="_blank"
            >
              <LanguageIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
