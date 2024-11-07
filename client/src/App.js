import React, { useState, useEffect, useRef } from "react";
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
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";
import LaptopIcon from '@mui/icons-material/Laptop';

// dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
    },
    background: {
      default: "#000000",
      paper: "#1c1c1c",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    divider: "#333",
  },
  typography: {
    fontFamily: "Montserrat, Roboto, sans-serif",
    h6: {
      fontWeight: 600,
      letterSpacing: "0.05em",
    },
    body1: {
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
    },
  },
});

// styled components
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

// Add styled component for nav buttons
const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followersFile, setFollowersFile] = useState(null);
  const [followingFile, setFollowingFile] = useState(null);
  const formRef = useRef(); // Add this line to declare formRef

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!followersFile || !followingFile) {
      setError("Please select both followers and following JSON files.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("followers", followersFile);
    formData.append("following", followingFile);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.notFollowingBack || !result.notFollowedByYou) {
        throw new Error("Invalid response format from server");
      }
      setResults(result);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default'
      }}>
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <InstagramIcon fontSize="large" />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2 }}>
                Instagram Follower Checker
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <NavButton
                href="https://ammaaralam.com"
                target="_blank"
                startIcon={<LaptopIcon />}
              >
                Coding Portfolio / Personal Site
              </NavButton>
              <NavButton
                href="https://github.com/Ammaar-Alam/doorUnlocker"
                target="_blank"
                startIcon={<GitHubIcon />}
              >
                GitHub
              </NavButton>
              <NavButton
                href="https://www.linkedin.com/in/Ammaar-Alam"
                target="_blank"
                startIcon={<LinkedInIcon />}
              >
                LinkedIn
              </NavButton>
              <NavButton
                href="https://ammaar.xyz"
                target="_blank"
                startIcon={<i className="fas fa-camera" />}
              >
                Photography
              </NavButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Container 
          maxWidth="md" 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            py: 4
          }}
        >
          {/* File Upload Form - Now First */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box
              component="form"
              id="upload-form"
              ref={formRef}
              onSubmit={handleSubmit}
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: 'center'
              }}
            >
              <Box mb={2}>
                <Typography variant="subtitle1">Following JSON:</Typography>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setFollowingFile(e.target.files[0])}
                  required
                  style={{ color: "#f8f7f9" }}
                />
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle1">Followers JSON:</Typography>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setFollowersFile(e.target.files[0])}
                  required
                  style={{ color: "#f8f7f9" }}
                />
              </Box>
              <StyledButton type="submit" variant="contained" color="primary">
                Check Followers
              </StyledButton>
            </Box>
          </Paper>

          {/* Instructions Section - Now Second */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" gutterBottom>
              How to Download Your Instagram Data
            </Typography>
            <ol style={{ paddingLeft: '20px', margin: '16px 0' }}>
              <li>Open Instagram App and tap the profile icon in the bottom right to go to your profile.</li>
              <li>Tap the more options icon in the top right, then tap <strong>Your activity</strong>.</li>
              <li>Under <strong>Information you shared with Instagram</strong>, tap <strong>Download your information</strong>.</li>
              <li>Enter your email address where you'd like to receive the download link, then tap <strong>Request a download</strong>.</li>
              <li>Choose <strong>Select types of information</strong> and scroll down to select <strong>Followers and following</strong>.</li>
              <li>Select <strong>Format: JSON</strong> and <strong>Date range: All time</strong>, then tap <strong>Submit request</strong>.</li>
              <li>You'll receive an email titled "Your Instagram Data" with a link to download your data. This might take up to 24 hours.</li>
            </ol>
          </Paper>

          {/* Results Section */}
          {results && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                backgroundColor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Not Following You Back</Typography>
                  <StyledPaper style={{ maxHeight: 400, overflow: "auto" }}>
                    <List>
                      {results.notFollowingBack.map(
                        (username, index) =>
                          username && (
                            <ListItem
                              button
                              key={index}
                              onClick={() =>
                                window.open(
                                  `https://www.instagram.com/${username}/`,
                                  "_blank"
                                )
                              }
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "#E4405F" }}>
                                  <InstagramIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={username}
                                secondary=" "
                              />
                            </ListItem>
                          )
                      )}
                    </List>
                  </StyledPaper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">You're Not Following Back</Typography>
                  <StyledPaper style={{ maxHeight: 400, overflow: "auto" }}>
                    <List>
                      {results.notFollowedByYou.map(
                        (username, index) =>
                          username && (
                            <ListItem
                              button
                              key={index}
                              onClick={() =>
                                window.open(
                                  `https://www.instagram.com/${username}/`,
                                  "_blank"
                                )
                              }
                            >
                              <ListItemAvatar>
                                <Avatar sx={{ bgcolor: "#E4405F" }}>
                                  <InstagramIcon />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={username}
                                secondary=" "
                              />
                            </ListItem>
                          )
                      )}
                    </List>
                  </StyledPaper>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Container>

        <Box 
          component="footer" 
          sx={{
            py: 2,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Container maxWidth="md">
            <Typography variant="body2" align="center" color="text.secondary">
              © {new Date().getFullYear()} Ammaar Alam. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
