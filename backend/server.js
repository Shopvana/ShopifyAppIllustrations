const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

const API_KEY = process.env.API_KEY; // Access the custom API key from environment variables
const NOTION_API_KEY = process.env.NOTION_API_KEY; // Access the Notion API key from environment variables
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID; // Access the Notion database ID from environment variables
const PORT = process.env.PORT || 3001;
// Use the CORS middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware to verify custom API key
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.sendStatus(401); // Unauthorized
  }
  next();
};

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// API routes
app.post('/create-notion-page', authenticateApiKey, async (req, res) => {
  const { name, email, description } = req.body;
  try {
    let data = JSON.stringify({
      "parent": {
        "database_id": NOTION_DATABASE_ID // Replace with your database ID
      },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": name
              }
            }
          ]
        },
        "Email": {
          "rich_text": [
            {
              "text": {
                "content": email
              }
            }
          ]
        },
        "Illustration Request": {
          "rich_text": [
            {
              "text": {
                "content": description
              }
            }
          ]
        }
      }
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.notion.com/v1/pages/',
      headers: { 
        'Authorization': `Bearer ${NOTION_API_KEY}`, 
        'Content-Type': 'application/json', 
        'Notion-Version': '2022-02-22'
      },
      data: data
    };

    const response = await axios.request(config);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating Notion page:', error);
    res.status(500).send('Error creating Notion page');
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${port}`);
});
