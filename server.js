const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

function processJSON(followingData, followersData) {
  const following = new Set(
    followingData.relationships_following.map((user) => user.string_list_data[0].value),
  );
  const followers = new Set(
    followersData.relationships_followers.map((user) => user.string_list_data[0].value),
  );

  const notFollowingBack = [...following].filter((user) => !followers.has(user));
  const notFollowedByYou = [...followers].filter((user) => !following.has(user));

  return { notFollowingBack, notFollowedByYou };
}

app.post(
  "/api/check",
  upload.fields([
    { name: "following", maxCount: 1 },
    { name: "followers", maxCount: 1 },
  ]),
  (req, res) => {
    const followingFile = req.files["following"][0];
    const followersFile = req.files["followers"][0];

    const followingData = JSON.parse(fs.readFileSync(followingFile.path, "utf8"));
    const followersData = JSON.parse(fs.readFileSync(followersFile.path, "utf8"));

    const result = processJSON(followingData, followersData);

    // Clean up uploaded files
    fs.unlinkSync(followingFile.path);
    fs.unlinkSync(followersFile.path);

    res.json(result);
  },
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
