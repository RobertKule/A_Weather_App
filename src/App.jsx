import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherProvider, useWeather } from './contexts/WeatherContext';
import Header from '@components/layout/Header/Header';
import WeatherCard from '@components/core/WeatherCard/WeatherCard';
import { WiDaySunny } from 'react-icons/wi';
import './App.css';

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

  // Gérer les erreurs
  useEffect(() => {
    if (error) {
      console.error('Erreur météo:', error);
    }
  }, [error]);

  const handleToggleFavorite = () => {
    if (weatherData?.city) {
      if (favorites.includes(weatherData.city)) {
        removeFavorite(weatherData.city);
      } else {
        addFavorite(weatherData.city);
      }
    }
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
                          {day.date.split(' ')[0]}
                        </span>
                        <span className="text-xs text-gray-400">
                          {day.date.split(' ').slice(1).join(' ')}
                        </span>
                        <div
                          className="text-3xl my-3"
                          role="img"
                          aria-label={day.condition}
                        >
                          {getWeatherIcon(day.condition)}
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {day.temp_max}°
                          </span>
                          <span className="text-sm text-gray-400">
                            {day.temp_min}°
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
                          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][
                            index
                          ]}
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

            {/* Graphique de température */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Évolution sur 24h
              </h2>
              <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/30 dark:to-gray-700/10 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-blue-100 dark:border-gray-700">
                {hourlyForecast.length > 0 ? (
                  <div className="w-full h-full p-4">
                    <p className="text-blue-400 dark:text-gray-500 font-medium text-center">
                      Graphique des températures en développement
                    </p>
                  </div>
                ) : (
                  <p className="text-blue-400 dark:text-gray-500 font-medium">
                    Données horaires à venir
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Prévisions horaires */}
            {hourlyForecast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  Aujourd'hui
                </h2>
                <div className="space-y-4">
                  {hourlyForecast.slice(0, 5).map((hour, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0"
                    >
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {hour.time}
                      </span>
                      <div className="text-2xl">
                        {getHourlyIcon(hour.condition)}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {hour.temperature}°
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-md">
                          {hour.humidity}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Indices météo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm"
            >
              <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Indices santé
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    label: "Qualité de l'air",
                    value: weatherData?.airQuality || 'Bonne',
                    color: 'bg-green-500',
                  },
                  {
                    label: 'Index UV',
                    value: weatherData?.uvIndex || 'Moyen',
                    color: 'bg-yellow-500',
                  },
                  {
                    label: 'Visibilité',
                    value: weatherData?.visibility
                      ? `${weatherData.visibility} km`
                      : '10 km',
                    color: 'bg-blue-500',
                  },
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
            </motion.div>

            {/* Villes favorites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Explorer
              </h2>
              <div className="space-y-2">
                {favorites.map((favCity, index) => (
                  <button
                    key={index}
                    onClick={() => searchCity(favCity)}
                    className="w-full flex justify-between items-center p-4 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {index % 3 === 0 ? '☀️' : index % 3 === 1 ? '⛅' : '☁️'}
                      </span>
                      <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {favCity}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {index % 2 === 0 ? '22°' : '19°'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
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
                Données météo en temps réel
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

// Fonctions utilitaires
const getWeatherIcon = (condition) => {
  if (!condition) return '☀️';
  const cond = condition.toLowerCase();
  if (cond.includes('soleil') || cond.includes('clear')) return '☀️';
  if (cond.includes('nuage') || cond.includes('cloud')) return '☁️';
  if (cond.includes('pluie') || cond.includes('rain')) return '🌧️';
  if (cond.includes('orage') || cond.includes('storm')) return '⛈️';
  if (cond.includes('neige') || cond.includes('snow')) return '❄️';
  return '☀️';
};

const getHourlyIcon = (condition) => {
  if (!condition) return '☀️';
  const cond = condition.toLowerCase();
  if (cond.includes('soleil') || cond.includes('clear')) return '☀️';
  if (cond.includes('nuage') || cond.includes('cloud')) return '⛅';
  if (cond.includes('pluie') || cond.includes('rain')) return '🌧️';
  return '☀️';
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