import React, { useState, useEffect } from 'react';
import WeatherCard from '@components/core/WeatherCard/WeatherCard';
import './App.css';

// Données mock pour tester
const mockWeatherData = {
  city: 'Paris',
  country: 'FR',
  temperature: 22,
  feelsLike: 20,
  condition: 'Ensoleillé',
  conditionId: 800,
  humidity: 65,
  windSpeed: 12,
  windDirection: 'NE',
  pressure: 1013,
  uvIndex: 6,
  unit: 'metric',
};

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simule un appel API
    const timer = setTimeout(() => {
      setWeatherData(mockWeatherData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      // Simule de nouvelles données
      setWeatherData({
        ...mockWeatherData,
        temperature: mockWeatherData.temperature + 1,
        humidity: Math.floor(Math.random() * 20) + 60,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header temporaire */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🌤️ rk-weather
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Application météo moderne
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="btn-secondary">🌍 Ma position</button>
              <button className="btn-primary">🔍 Rechercher</button>
            </div>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale - WeatherCard */}
            <div className="lg:col-span-2">
              <WeatherCard
                weatherData={weatherData}
                loading={loading}
                onRefresh={handleRefresh}
              />

              {/* Section prévisions (placeholder) */}
              <div className="card mt-8 p-6">
                <h2 className="text-xl font-bold mb-4">
                  Prévisions sur 7 jours
                </h2>
                <div className="flex justify-between overflow-x-auto pb-4">
                  {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(
                    (day, i) => (
                      <div
                        key={day}
                        className="flex flex-col items-center p-3 min-w-[80px]"
                      >
                        <span className="text-gray-600 dark:text-gray-400">
                          {day}
                        </span>
                        <div className="text-3xl my-2">☀️</div>
                        <span className="font-bold">24°</span>
                        <span className="text-sm text-gray-500">18°</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar (placeholder) */}
            <div className="lg:col-span-1">
              <div className="card p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Prévisions horaires</h2>
                <div className="space-y-3">
                  {[14, 15, 16, 17, 18, 19].map(hour => (
                    <div
                      key={hour}
                      className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700"
                    >
                      <span className="text-gray-600 dark:text-gray-400">
                        {hour}h
                      </span>
                      <div className="text-2xl">☀️</div>
                      <span className="font-bold">{22 - (hour - 14)}°</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-xl font-bold mb-4">Villes favorites</h2>
                <div className="space-y-3">
                  {['Paris', 'Lyon', 'Marseille', 'Londres', 'New York'].map(
                    city => (
                      <button
                        key={city}
                        className="w-full flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <span>{city}</span>
                        <span className="text-gray-500">22°</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} rk-weather - Données météo par
            OpenWeatherMap
          </p>
          <p className="mt-2">
            <a
              href="#"
              className="hover:text-weather-primary transition-colors"
            >
              Conditions d'utilisation
            </a>{' '}
            •
            <a
              href="#"
              className="hover:text-weather-primary transition-colors ml-4"
            >
              Politique de confidentialité
            </a>{' '}
            •
            <a
              href="#"
              className="hover:text-weather-primary transition-colors ml-4"
            >
              À propos
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
