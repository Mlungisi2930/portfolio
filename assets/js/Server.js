
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Configure this to your actual documents folder
const FILES_DIRECTORY = path.join(__dirname, 'documents');

// Create directory if it doesn't exist
if (!fs.existsSync(FILES_DIRECTORY)) {
  fs.mkdirSync(FILES_DIRECTORY);
  console.log('Created documents directory at:', FILES_DIRECTORY);
}

app.get('/download/:type', (req, res) => {
  const fileType = req.params.type;
  let fileName;

  // Flexible file naming
  if (fileType === 'resume') {
    fileName = findExistingFile(['Professional_Resume.pdf', 'resume.pdf', 'Resume.pdf']);
  } else if (fileType === 'certificates') {
    fileName = findExistingFile(['Professional_Certificates.zip', 'certificates.zip', 'Certs.zip']);
  } else {
    return res.status(400).json({ error: 'Invalid download type' });
  }

  if (!fileName) {
    return res.status(404).json({ 
      error: 'File not found',
      availableFiles: fs.readdirSync(FILES_DIRECTORY)
    });
  }

  const filePath = path.join(FILES_DIRECTORY, fileName);
  res.download(filePath, fileName);
});

function findExistingFile(possibleNames) {
  for (const name of possibleNames) {
    const filePath = path.join(FILES_DIRECTORY, name);
    if (fs.existsSync(filePath)) {
      return name;
    }
  }
  return null;
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Put your files in:', FILES_DIRECTORY);
  console.log('Current directory contents:', fs.readdirSync(FILES_DIRECTORY));
});