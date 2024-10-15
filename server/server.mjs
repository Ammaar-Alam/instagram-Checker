import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";

const app = express();
const upload = multer({ dest: "uploads/" });

// Enable CORS
app.use(cors());

// Remove express.json() if not needed for other routes
// app.use(express.json());

app.post(
  "/check", // Updated endpoint
  upload.fields([
    { name: "following", maxCount: 1 },
    { name: "followers", maxCount: 1 },
  ]),
  (req, res) => {
    // ... existing code ...
  },
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}
