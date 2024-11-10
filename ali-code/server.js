const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (like HTML, CSS, and JS)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
