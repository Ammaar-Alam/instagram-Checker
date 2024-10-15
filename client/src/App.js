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
} from "@mui/material";

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("following", event.target.following.files[0]);
    formData.append("followers", event.target.followers.files[0]);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
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
      {loading && <CircularProgress />}
      {results && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Results:
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Box flex={1} mr={2}>
              <Typography variant="h6">Not following you back:</Typography>
              <List>
                {results.notFollowingBack.map((user, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={user} />
                  </ListItem>
                ))}
              </List>
            </Box>
            <Box flex={1} ml={2}>
              <Typography variant="h6">You're not following:</Typography>
              <List>
                {results.notFollowedByYou.map((user, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={user} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default App;
