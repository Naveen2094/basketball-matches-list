const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;

const API_KEY = '0fd03143-c4b9-483a-8c0c-ab41cc3e9c67';

app.use(cors());

app.get('/api/upcoming-basketball', async (req, res) => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 90);

    const start = today.toISOString().split('T')[0];
    const end = futureDate.toISOString().split('T')[0];

    const apiUrl = `https://api.balldontlie.io/v1/games?start_date=${start}&end_date=${end}&per_page=100`;

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': API_KEY
      }
    });

    const games = response.data.data.map(game => {

      const isoDate = game.date;

      return {
        home_team: game.home_team.full_name,
        away_team: game.visitor_team.full_name,
        date: isoDate.slice(0, 10),           
        time: isoDate.slice(11, 16),          
        };
    });

    res.json(games);
  } catch (error) {
    console.error('Error fetching basketball data:', error.message);
    res.status(500).json({ message: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
