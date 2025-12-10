import { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import MapContainer from './components/layout/MapContainer';
import PollutionDashboard from './components/features/PollutionDashboard';
import WeatherDashboard from './components/features/WeatherDashboard';
import GlobalNewsRow from './components/features/GlobalNewsRow';
import { getMedicalFacilities, getCoordinates } from './services/mockData';
import type { LocationData, TabType, MedicalFacility } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pollution');
  const [location, setLocation] = useState<LocationData>({
    id: '1',
    name: 'New Delhi, IN',
    coords: { lat: 28.6139, lng: 77.2090 },
    country: 'India'
  });
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);

  useEffect(() => {
    // Fetch nearby facilities when location changes
    getMedicalFacilities(location.coords).then(setFacilities);
  }, [location.coords]);

  const handleSearch = async (query: string) => {
    if (!query) return;

    // Check if user entered coordinates manually
    if (query.includes(',')) {
      const [lat, lng] = query.split(',').map(n => parseFloat(n.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setLocation(prev => ({ ...prev, coords: { lat, lng }, name: query }));
        return;
      }
    }

    // Otherwise treat as city name
    const result = await getCoordinates(query);
    if (result) {
      setLocation({
        id: Date.now().toString(),
        name: `${result.name}, ${result.state || result.country}`, // Show State in UI
        coords: { lat: result.lat, lng: result.lng },
        country: result.country,
        state: result.state
      });
    } else {
      alert('City not found');
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-accent/30 text-text-primary">
      <Header onSearch={handleSearch} locationName={location.name} />

      <main className="mx-auto max-w-7xl px-6 pb-12 pt-6 space-y-6">

        {/* Global News & Trade Ticker */}
        <GlobalNewsRow />

        {/* Map Section - Prominent */}
        <div className="relative h-[450px] w-full overflow-hidden rounded-3xl border border-navy-border shadow-navy">
          <MapContainer
            coords={location.coords}
            onLocationSelect={(coords) => setLocation(prev => ({ ...prev, coords, name: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` }))}
            facilities={facilities}
          />
        </div>

        {/* Tabs & Content */}
        <div className="space-y-6">

          {/* Tabs */}
          <div className="flex gap-2 rounded-xl bg-navy-surface p-1 border border-navy-border w-fit shadow-navy">
            {(['pollution', 'weather'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                    relative rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300
                    ${activeTab === tab
                    ? 'bg-brand-primary text-navy-main shadow-lg shadow-brand-primary/20'
                    : 'text-text-muted hover:text-text-primary hover:bg-navy-main/50'
                  }
                  `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Content Area - Dashboards */}
          <div className="rounded-3xl border border-navy-border bg-navy-surface p-6 min-h-[500px] shadow-navy">
            {activeTab === 'pollution' ? (
              <PollutionDashboard coords={location.coords} locationData={location} />
            ) : (
              <WeatherDashboard coords={location.coords} locationData={location} />
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
