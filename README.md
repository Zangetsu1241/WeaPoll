# Eco-Aware & Global Insights Dashboard

A comprehensive dashboard combining real-time environmental data (Pollution, Weather), global news feeds, and economic indicators. Built with a modern, glassmorphic UI using React, Tailwind CSS, and Node.js.

## 🌟 Features

### 🌍 Environmental Monitoring
- **Real-Time Data**: Fetches live AQI, Temperature, and Weather forecasts via Open-Meteo APIs.
- **Dynamic Coloring**: Metrics change color (Green -> Maroon) based on intensity/danger levels.
- **Interactive Map**: Click anywhere on the map to get instant pollution and weather reports for that location.
- **AI Insights**: Provides contextual health advice based on current conditions.

### 📰 Global News & Trade
- **Live News Ticker**: Aggregates top headlines from World, Business, and Tech sectors (Google News RSS).
- **Auto-Refresh**: News feed updates automatically every 20 seconds.
- **Navigation Controls**: Manual "Previous" and "Next" arrows to browse headlines.
- **Market Data**: Tracks key indices and commodities with trend indicators (Red/Green).

### 🎨 Modern UI/UX
- **Deep Navy Theme**: A sleek, dark-mode accessible design with slate/cyan accents.
- **Glassmorphism**: Subtle transparencies and blur effects for a premium feel.
- **Color Legend**: Integrated visual index explaining the AQI/Metric color scale.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS (v4), Lucide Icons, Recharts, Leaflet Maps.
- **Backend**: Node.js, Express, Axios, RSS-Parser.
- **Data Sources**: Open-Meteo (Weather/Air Quality), Google News RSS, Overpass API (Maps).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (Node Package Manager)

### Installation

1.  **Clone the Repository** (if applicable) or navigate to the project folder.

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    Navigate to the server folder and install its specific packages:
    ```bash
    cd server
    npm install
    ```

---

## 🏃‍♂️ How to Run

To run the full application, you need to start both the **Backend Server** (for news proxying) and the **Frontend Client**.

### 1. Start the Backend
Open a terminal, navigate to the `server` directory, and run:
```bash
cd server
npx ts-node index.ts
```
> The backend will start on `http://localhost:3001`.

### 2. Start the Frontend
Open a **new** terminal window (keep the backend running), navigate to the root directory, and run:
```bash
npm run dev
```
> The frontend will typically start on `http://localhost:5173`.

### 3. Open the App
Visit `http://localhost:5173` in your browser.

---

## 🧭 Usage Guide

1.  **Search**: Enter a city name (e.g., "Tokyo") in the top bar to fly to that location.
2.  **Tabs**: Switch between **Pollution** and **Weather** views using the centered tabs.
3.  **News**: Watch the ticker for updates, or use the arrows to browse. Click a headline to read the full article.
4.  **Map**: Click anywhere on the map to analyze that specific coordinate.

---
*Built with React & Tailwind.*
