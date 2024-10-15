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
} from "@mui/material";

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
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom>
        Instagram Follower Checker
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <Typography variant="subtitle1">Following JSON:</Typography>
          <input type="file" name="following" accept=".json" required />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">Followers JSON:</Typography>
          <input type="file" name="followers" accept=".json" required />
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Check Followers
        </Button>
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
              <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
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
                        {/* Use a placeholder image as fetching actual profile pictures may not be feasible */}
                        <Avatar src={`https://via.placeholder.com/40`} alt={user.username} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        secondary={`Timestamp: ${new Date(user.timestamp * 1000).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">You're Not Following Back</Typography>
              <Paper style={{ maxHeight: 400, overflow: 'auto' }}>
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
                        {/* Use a placeholder image as fetching actual profile pictures may not be feasible */}
                        <Avatar src={`https://via.placeholder.com/40`} alt={user.username} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.username}
                        secondary={`Timestamp: ${new Date(user.timestamp * 1000).toLocaleString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default App;
