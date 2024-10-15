import React, { useState } from "react";
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
} from "@mui/material";

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#92dce5', // Non Photo Blue
    },
    background: {
      default: '#2b2d42', // Space Cadet
      paper: '#3c3f58', // Slightly lighter for paper components
    },
    text: {
      primary: '#f8f7f9', // Seasalt
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null); // Reset previous errors

    const formData = new FormData();
    formData.append("following", event.target.following.files[0]);
    formData.append("followers", event.target.followers.files[0]);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to check followers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Instagram Follower Checker
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={2}>
            <Typography variant="subtitle1">Following JSON:</Typography>
            <input type="file" name="following" accept=".json" required style={{ color: '#f8f7f9' }} />
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle1">Followers JSON:</Typography>
            <input type="file" name="followers" accept=".json" required style={{ color: '#f8f7f9' }} />
          </Box>
          <StyledButton type="submit" variant="contained" color="primary">
            Check Followers
          </StyledButton>
        </form>
        {error && (
          <Typography color="error" variant="body1">
            {error}
          </Typography>
        )}
        {loading && <CircularProgress />}
        {results && (
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Results:
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">Not Following You Back</Typography>
                <StyledPaper style={{ maxHeight: 400, overflow: 'auto' }}>
                  <List>
                    {results.notFollowingBack.map((user, index) => (
                      <ListItem
                        button
                        key={index}
                        onClick={() =>
                          window.open(`https://www.instagram.com/${user.username}/`, '_blank')
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={`https://unavatar.io/instagram/${user.username}`}
                            alt={user.username}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={`Followed on: ${new Date(user.timestamp * 1000).toLocaleString()}`}
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
                        onClick={() =>
                          window.open(`https://www.instagram.com/${user.username}/`, '_blank')
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={`https://unavatar.io/instagram/${user.username}`}
                            alt={user.username}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.username}
                          secondary={`Followed you on: ${new Date(user.timestamp * 1000).toLocaleString()}`}
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
          <Typography variant="body2">© 2024–25 Ammaar Alam. All rights reserved.</Typography>
          <Box mt={2}>
            <Button
              color="primary"
              href="https://github.com/Ammaar-Alam/doorUnlocker"
              target="_blank"
            >
              GitHub
            </Button>
            <Button
              color="primary"
              href="https://www.linkedin.com/in/Ammaar-Alam"
              target="_blank"
            >
              LinkedIn
            </Button>
            <Button color="primary" href="https://ammaar.xyz" target="_blank">
              Photography Portfolio
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
