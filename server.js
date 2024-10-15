const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// serve static files from React app only in prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

function processJSON(followingData, followersData) {
  // Modify to include both username and timestamp in the results
  const following = followingData.relationships_following;
  const followers = followersData.relationships_followers;

  // Create maps from username to timestamp for following and followers
  const followingMap = new Map(
    following.map(user => [
      user.string_list_data[0].value,
      user.string_list_data[0].timestamp,
    ])
  );

  const followersMap = new Map(
    followers.map(user => [
      user.string_list_data[0].value,
      user.string_list_data[0].timestamp,
    ])
  );

  const notFollowingBack = [...followingMap.keys()]
    .filter(user => !followersMap.has(user))
    .map(user => ({
      username: user,
      timestamp: followingMap.get(user),
    }));

  const notFollowedByYou = [...followersMap.keys()]
    .filter(user => !followingMap.has(user))
    .map(user => ({
      username: user,
      timestamp: followersMap.get(user),
    }));

  return { notFollowingBack, notFollowedByYou };
}

app.post(
  "/api/check",
  upload.fields([
    { name: "following", maxCount: 1 },
    { name: "followers", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const followingFile = req.files["following"][0];
      const followersFile = req.files["followers"][0];

      const followingData = JSON.parse(fs.readFileSync(followingFile.path, "utf8"));
      const followersData = JSON.parse(fs.readFileSync(followersFile.path, "utf8"));

      const result = processJSON(followingData, followersData);

      // clean uploaded files
      fs.unlinkSync(followingFile.path);
      fs.unlinkSync(followersFile.path);

      res.json(result);
    } catch (error) {
      console.error("Error processing files:", error);
      res.status(500).json({ error: "An error occurred while processing the files." });
    }
  },
);

// serve react app in prod
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
