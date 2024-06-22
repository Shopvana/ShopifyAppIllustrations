const API_KEY = process.env.REACT_APP_API_KEY; // Access the API key from environment variables
const BACKENDURL = process.env.REACT_APP_BACKENDURL; // Access the backend URL from environment variables
// Update the createNotionPage function to make a request to the proxy server
export const createNotionPage = async (name, email, description) => {
  console.log("API_KEY:", process.env.REACT_APP_API_KEY);
  console.log("BACKENDURL:", process.env.REACT_APP_BACKENDURL);

  try {
    const response = await fetch(`/create-notion-page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({ name, email, description })
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error creating Notion page:', error);
    throw error;
  }
};

