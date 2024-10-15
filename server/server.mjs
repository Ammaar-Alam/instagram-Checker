import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const app = express();
const upload = multer({ dest: "uploads/" });

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());

// serve static files from React app in prod
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// process JSON files
function processJSON(followingData, followersData) {
  const followingArray = followingData.relationships_following || followingData;
  const followersArray = followersData.relationships_followers || followersData;

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

// endpoint to get pfp's
// this doesn't really work, too lazy to fix
app.get("/api/profile-pic/:username", async (req, res) => {
  try {
    const username = req.params.username;
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const html = await response.text();
    const sharedDataRegex = /window\._sharedData = (.*);<\/script>/;
    const match = html.match(sharedDataRegex);

    if (!match) {
      throw new Error("Could not find shared data in the page");
    }

    const jsonData = JSON.parse(match[1]);
    const profilePicUrl = jsonData.entry_data.ProfilePage[0].graphql.user.profile_pic_url_hd;

    res.json({ profilePicUrl });
  } catch (error) {
    console.error(`Error fetching profile picture for ${req.params.username}:`, error);
    res.status(500).json({ error: "Failed to fetch profile picture" });
  }
});

// endpoint to process followers and following files
app.post(
  "/api/check",
  upload.fields([
    { name: "following", maxCount: 1 },
    { name: "followers", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      if (!req.files || !req.files["following"] || !req.files["followers"]) {
        throw new Error("Both following and followers files are required.");
      }

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
      console.error("Error processing files:", error.message);
      res.status(500).json({ error: "An error occurred while processing the files." });
    }
  },
);

// serve React app in prod
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
