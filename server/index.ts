import express from 'express';
import cors from 'cors';
import axios from 'axios';
import Parser from 'rss-parser';

const app = express();
const port = 3001;
const parser = new Parser();

app.use(cors());
app.use(express.json());

// Helper to get today's date in YYYY-MM-DD
const getToday = () => new Date().toISOString().split('T')[0];

interface WeatherForecast {
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation_prob: number;
    code: number;
}

interface PollutionForecast {
    date: string;
    aqi_max: number;
}

// -----------------------------------------------------------------------------
// WEATHER API (Open-Meteo)
// -----------------------------------------------------------------------------
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: "Missing lat/lng" });

        // Fetch Current + 7 Day Forecast
        const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
            params: {
                latitude: lat,
                longitude: lng,
                current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,wind_speed_10m',
                daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max',
                timezone: 'auto'
            }
        });

        const data = response.data;
        const current = data.current;
        const daily = data.daily;

        // Process forecast
        const forecast: WeatherForecast[] = daily.time.map((date: string, i: number) => ({
            date,
            temp_max: daily.temperature_2m_max[i],
            temp_min: daily.temperature_2m_min[i],
            precipitation_prob: daily.precipitation_probability_max[i],
            code: daily.weather_code[i]
        }));

        res.json({
            temp: current.temperature_2m,
            feels_like: current.apparent_temperature,
            humidity: current.relative_humidity_2m,
            wind_speed: current.wind_speed_10m,
            description: getWeatherDescription(current.weather_code),
            uv_index: daily.uv_index_max[0],
            is_day: current.is_day,
            forecast: forecast
        });

    } catch (error) {
        console.error("Weather API Error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// -----------------------------------------------------------------------------
// POLLUTION API (Open-Meteo Air Quality)
// -----------------------------------------------------------------------------
app.get('/api/pollution', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: "Missing lat/lng" });

        // NOTE: We use hourly 'us_aqi' and aggregate because 'daily' params like 'us_aqi_max' are unreliable/invalid in some API versions.
        const response = await axios.get('https://air-quality-api.open-meteo.com/v1/air-quality', {
            params: {
                latitude: lat,
                longitude: lng,
                current: 'us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,ammonia',
                hourly: 'us_aqi',
                timezone: 'auto'
            }
        });

        const data = response.data;
        const current = data.current;
        const hourly = data.hourly;

        // Process hourly to get daily forecast
        const prediction: PollutionForecast[] = [];
        for (let i = 0; i < 5; i++) {
            const index = 12 + (i * 24);
            if (hourly.time[index] && hourly.us_aqi[index] !== undefined) {
                prediction.push({
                    date: hourly.time[index].split('T')[0],
                    aqi_max: hourly.us_aqi[index]
                });
            }
        }

        res.json({
            aqi: current.us_aqi,
            mainPollutant: getMainPollutant(current),
            components: {
                co: current.carbon_monoxide,
                no2: current.nitrogen_dioxide,
                o3: current.ozone,
                so2: current.sulphur_dioxide,
                pm2_5: current.pm2_5,
                pm10: current.pm10,
                nh3: current.ammonia
            },
            forecast: prediction,
            insight: getAIInsight(current.us_aqi)
        });

    } catch (error: any) {
        console.error("Pollution API Error:", error);
        res.status(500).json({ error: "Failed to fetch pollution data" });
    }
});

// -----------------------------------------------------------------------------
// NEWS API (Google News RSS)
// -----------------------------------------------------------------------------
app.get('/api/news', async (req, res) => {
    try {
        const { topic, city, state, country, scope, category } = req.query;
        let finalItems: any[] = [];

        const feedBaseUrl = 'https://news.google.com/rss/search?q=';
        const feedSuffix = '&hl=en-US&gl=US&ceid=US:en';

        // Helper to fetch and parse
        const fetchNews = async (query: string) => {
            try {
                const feed = await parser.parseURL(feedBaseUrl + encodeURIComponent(query) + feedSuffix);
                return feed.items.map(item => ({
                    id: item.guid || item.link,
                    title: item.title,
                    url: item.link,
                    source: item.contentSnippet || item.creator || "Google News",
                    time: item.pubDate
                }));
            } catch (e) {
                console.error(`Failed to fetch news for query: ${query}`, e);
                return [];
            }
        };

        // 1. global scope (Generic, Sport, Business, etc.)
        if (scope === 'global') {
            const searchQuery = category ? `${category} News` : `Global ${topic || 'World'} News`;
            finalItems = await fetchNews(searchQuery);
        } else {
            // 2. Hierarchical Strategy (Local Context)
            // Try City
            if (city) {
                const cityNews = await fetchNews(`${topic} in ${city}`);
                finalItems = [...finalItems, ...cityNews];
            }

            // If not enough, try State
            if (finalItems.length < 3 && state) {
                const stateNews = await fetchNews(`${topic} in ${state}`);
                stateNews.forEach(item => {
                    if (!finalItems.find(existing => existing.title === item.title)) {
                        finalItems.push(item);
                    }
                });
            }

            // If still not enough, try Country
            if (finalItems.length < 3 && country) {
                const countryNews = await fetchNews(`${topic} in ${country}`);
                countryNews.forEach(item => {
                    if (!finalItems.find(existing => existing.title === item.title)) {
                        finalItems.push(item);
                    }
                });
            }
        }

        res.json(finalItems.slice(0, 5)); // Return top 5

    } catch (error) {
        console.error("News API Error:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

// -----------------------------------------------------------------------------
// TRADE API (Mock Data)
// -----------------------------------------------------------------------------
app.get('/api/trade', (req, res) => {
    // Mock randomly fluctuating trade data
    const getRandomTrend = () => (Math.random() > 0.5 ? 'up' : 'down');
    const getRandomChange = () => (Math.random() * 2).toFixed(2);

    res.json({
        indices: [
            { name: "S&P 500", value: "4,783.45", change: getRandomChange(), trend: getRandomTrend() },
            { name: "NASDAQ", value: "15,628.90", change: getRandomChange(), trend: getRandomTrend() },
            { name: "Global Trade Vol", value: "$28.5T", change: getRandomChange(), trend: "up" },
            { name: "Crude Oil", value: "$76.40", change: getRandomChange(), trend: getRandomTrend() },
            { name: "Gold", value: "$2,035.10", change: getRandomChange(), trend: "up" }
        ]
    });
});

// -----------------------------------------------------------------------------
// FACILITIES API (Overpass API)
// -----------------------------------------------------------------------------
app.get('/api/facilities', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        // Search radius ~5km (0.05 degrees approx)
        const latNum = parseFloat(lat as string);
        const lngNum = parseFloat(lng as string);

        const query = `
            [out:json];
            (
              node["amenity"="hospital"](${latNum - 0.04},${lngNum - 0.04},${latNum + 0.04},${lngNum + 0.04});
              node["amenity"="clinic"](${latNum - 0.04},${lngNum - 0.04},${latNum + 0.04},${lngNum + 0.04});
              node["amenity"="pharmacy"](${latNum - 0.04},${lngNum - 0.04},${latNum + 0.04},${lngNum + 0.04});
            );
            out center 10;
        `;

        const response = await axios.get('https://overpass-api.de/api/interpreter', {
            params: { data: query }
        });

        const facilities = response.data.elements.map((el: any) => ({
            id: el.id,
            name: el.tags.name || "Unknown Facility",
            type: el.tags.amenity ? (el.tags.amenity.charAt(0).toUpperCase() + el.tags.amenity.slice(1)) : 'Health',
            address: el.tags["addr:street"] || "Address not available",
            distance: "Nearby", // Simple placeholder
            coords: { lat: el.lat, lng: el.lon }
        }));

        res.json(facilities);

    } catch (error) {
        console.error("Overpass API Error:", error);
        res.json([]);
    }
});

// -----------------------------------------------------------------------------
// GEOCODING API (Open-Meteo)
// -----------------------------------------------------------------------------
app.get('/api/geocode', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ error: "Missing city name" });

        const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
            params: {
                name: city,
                count: 1,
                language: 'en',
                format: 'json'
            }
        });

        if (!response.data.results || response.data.results.length === 0) {
            return res.status(404).json({ error: "City not found" });
        }

        const result = response.data.results[0];
        res.json({
            name: result.name,
            country: result.country,
            state: result.admin1,
            lat: result.latitude,
            lng: result.longitude
        });

    } catch (error) {
        console.error("Geocoding API Error:", error);
        res.status(500).json({ error: "Failed to fetch coordinates" });
    }
});

// -----------------------------------------------------------------------------
// UTILS
// -----------------------------------------------------------------------------

function getWeatherDescription(code: number) {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71 && code <= 77) return 'Snowy';
    if (code >= 80 && code <= 82) return 'Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
}

function getMainPollutant(current: any) {
    if (current.pm2_5 > 50) return "PM2.5";
    if (current.pm10 > 100) return "PM10";
    if (current.ozone > 100) return "Ozone";
    return "PM2.5";
}

function getAIInsight(aqi: number) {
    if (aqi < 50) return "Air quality is excellent. Great time for outdoor activities! 🏃‍♂️";
    if (aqi < 100) return "Air quality is moderate. Sensitive individuals should consider reducing heavy exertion.";
    if (aqi < 150) return "Unhealthy for Sensitive Groups. It's a good idea to wear a mask if you have asthma.";
    return "Health Alert: High pollution levels detected. Avoid outdoor activities and use air purifiers indooors 😷.";
}

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
