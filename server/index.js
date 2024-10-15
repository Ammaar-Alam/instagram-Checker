const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Configure multer for file uploads
const upload = multer();

app.post('/check', upload.fields([{ name: 'followers' }, { name: 'following' }]), (req, res) => {
  const followersFile = req.files['followers'][0];
  const followingFile = req.files['following'][0];

  if (!followersFile || !followingFile) {
    return res.status(400).json({ error: 'Followers and following files are required.' });
  }

  try {
    const followersData = JSON.parse(followersFile.buffer.toString('utf-8'));
    const followingData = JSON.parse(followingFile.buffer.toString('utf-8'));

    // Process the data to find discrepancies
    // ... your data processing code ...

    res.json({ message: 'Data processed successfully', result: /* your result */ });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Failed to process files.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
