import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import Header from '@components/layout/Header/Header';
import WeatherCard from '@components/core/WeatherCard/WeatherCard';
import Sidebar from '@components/layout/Sidebar/Sidebar'; // IMPORT AJOUTÉ
import { WiDaySunny } from 'react-icons/wi';
// import './App.css';
import TemperatureChart from '@components/charts/TemperatureChart';
import PrecipitationChart from '@components/charts/PrecipitationChart';
import WindChart from '@components/charts/WindChart';

// Composant principal qui utilise le contexte
const WeatherApp = () => {
  const {
    weatherData,
    forecastData,
    hourlyForecast,
    loading,
    error,
    unit,
    city,
    favorites,
    searchCity,
    useGeolocation,
    changeUnit,
    addFavorite,
    removeFavorite,
    refreshData,
    clearError,
  } = useWeather();

  // Données simulées pour les villes à proximité (pour Goma)
  const nearbyCities = [
    { name: 'Bukavu', distance: '105km', temp: '24°' },
    { name: 'Butembo', distance: '245km', temp: '23°' },
    { name: 'Beni', distance: '280km', temp: '25°' },
    { name: 'Kigali', distance: '165km', temp: '22°' },
    { name: 'Gisenyi', distance: '95km', temp: '23°' },
  ];

  const handleCitySelect = cityName => {
    console.log('Sélection de ville:', cityName);
    searchCity(cityName);
  };

  const handleToggleFavorite = cityName => {
    console.log('Toggle favorite:', cityName);
    if (favorites.includes(cityName)) {
      removeFavorite(cityName);
    } else {
      addFavorite(cityName);
    }
  };

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      console.error('Erreur météo:', error);
    }
  }, [error]);

  // Fonction pour obtenir l'icône météo
  const getWeatherIcon = condition => {
    if (!condition) return '☀️';
    const cond = condition.toLowerCase();
    if (cond.includes('soleil') || cond.includes('clear')) return '☀️';
    if (cond.includes('nuage') || cond.includes('cloud')) return '☁️';
    if (cond.includes('pluie') || cond.includes('rain')) return '🌧️';
    if (cond.includes('orage') || cond.includes('storm')) return '⛈️';
    if (cond.includes('neige') || cond.includes('snow')) return '❄️';
    return '☀️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Header
        currentCity={city}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <main className="container mx-auto px-4 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300"
          >
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - WeatherCard */}
          <div className="lg:col-span-2 space-y-8">
            <WeatherCard
              weatherData={weatherData}
              loading={loading}
              onRefresh={refreshData}
              unit={unit}
              onUnitChange={changeUnit}
            />

            {/* Prévisions sur 7 jours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm"
            >
              <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                Prévisions sur 7 jours
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-4">
                {forecastData.length > 0
                  ? forecastData.slice(0, 7).map((day, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          {day.date?.split(' ')[0] || `Jour ${index + 1}`}
                        </span>
                        <span className="text-xs text-gray-400">
                          {day.date?.split(' ').slice(1).join(' ') || ''}
                        </span>
                        <div
                          className="text-3xl my-3"
                          role="img"
                          aria-label={day.condition || 'Ensoleillé'}
                        >
                          {getWeatherIcon(day.condition)}
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {day.temp_max || 24}°
                          </span>
                          <span className="text-sm text-gray-400">
                            {day.temp_min || 18}°
                          </span>
                        </div>
                      </div>
                    ))
                  : // Fallback si pas de données
                    Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          {
                            ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][
                              index
                            ]
                          }
                        </span>
                        <div className="text-3xl my-3">☀️</div>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-gray-900 dark:text-white">
                            24°
                          </span>
                          <span className="text-sm text-gray-400">18°</span>
                        </div>
                      </div>
                    ))}
              </div>
            </motion.div>

            {/* Graphiques interactifs */}
            <div className="space-y-8">
              <TemperatureChart hourlyForecast={hourlyForecast} unit={unit} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PrecipitationChart forecastData={forecastData} />
                <WindChart weatherData={weatherData} />
              </div>
            </div>
          </div>

          {/* SIDEBAR - COLONNE DE DROITE */}
          <div className="lg:col-span-1">
            <Sidebar
              hourlyForecast={hourlyForecast}
              dailyForecast={forecastData}
              nearbyCities={nearbyCities}
              favorites={favorites}
              weatherData={weatherData}
              onCitySelect={handleCitySelect}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
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
                Météo précise pour Goma et le monde
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
              © {new Date().getFullYear()} rk-weather • Data by OpenWeatherMap
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Wrapper avec le provider
const App = () => {
  return (
    <WeatherProvider>
      <WeatherApp />
    </WeatherProvider>
  );
};

export default App;
