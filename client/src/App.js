import React, { useState, useRef, useEffect } from "react";
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
  Tabs,
  Tab,
  Alert,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  ListItemButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LaptopIcon from '@mui/icons-material/Laptop';
import SearchIcon from '@mui/icons-material/Search';

// Portfolio-inspired dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#8ffcff",
    },
    background: {
      default: "#0a0a0a",
      paper: "#18181b",
    },
    text: {
      primary: "#ffffff",
      secondary: "#a1a1aa",
    },
    divider: "#27272a",
  },
  typography: {
    fontFamily: "Inter, Montserrat, Roboto, sans-serif",
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
  background: 'transparent',
  border: `2px solid rgba(143, 252, 255, 0.3)`,
  color: theme.palette.primary.main,
  fontWeight: 600,
  '&:hover': {
    background: 'rgba(143, 252, 255, 0.15)',
    borderColor: 'rgba(143, 252, 255, 0.9)',
    boxShadow: '0 0 15px rgba(143, 252, 255, 0.6)'
  }
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
  const [zipFile, setZipFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('zip'); // 'zip' | 'json'
  const formRef = useRef(); // Add this line to declare formRef
  const resultsRef = useRef();
  const [activeResultTab, setActiveResultTab] = useState('notFollowingBack');
  const [filterText, setFilterText] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (uploadMode === 'zip') {
        if (!zipFile) {
          setError("Please select your Instagram data ZIP file.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("zip", zipFile);
        response = await fetch("/api/check-zip", {
          method: "POST",
          body: formData,
        });
      } else {
        if (!followersFile || !followingFile) {
          setError("Please select both followers and following JSON files.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("followers", followersFile);
        formData.append("following", followingFile);
        response = await fetch("/api/check", {
          method: "POST",
          body: formData,
        });
      }

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

  // Auto-scroll to results when populated
  useEffect(() => {
    if (results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default'
      }}>
        <AppBar position="static" elevation={0} sx={{
          backgroundColor: 'rgba(10,10,10,0.8)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'saturate(180%) blur(8px)'
        }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <InstagramIcon fontSize="large" />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2, fontWeight: 700, background: 'linear-gradient(135deg, #8ffcff, #4dc6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                href="https://github.com/Ammaar-Alam/instagram-Checker"
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
          maxWidth="lg"
          sx={{
            flex: 1,
            py: 4
          }}
        >
          <Grid container spacing={4}>
            {/* Left column: alerts, uploader, instructions */}
            <Grid item xs={12} md={6}>
          {/* Cold start note */}
          <Alert severity="info" sx={{ backgroundColor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
            Note: First load can take up to ~1 minute due to Heroku dyno cold start.
          </Alert>

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
            <Tabs
              value={uploadMode}
              onChange={(e, v) => setUploadMode(v)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ mb: 2 }}
            >
              <Tab value="zip" label="Upload Instagram ZIP (Recommended)" />
              <Tab value="json" label="Upload followers.json + following.json" />
            </Tabs>
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}
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
              {uploadMode === 'zip' ? (
                <>
                  <Box mb={2}>
                    <Typography variant="subtitle1">Instagram Data ZIP:</Typography>
                    <input
                      type="file"
                      accept=".zip,application/zip,application/x-zip-compressed"
                      onChange={(e) => setZipFile(e.target.files[0])}
                      disabled={loading}
                      required
                      style={{ color: "#f8f7f9" }}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box mb={2}>
                    <Typography variant="subtitle1">Following JSON:</Typography>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => setFollowingFile(e.target.files[0])}
                      disabled={loading}
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
                      disabled={loading}
                      required
                      style={{ color: "#f8f7f9" }}
                    />
                  </Box>
                </>
              )}
              <StyledButton
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} /> : null}
              >
                {loading ? 'Processing…' : 'Check Followers'}
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
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #8ffcff, #4dc6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
            </Grid>

            {/* Right column: results panel (persistent) */}
            <Grid item xs={12} md={6} ref={resultsRef}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: { md: 'sticky' },
                  top: { md: 16 },
                  maxHeight: { md: 'calc(100vh - 32px)' },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #8ffcff, #4dc6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Results
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={`Not following you back: ${results ? results.notFollowingBack.length : 0}`} variant="outlined" color="primary" />
                    <Chip label={`You're not following: ${results ? results.notFollowedByYou.length : 0}`} variant="outlined" color="primary" />
                  </Box>
                </Box>

                <Tabs
                  value={activeResultTab}
                  onChange={(e, v) => setActiveResultTab(v)}
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab value="notFollowingBack" label="Not Following You Back" />
                  <Tab value="notFollowedByYou" label="You're Not Following Back" />
                </Tabs>

                <TextField
                  placeholder="Filter by username"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />

                <Divider />

                <StyledPaper sx={{ flex: 1, overflow: 'auto' }}>
                  <List>
                    {(() => {
                      const data = results ? (activeResultTab === 'notFollowingBack' ? results.notFollowingBack : results.notFollowedByYou) : [];
                      const filtered = filterText
                        ? data.filter((u) => u && u.toLowerCase().includes(filterText.toLowerCase()))
                        : data;
                      if (!results) {
                        return (
                          <ListItem>
                            <ListItemText primary="No results yet" secondary="Upload your Instagram ZIP or JSON files to see results here." />
                          </ListItem>
                        );
                      }
                      if (filtered.length === 0) {
                        return (
                          <ListItem>
                            <ListItemText primary="No usernames match your filter." />
                          </ListItem>
                        );
                      }
                      return filtered.map((username, index) => (
                        username && (
                          <ListItemButton
                            key={`${username}-${index}`}
                            onClick={() => window.open(`https://www.instagram.com/${username}/`, "_blank")}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "#E4405F" }}>
                                <InstagramIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={username} />
                          </ListItemButton>
                        )
                      ));
                    })()}
                  </List>
                </StyledPaper>
              </Paper>
            </Grid>
          </Grid>
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
