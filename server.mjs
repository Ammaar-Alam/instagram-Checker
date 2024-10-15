import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import fetch from 'node-fetch';

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// serve static files from React app only in prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
}

function processJSON(followingData, followersData) {
  const followingArray = followingData.relationships_following || followingData;
  const followersArray = followersData.relationships_followers || followersData;

  // create maps from username to timestamp for following and followers
  const followingMap = new Map();
  followingArray.forEach((user) => {
    if (
      user.string_list_data &&
      Array.isArray(user.string_list_data) &&
      user.string_list_data.length > 0
    ) {
      const data = user.string_list_data[0];
      followingMap.set(data.value, data.timestamp);
    }
  });

  const followersMap = new Map();
  followersArray.forEach((user) => {
    if (
      user.string_list_data &&
      Array.isArray(user.string_list_data) &&
      user.string_list_data.length > 0
    ) {
      const data = user.string_list_data[0];
      followersMap.set(data.value, data.timestamp);
    }
  });

  const notFollowingBack = [...followingMap.keys()]
    .filter((user) => !followersMap.has(user))
    .map((user) => ({
      username: user,
      timestamp: followingMap.get(user),
    }));

  const notFollowedByYou = [...followersMap.keys()]
    .filter((user) => !followingMap.has(user))
    .map((user) => ({
      username: user,
      timestamp: followersMap.get(user),
    }));

  return { notFollowingBack, notFollowedByYou };
}

app.get('/api/profile-pic/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const text = await response.text();
    const jsonString = text.match(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/)[1];
    const json = JSON.parse(jsonString);
    const profilePicUrl = json.entry_data.ProfilePage[0].graphql.user.profile_pic_url_hd;
    res.json({ profilePicUrl });
  } catch (error) {
    console.error(`Error fetching profile picture for ${req.params.username}:`, error);
    res.status(500).json({ error: 'Failed to fetch profile picture' });
  }
});

app.post(
  "/api/check",
  upload.fields([
    { name: "following", maxCount: 1 },
    { name: "followers", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      // validate files are uploaded
      if (
        !req.files ||
        !req.files["following"] ||
        !req.files["followers"]
      ) {
        throw new Error("Both following and followers files are required.");
      }

      const followingFile = req.files["following"][0];
      const followersFile = req.files["followers"][0];

      const followingData = JSON.parse(
        fs.readFileSync(followingFile.path, "utf8")
      );
      const followersData = JSON.parse(
        fs.readFileSync(followersFile.path, "utf8")
      );

      const result = processJSON(followingData, followersData);

      // clean uploaded files
      fs.unlinkSync(followingFile.path);
      fs.unlinkSync(followersFile.path);

      res.json(result);
    } catch (error) {
      console.error("Error processing files:", error.message);
      res
        .status(500)
        .json({ error: "An error occurred while processing the files." });
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
