import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on the server
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Route for AI Weather Insights & Recommendations
app.post('/api/ai-insights', async (req, res) => {
  try {
    const { weather } = req.body;
    if (!weather) {
      return res.status(400).json({ error: 'Weather data is required' });
    }

    const ai = getGenAI();
    if (!ai) {
      // Return a structured fallback if GEMINI_API_KEY is not configured yet
      return res.json({
        insight: {
          summary: `Currently ${weather.temperature}°C with ${weather.weatherDescription.toLowerCase()} in ${weather.cityName}. Humidity is at ${weather.humidity}% and wind speed is ${weather.windSpeed} km/h.`,
          outfitSuggestion: weather.temperature < 12
            ? 'Wear a warm jacket, layer up, and don’t forget a scarf.'
            : weather.temperature < 20
            ? 'A light sweater or jacket with comfortable pants is ideal.'
            : 'Light breathable cotton clothing, sunglasses, and comfortable footwear.',
          outdoorActivities: [
            { activity: 'Running', score: weather.temperature > 30 || weather.weatherCode > 60 ? 4 : 8, reason: weather.temperature > 30 ? 'High heat' : 'Favorable temperature' },
            { activity: 'Cycling', score: weather.windSpeed > 25 ? 5 : 8, reason: weather.windSpeed > 25 ? 'Breezy conditions' : 'Good visibility' },
            { activity: 'Outdoor Dining', score: weather.weatherCode > 50 ? 2 : 9, reason: weather.weatherCode > 50 ? 'Precipitation expected' : 'Pleasant ambient conditions' },
          ],
          healthTip: weather.uvIndex >= 6
            ? 'High UV radiation today. Apply SPF 30+ sunscreen and wear a hat.'
            : 'Stay hydrated throughout the day and take regular water breaks.',
          funFactOrCaution: weather.humidity > 80 ? 'High humidity can make the temperature feel warmer than it actually is.' : 'Great weather to get fresh air!',
        },
      });
    }

    const prompt = `Analyze this live weather report for ${weather.cityName}, ${weather.country}:
- Temperature: ${weather.temperature}°C (Feels like: ${weather.feelsLike}°C, Min: ${weather.tempMin}°C, Max: ${weather.tempMax}°C)
- Weather Condition: ${weather.weatherDescription}
- Humidity: ${weather.humidity}%
- UV Index: ${weather.uvIndex}
- Wind Speed: ${weather.windSpeed} km/h (Direction: ${weather.windDirection}°)
- Air Quality (US AQI): ${weather.aqi ?? 'N/A'} (${weather.usAqiLevel ?? 'N/A'})
- Precipitation Probability: ${weather.precipitationProbability}%

Provide a personalized, helpful AI weather analysis in JSON format with:
1. summary: A friendly 2-sentence breakdown of the day's atmospheric feel and what to expect.
2. outfitSuggestion: Specific clothing recommendations (layering, raincoat, sunglasses, shoes, etc.).
3. outdoorActivities: An array of 3-4 activities (e.g. Running, Cycling, Stargazing/Evening Walk, Outdoor Dining) with a score (1-10) and brief reason.
4. healthTip: Health/UV/Air Quality precaution based on humidity, UV, and AQI.
5. funFactOrCaution: An interesting weather insight or caution for the day.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert atmospheric meteorologist and lifestyle consultant. Provide concise, friendly, practical advice based on real-time weather data.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            outfitSuggestion: { type: Type.STRING },
            outdoorActivities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  activity: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  reason: { type: Type.STRING },
                },
                required: ['activity', 'score', 'reason'],
              },
            },
            healthTip: { type: Type.STRING },
            funFactOrCaution: { type: Type.STRING },
          },
          required: ['summary', 'outfitSuggestion', 'outdoorActivities', 'healthTip'],
        },
      },
    });

    const jsonText = response.text?.trim();
    if (jsonText) {
      const insight = JSON.parse(jsonText);
      return res.json({ insight });
    }

    throw new Error('Empty response from Gemini');
  } catch (error) {
    console.error('Error generating AI weather insights:', error);
    return res.status(500).json({ error: 'Failed to generate AI weather insights' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather App server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
