import React, { useState, useEffect } from 'react';
import Header from '@components/layout/Header/Header';
import WeatherCard from '@components/core/WeatherCard/WeatherCard';
import { WiDaySunny } from 'react-icons/wi';
import './App.css';

// Données mock initiales
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCity, setCurrentCity] = useState('Paris');
  const [favorites, setFavorites] = useState(['Paris', 'Lyon', 'New York']);

  // Initialisation : Simulation d'un premier chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setWeatherData(mockWeatherData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Gestion de la recherche de ville
  const handleSearch = query => {
    if (!query) return;
    setLoading(true);
    setCurrentCity(query);

    // Simule un appel API avec un délai
    setTimeout(() => {
      setWeatherData({
        ...mockWeatherData,
        city: query,
        temperature: Math.floor(Math.random() * 10) + 18,
        humidity: Math.floor(Math.random() * 20) + 60,
        condition: Math.random() > 0.5 ? 'Partiellement nuageux' : 'Ensoleillé',
        conditionId: Math.random() > 0.5 ? 802 : 800,
      });
      setLoading(false);
    }, 1000);
  };

  // Gestion de la géolocalisation
  const handleLocationClick = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentCity('Position actuelle');
      setWeatherData({
        ...mockWeatherData,
        city: 'Votre position',
        temperature: 21,
        condition: 'Partiellement nuageux',
        conditionId: 801,
      });
      setLoading(false);
    }, 1500);
  };

  // Rafraîchissement manuel (depuis la WeatherCard)
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setWeatherData(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() > 0.5 ? 1 : -1),
        humidity: Math.floor(Math.random() * 20) + 60,
      }));
      setLoading(false);
    }, 1000);
  };

  // Gestion du Thème (Sombre / Clair)
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* HEADER : Intègre la recherche, la localisation et le toggle thème */}
      <Header
        onSearch={handleSearch}
        onLocationClick={handleLocationClick}
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
        currentCity={currentCity}
        favorites={favorites}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLONNE PRINCIPALE : Carte météo et prévisions longues */}
          <div className="lg:col-span-2 space-y-8">
            <WeatherCard
              weatherData={weatherData}
              loading={loading}
              onRefresh={handleRefresh}
            />

            {/* Section Prévisions sur 7 jours */}
            <div className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Prévisions sur 7 jours
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-4">
                {[
                  { day: 'Lun', icon: '☀️', max: 24, min: 18 },
                  { day: 'Mar', icon: '⛅', max: 22, min: 17 },
                  { day: 'Mer', icon: '☁️', max: 20, min: 16 },
                  { day: 'Jeu', icon: '🌧️', max: 19, min: 15 },
                  { day: 'Ven', icon: '⛈️', max: 18, min: 14 },
                  { day: 'Sam', icon: '🌤️', max: 23, min: 17 },
                  { day: 'Dim', icon: '☀️', max: 25, min: 19 },
                ].map((forecast, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {forecast.day}
                    </span>
                    <div
                      className="text-3xl my-3"
                      role="img"
                      aria-label="météo"
                    >
                      {forecast.icon}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {forecast.max}°
                      </span>
                      <span className="text-sm text-gray-400">
                        {forecast.min}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphique de température (Visuel statique) */}
            <div className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Évolution sur 24h
              </h2>
              <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/30 dark:to-gray-700/10 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-blue-100 dark:border-gray-700">
                <p className="text-blue-400 dark:text-gray-500 font-medium">
                  Visualisation des données en cours de développement
                </p>
              </div>
            </div>
          </div>

          {/* SIDEBAR : Prévisions horaires, Indices et Villes proches */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prévisions horaires */}
            <div className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Aujourd'hui
              </h2>
              <div className="space-y-4">
                {[14, 16, 18, 20, 22].map(hour => (
                  <div
                    key={hour}
                    className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                  >
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {hour}h00
                    </span>
                    <div className="text-2xl">
                      {hour < 18 ? '☀️' : hour < 21 ? '🌇' : '🌙'}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {22 - Math.floor((hour - 14) / 2)}°
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-md">
                        {65 - (hour - 14)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indices météo */}
            <div className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Indices santé
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    label: "Qualité de l'air",
                    value: 'Bonne',
                    color: 'bg-green-500',
                  },
                  { label: 'Index UV', value: 'Moyen', color: 'bg-yellow-500' },
                  { label: 'Visibilité', value: '10 km', color: 'bg-blue-500' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl"
                  >
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${item.color}`}
                      ></div>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Villes suggérées */}
            <div className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Explorer
              </h2>
              <div className="space-y-2">
                {[
                  { city: 'Versailles', temp: 23, icon: '☀️' },
                  { city: 'Boulogne', temp: 22, icon: '⛅' },
                  { city: 'Nanterre', temp: 22, icon: '⛅' },
                ].map((nearby, i) => (
                  <button
                    key={i}
                    onClick={() => handleSearch(nearby.city)}
                    className="w-full flex justify-between items-center p-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{nearby.icon}</span>
                      <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {nearby.city}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {nearby.temp}°
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-12 py-10 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <WiDaySunny className="text-2xl text-yellow-500" />
                <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                  rk-weather
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                L'expérience météo redéfinie.
              </p>
            </div>

            <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
              >
                Conditions
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
              >
                Confidentialité
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
              >
                Contact
              </a>
            </nav>

            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} rk-weather • Data by OpenWeather
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
